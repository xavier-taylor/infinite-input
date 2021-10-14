import { Pool } from 'pg';
import { shuffle } from 'lodash';
import {
  Document,
  LearningState,
  SentenceWord,
  StudyType,
  Word,
} from '../schema/gql-model';
import {
  cc_cedict,
  document,
  learning_state,
  sentence,
  sentence_word,
  student_word,
  student_word_listen,
  student_word_read,
  word,
} from './sql-model';
import { Knex } from 'knex';
import DataLoader from 'dataloader';
import { DateTime } from 'luxon';
import {
  MAX_GRAPHQL_INT,
  MIN_GRAPHQL_INT,
  toGraphQLInteger,
} from '../utils/number';
import { toSQLLearningStateEnum } from '../utils/typeConversions';
import { student_word_study } from './manual-model';
import { getStartOfTomorrow } from '../utils/datetime';

// IMPORTANT - cannot reuse dataloader instances across requests.
// so cannot use datasource instance across requests.
// this begs the question - why use data source? - possibly need to rip data source out
// Avoid multiple requests from different users using the DataLoader instance, which could result in cached data incorrectly appearing in each request. Typically, DataLoader instances are created when a Request begins, and are not used once the Request ends.

// TODO replace the datasource approach with the data loader approach
// Why? The SQL datasource doesn't handle batching, which is the main reason I want it.
// Firstly, the dataloader is hitting the database lots of times (many 'get word by id x' style queries)
// rather than a single 'get word by ids (x,y,z) query. Also (even worse), duplicate ids in the same query
// are not batched (ie, we have 'get word by id x' appearing multiple times (for a given valye of x!!))
// github.com/graphql/dataloader/blob/master/examples/Knex.md
// https://github.com/kriasoft/graphql-starter#readme

// https://github.com/cvburgess/SQLDataSource/issues/42
// actually, apparently you can use dataloader on top of this library.

// TODO - consider removing knex and just use pg.

// TODO explore more TS support
export type sortedDocument = Pick<document, 'chinese' | 'english' | 'id'> & {
  count_due: number;
  distinct_due_words: string[];
  fraction_due: number;
  sentence_len: number;
};
export class PostgresqlRepo {
  // just having a go with this types, not sure if correct
  private ccceLoader: DataLoader<string, cc_cedict[], unknown>;
  private wordLoader: DataLoader<unknown, any, unknown>;
  private sentenceWordLoader: DataLoader<unknown, any, unknown>;
  private sentenceLoader: DataLoader<unknown, any, unknown>;
  private documentLoader: DataLoader<unknown, any, unknown>;

  constructor(private knex: Knex) {
    this.ccceLoader = new DataLoader(
      (keys: Readonly<string[]>) =>
        this.batchGetCCCE.bind(this)(
          keys
        ) /* ,
      {
        batchScheduleFn: (callback) => setTimeout(callback, 10),
      } */
    ); // todo remember bind and check if necassary
    this.wordLoader = new DataLoader(
      (keys: Readonly<string[]>) =>
        this.batchGetWord.bind(this)(
          keys
        ) /* ,
      {
        batchScheduleFn: (callback) => setTimeout(callback, 10),
      } */
    );
    this.sentenceWordLoader = new DataLoader(
      (keys: Readonly<string[]>) =>
        this.batchGetSentenceWords.bind(this)(
          keys
        ) /* ,
      {
        batchScheduleFn: (callback) => setTimeout(callback, 10),
      } */
    );
    this.sentenceLoader = new DataLoader(
      (keys: Readonly<string[]>) =>
        this.batchGetSentences.bind(this)(
          keys
        ) /* ,
      {
        batchScheduleFn: (callback) => setTimeout(callback, 10),
      } */
    );
    this.documentLoader = new DataLoader((keys: Readonly<string[]>) =>
      this.batchGetDocument.bind(this)(keys)
    );
  }

  // these 'batch' methods are just the callbacks to my DataLoader calls, and could be moved into
  // some other code, ie 'create data loaders' ???

