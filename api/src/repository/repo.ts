import { Pool } from 'pg';
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

// TODO explore more TS support
export class PostgresqlRepo {
  // just having a go with this types, not sure if correct
  private ccceLoader: DataLoader<string, cc_cedict[], unknown>;
  private wordLoader: DataLoader<unknown, any, unknown>;
  private sentenceWordLoader: DataLoader<unknown, any, unknown>;
  private sentenceLoader: DataLoader<unknown, any, unknown>;

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
  // TODO in future - do a big beautiful join myself, or use a lib like monster join
  // see if that is 'faster' than using resolvers at each level as I have here
  // NOTE - that is an optimization. don't do until mvp is usable!
  // TODO - this query must join with sentence_word to check if words are locked
  // TODO see if this query matches my current best query in pgadmin - the one below is potentially old
  // TODO workout the specific 'due' logic we want, and apply in in both dues (sad that I am replicating logic, can I improve that?)
  async getDue(type: StudyType, studentId: string = '1'): Promise<document[]> {
    const vars = {
      student_word:
        type === StudyType.Read ? 'student_word_read' : 'student_word_listen',
      studentId,
    };
    // this is reused below
    const dueWords = await this.knex
      .select<student_word_read[] | student_word_listen[]>('word_hanzi')
      .from(vars.student_word)
      .where('student_id', '=', vars.studentId)
      .where('due', '<=', 'CURRENT_DATE'); // TODO get actual due logic done

    const dueWordsSet = new Set(dueWords.map((d) => d.word_hanzi));
    const candidates = `
SELECT 
	chinese,id, english, sub_corpus_title, corpus_title
FROM
	document 
-- doesn't exist a word I don't know
WHERE NOT EXISTS (
	SELECT 
		1
	FROM
		sentence_word
	LEFT JOIN
		student_word_read
	ON
		student_word_read.student_id = 1 AND student_word_read.word_hanzi = sentence_word.word_hanzi
	WHERE
		student_word_read.word_hanzi IS null AND sentence_word.document_id = document.id AND sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM')
)`;
    const cVars = {
      ...vars,
    };

    const due = `SELECT word_hanzi FROM :student_word: WHERE student_id = :studentId AND due <= CURRENT_DATE`;
    const dVars = { ...vars }; // its the same, for now
    // TODO implement propery sorting/aggregation etc ie use of count() and distinct()
    const docs = (await this.knex
      .with('candidates', this.knex.raw(candidates, cVars))
      .with('due', this.knex.raw(due, dVars))
      .select('id', 'sub_corpus_title', 'corpus_title', 'english', 'chinese')
      .from('candidates')
      .join('sentence_word', 'candidates.id', '=', 'sentence_word.document_id')
      .join('due', 'sentence_word.word_hanzi', '=', 'due.word_hanzi')
      .groupBy(
        'id',
        'chinese',
        'english',
        'sub_corpus_title',
        'corpus_title'
      )) as document[];

    // TODO continue here per the steps in the notion
  }
  // This is an undata loaded/ unbatched. just for testing.
  async getWords(words: string[]) {
    return this.knex.select<word[]>('*').from('word').whereIn('hanzi', words);
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
    const dayStart = DateTime.fromISO(dayStartUTC);
    const tomorrow = dayStart.plus({ days: 1 });
    const res = await this.knex('student_word')
      .count('*')
      .where({ student_id: userId })
      .where('date_learned', '>=', dayStartUTC)
      .where('date_learned', '<', tomorrow.toUTC().toISO());
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
    const dayStart = DateTime.fromISO(dayStartUTC);
    const tomorrow = dayStart.plus({ days: 1 });
    const listenP = this.knex('student_word_listen')
      .select<student_word_listen[]>('*')
      .where({ student_id: userId })
      .where('due', '<', tomorrow.toUTC().toISO());
    const readP = this.knex('student_word_listen')
      .select<student_word_read[]>('*')
      .where({ student_id: userId })
      .where('due', '<', tomorrow.toUTC().toISO());
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