  // This needs to match the constraints mentioned here: https://github.com/graphql/dataloader
  private async batchGetCCCE(
    hanzis: Readonly<string[]>
  ): Promise<Array<cc_cedict[]>> {
    // because each chineseword can have multiple cc_cedict entrys, the return value is an array of arrays
    // can either have the SQL query return a flat list of cc_cedict boiz, and map them myself?
    // or could have the sql query return it in [[cc_cedict]]. even better if it could return
    // a map?

    // this is the most naive approach and requires some logic here in the code
    // TODO improve this so that more of that logic takes place in sql?
    // TODO why is this based on simplified?
    const defs = await this.knex
      .select<cc_cedict[]>('*')
      .from('cc_cedict')
      .whereIn('simplified', hanzis);
    const map: Record<string, cc_cedict[]> = defs.reduce((acc, cur) => {
      if (acc[cur.simplified]) {
        acc[cur.simplified].push(cur);
      } else {
        acc[cur.simplified] = [cur];
      }
      return acc;
    }, {} as Record<string, cc_cedict[]>);
    return hanzis.map((h) => map[h] ?? []);
  }

  private async batchGetWord(hanzis: Readonly<string[]>): Promise<Array<word>> {
    const words = await this.knex
      .select<word[]>('*')
      .from('word')
      .whereIn('hanzi', hanzis);
    const map: Record<string, word> = words.reduce((acc, cur) => {
      // hanzi is the primary key of word, so each cur.hanzi can only appear once
      acc[cur.hanzi] = cur;
      return acc;
    }, {} as Record<string, word>);
    return hanzis.map(
      (h) => map[h] ?? new Error(` couldn't find word with hanzi ${h}`)
    );
  }
  // for each sentence id, this returns an array of sentence words
  private async batchGetSentenceWords(
    sentenceIds: Readonly<string[]>
  ): Promise<Array<sentence_word[]>> {
    const sWords = await this.knex
      .select<sentence_word[]>('*')
      .from('sentence_word')
      .whereIn('sentence_id', sentenceIds);
    const map: Record<string, sentence_word[]> = sWords.reduce((acc, cur) => {
      if (acc[cur.sentence_id]) {
        acc[cur.sentence_id].push(cur);
      } else {
        acc[cur.sentence_id] = [cur];
      }
      return acc;
    }, {} as Record<string, sentence_word[]>);
    return sentenceIds.map((h) => map[h] ?? []);
  }
  // for each sentence id, this returns an array of sentence words
  private async batchGetSentences(
    documentIds: Readonly<string[]>
  ): Promise<Array<sentence[]>> {
    const sentences = await this.knex
      .select<sentence[]>('*')
      .from('sentence')
      .whereIn('document_id', documentIds);
    const map: Record<string, sentence[]> = sentences.reduce((acc, cur) => {
      if (acc[cur.document_id]) {
        acc[cur.document_id].push(cur);
      } else {
        acc[cur.document_id] = [cur];
      }
      return acc;
    }, {} as Record<string, sentence[]>);
    return documentIds.map((h) => map[h] ?? []);
  }
  private async batchGetDocument(
    documentIds: Readonly<string[]>
  ): Promise<Array<document>> {
    const documents = await this.knex
      .select<document[]>('*')
      .from('document')
      .whereIn('id', documentIds);
    const map: Record<string, document> = documents.reduce((acc, cur) => {
      acc[cur.id!] = cur;
      return acc;
    }, {} as Record<string, document>);
    return documentIds.map(
      (d) => map[d] ?? new Error(` couldn't find document with id ${d}`)
    );
  }

  // prior to data loader we were doing seperate calls for each, including
  // for the same word over and over
  async getCCCE(hanzi: string) {
    return this.ccceLoader.load(hanzi);
  }

  async getWord(hanzi: string): Promise<word> {
    return this.wordLoader.load(hanzi);
    // TODO the use of 'first' in that loader safe?
  }

  async getSentenceWords(sentenceId: string) {
    return this.sentenceWordLoader.load(sentenceId);
    // TODO sort this - in sql land?
  }
  async getSentences(documentId: string) {
    // TODO make this sorted (at sql level or here at js by sentence id)
    return this.sentenceLoader.load(documentId);
  }
  // TODO - this query must join with sentence_word to check if words are locked
  // TODO see if this query matches my current best query in pgadmin - the one below is potentially old
  // TODO time this query - if knex is making it slow do it raw
  // TODO workout the specific 'due' logic we want, and apply in in both dues (sad that I am replicating logic, can I improve that?)
  async getDue(
    type: StudyType,
    dayStartUTC: string,
    studentId: string = '1'
  ): Promise<{ documents: document[]; orphans: student_word_study[] }> {
    const vars = {
      student_word:
        type === StudyType.Read ? 'student_word_read' : 'student_word_listen',
      studentId,
      tomorrow: getStartOfTomorrow(dayStartUTC),
    };
    // this is reused below - can I reuse this result set there?
    const dueWords = await this.knex
      .select<student_word_read[] | student_word_listen[]>('*')
      .from(vars.student_word)
      .where('student_id', '=', vars.studentId)
      .where('due', '<', vars.tomorrow);
    const dueWordsMap = dueWords.reduce((acc, cur) => {
      acc.set(cur.word_hanzi, cur.interval);
      return acc;
    }, new Map<string, number>());

    new Set(dueWords.map((d) => d.word_hanzi));

    const candidates = `
SELECT 
	chinese, id, english, n_non_punct 
FROM
	document 
WHERE NOT EXISTS (
	SELECT 
		1
	FROM
		sentence_word
	LEFT JOIN
		:student_word:
	ON
		:student_word:.student_id = :studentId AND :student_word:.word_hanzi = sentence_word.word_hanzi
	WHERE
		:student_word:.word_hanzi IS null AND sentence_word.document_id = document.id 
  AND 
    sentence_word.universal_part_of_speech != 'PUNCT'
)`;

    const due = `SELECT word_hanzi FROM :student_word: WHERE student_id = :studentId AND due < :tomorrow`;

    const docs = (await this.knex
      .with('candidates', this.knex.raw(candidates, vars))
      .with('due', this.knex.raw(due, vars))
      .select(
        this.knex.raw(`
        id, chinese, english, count(distinct(due.word_hanzi)) as count_due, 
	array_agg(distinct(due.word_hanzi)) as distinct_due_words, 
	(
		case when 
			n_non_punct =0 
		then 
			0 
		else 
			cast(count(distinct(due.word_hanzi)) as float)/cast(n_non_punct as float) 
		end
	) as fraction_due,	
	n_non_punct as sentence_len
        `)
      )
      .where('n_non_punct', '>', 1)
      .from('candidates')
      .join('sentence_word', 'candidates.id', '=', 'sentence_word.document_id')
      .join('due', 'sentence_word.word_hanzi', '=', 'due.word_hanzi')
      .groupBy('id', 'chinese', 'english', 'n_non_punct')
      .orderBy([
        { column: 'count_due', order: 'desc' },
        { column: 'fraction_due', order: 'desc' },
      ])) as sortedDocument[];

    const selectionResults = this.selectDocuments(docs, dueWordsMap);
    const wordToDBRow: Map<string, typeof dueWords[number]> = dueWords.reduce(
      (acc, cur) => {
        acc.set(cur.word_hanzi, cur);
        return acc;
      },
      new Map<string, typeof dueWords[number]>()
    );
    const orphans = selectionResults.orphans.map((o) => ({
      ...wordToDBRow.get(o)!,
      studyType: type,
    }));

    // There is an inefficiency here - if looking to speed up this query, just return full documents earlier in the process
    const documents = await this.getDocumentsById(
      selectionResults.documents.map((d) => d.id!)
    );
    return { documents: shuffle(documents), orphans: shuffle(orphans) };
  }
  /**
   *  !! This method mutates the props that are passed into it.
   *  !! if we realize we need them to remain unmutated, first deep clone them here
   * For words with an interval of 1, return up to 3 documents (and at least 1)
   * For words with other intervals, return 1 document
   * For any word where we couldnt find 1/3 documents per the above, return that word as an orphan
   * @param docs precondition: sorted by count_due desc, fraction_due desc
   * @param dueWords
   */
  selectDocuments(
    docs: sortedDocument[],
    dueWords: Map<string, number> // a map of due words with their intervals
  ): { documents: sortedDocument[]; orphans: Array<string> } {
    function getDesiredAmount(intervalForWord: number) {
      return intervalForWord === 1 ? 3 : 1; // we want words to appear 3 times if they have interval of 1, which means they are new or recently lapsed words
    }
    let orphansMightExist = false;
    const chosenDocuments = [];
    const includedWords = new Map<string, number>(); // a map from due words to the number of times they have been included in our chosenDocuments set
    while (dueWords.size > 0 && !orphansMightExist && docs.length > 0) {
      // take the 'best' document
      const best = docs.shift()!;
      if (best.distinct_due_words.length === 0) {
        // we mutate this array as we go, see below
        orphansMightExist = true; // orphans exist, unless it was some word with interval 1 that we are still looking for 2nd/3rd documents for
        break;
      }
      chosenDocuments.push(best);

      for (let word of best.distinct_due_words) {
        // keep track of how many times we have included each due word
        const wordCount = includedWords.get(word);
        if (wordCount !== undefined) {
          includedWords.set(word, wordCount + 1);
        } else {
          includedWords.set(word, 1);
        }
        // & remove them from dueWords once we have enough of them
        const intervalForWord = dueWords.get(word);
        if (intervalForWord !== undefined) {
          const desiredAmount = getDesiredAmount(intervalForWord);
          const newWordCount = includedWords.get(word)!;
          if (newWordCount >= desiredAmount) {
            dueWords.delete(word);
          }
        } // if it is undefined, we already removed it from dueWords because we have enough of it
      }

      for (let doc of docs) {
        doc.distinct_due_words = doc.distinct_due_words.filter((w) =>
          dueWords.has(w)
        );
      }
      // sort by the number of distinct due words which we are still looking for. if a draw, conserve the original sort logic
      docs.sort((a, b) => {
        if (b.distinct_due_words === a.distinct_due_words) {
          if (b.count_due === a.count_due) {
            return b.fraction_due - a.fraction_due;
          } else {
            return b.count_due - a.count_due;
          }
        } else {
          return b.distinct_due_words.length - a.distinct_due_words.length;
        }
      });
    }

    let unshuffledOrphans: string[] = [];
    for (const [word, interval] of dueWords) {
      const desiredAmount = getDesiredAmount(interval);
      const includedTimes = includedWords.get(word) ?? 0;
      const difference = desiredAmount - includedTimes;
      for (let i = 0; i < difference; i++) {
        unshuffledOrphans.push(word);
      }
    }

    return {
      documents: chosenDocuments,
      orphans: unshuffledOrphans,
    };
  }

  // This is an undata loaded/ unbatched. just for testing.
  async getWords(words: string[]) {
    return this.knex.select<word[]>('*').from('word').whereIn('hanzi', words);
  }

  async getDocumentsById(ids: string[]): Promise<document[]> {
    return this.batchGetDocument(ids);
  }

  // I am using this for concordance - TODO - make a toggleable version that only returns docs where you know all the words, or even just sortable by whether you know al lthe words
  // ^ a better idea is adding hsk tags to documents, so can return documents for the concordance sorted by hsk level
  async getDocuments(options: { including: string[] }): Promise<document[]> {
    return this.knex('document')
      .join('sentence_word', 'document.id', '=', 'sentence_word.document_id')
      .limit(10)
      .select(
        'id',
        'sub_corpus_title',
        'corpus_title',
        'previous_document',
        'english',
        'chinese'
      )
      .whereIn('word_hanzi', options.including);
    // .limit(10); // TODO fix this so that if arg is not passed the wherein is not applied
    // TODO make this just return unique documents!
  }

  async documentById(id: string) {
    return (this.knex('document')
      .select<document>(
        'id',
        'sub_corpus_title',
        'corpus_title',
        'previous_document',
        'english',
        'chinese'
      )
      .where({ id })
      .first() as unknown) as document; // todo make this less bad
  }

  /**
   *
   * @param userId
   * @param count
   */
  async getNewWords(userId: string, count: number) {
    return this.knex('student_word')
      .select<student_word[]>('*')
      .where({ student_id: userId, locked: false })
      .whereNot({ learning: 'learned' })
      .orderBy([
        { column: 'learning', order: 'desc' },
        { column: 'position', order: 'asc' },
      ])
      .limit(count);
  }

  async getUnLockedNewWordCount(userId: string): Promise<number> {
    const res = await this.knex('student_word')
      .count('*')
      .where({ student_id: userId, locked: false })
      .whereNot({ learning: 'learned' });

    const count = res[0]['count'];
    // FALSE: The value of count will, by default, have type of string | number. This may be counter-intuitive but some connectors (eg. postgres) will automatically cast BigInt result to string when javascript's Number type is not large enough for the value.
    // note leaving this misleading statemetn from the docs here for posterity. The type of count was a string - even when its value was zero!
    return toGraphQLInteger(count);
  }

  async getCountWordsAlreadyLearnedToday(
    userId: string,
    dayStartUTC: string
  ): Promise<number> {
    const res = await this.knex('student_word')
      .count('*')
      .where({ student_id: userId })
      .where('date_learned', '>=', dayStartUTC)
      .where('date_learned', '<', getStartOfTomorrow(dayStartUTC));
    const count = res[0]['count'];
    return toGraphQLInteger(count);
  }

  async updateStudentWord(
    userId: string,
    hanzi: string,
    newDue: string,
    newLearning: LearningState
  ): Promise<student_word> {
    const res = await this.knex<student_word>('student_word')
      .update({
        due: new Date(newDue),
        learning: toSQLLearningStateEnum(newLearning),
      })
      .where('student_id', '=', userId)
      .where('word_hanzi', '=', hanzi)
      .returning('*');
    return res[0];
  }
  // A special case of updateStudentWord, when a word is set to 'learned',
  // we need to create corresponding rows in student_word_read/listen
  async learnWord(
    userId: string,
    hanzi: string,
    newDue: string,
    newLearning: LearningState.Learned
  ): Promise<student_word> {
    // TODO wrap in try catch etc https://knexjs.org/#Transactions
    const updatedStudentWord = await this.knex.transaction(async (trx) => {
      const res = await trx<student_word>('student_word')
        .update({
          due: null,
          learning: toSQLLearningStateEnum(newLearning),
          date_learned: DateTime.now().toUTC().toJSDate(),
        })
        .where('student_id', '=', userId)
        .where('word_hanzi', '=', hanzi)
        .returning('*');

      const newRow: student_word_read | student_word_listen = {
        due: new Date(newDue),
        student_id: userId,
        interval: 1,
        word_hanzi: hanzi,
      };
      await trx<student_word_read>('student_word_read').insert(newRow);
      await trx<student_word_listen>('student_word_listen').insert(newRow);

      return res[0];
    });
    return updatedStudentWord;
  }
  async getSentencesByDocumentId(
    document_id: string
  ): Promise<Array<sentence>> {
    return this.knex('sentence')
      .select<sentence[]>('*')
      .where({ document_id })
      .orderBy([{ column: 'document_index' }]);
  }
  // returns the union of words due for listening and due for reading today
  async getDueWords(userId: string, dayStartUTC: string) {
    const tomorrow = getStartOfTomorrow(dayStartUTC);
    const listenP = this.knex('student_word_listen')
      .select<student_word_listen[]>('*')
      .where({ student_id: userId })
      .where('due', '<', tomorrow);
    const readP = this.knex('student_word_listen')
      .select<student_word_read[]>('*')
      .where({ student_id: userId })
      .where('due', '<', tomorrow);
    const [listen, read] = await Promise.all([listenP, readP]);
    return Array.from(new Set([...listen, ...read])).map((t) => t.word_hanzi);
  }

  async getLearnedWords(userId: string) {
    return (
      await this.knex('student_word')
        .select<student_word[]>('*')
        .where({ learning: 'learned' })
        .where({ student_id: userId })
    ).map((w) => w.word_hanzi);
  }

  async getStudentWordIfExists(
    userId: string,
    word: string
  ): Promise<student_word | undefined> {
    return this.knex<student_word>('student_word')
      .select('*')
      .where('student_id', '=', userId)
      .where('word_hanzi', '=', word)
      .first();
  }
  // TODO change inconsistnent use of word and hanzi throughout app
  async toggleStudentWordLock(
    userId: string,
    hanzi: string
  ): Promise<student_word> {
    // TODO 1) is there a sql injection risk 2) an I make this neater
    const raw = `   
      ( student_id, 
        word_hanzi, 
        locked, 
        date_last_unlocked,
        learning, 
        position,
        tags
        )
VALUES 
      ( ?,
        ?,
        false, 
        ?, 
        'not_yet_learned'::learning_state, 
        0,
        '{}'::text[]
       )
ON CONFLICT (student_id, word_hanzi) DO UPDATE
SET locked = not student_word.locked
RETURNING 
        student_id,
        word_hanzi,
        locked,
        date_last_unlocked,
        date_learned,
        learning,
        due,
        position,
        tags;
`;

    const now = DateTime.now();
    const student_word = (await this.knex('student_word').insert(
      this.knex.raw(raw, [userId, hanzi, now.toUTC().toJSDate()])
    )) as any;
    return student_word.rows[0] as any; // forgive me christ jesus
  }
}

/*

KNEX NOTES:


this works
  return this.knex
      .select(
        'document.chinese',
        'document.id',
        'document.english',
        this.knex.raw('count(document.id)')
      )
      .from('document')
      .join('sentence', 'document.id', '=', 'sentence.document_id')
      .groupBy('document.chinese', 'document.id', 'document.english')
      .having(this.knex.raw('count(document.id)'), '>', '1')
      .limit(1);

      
*/
