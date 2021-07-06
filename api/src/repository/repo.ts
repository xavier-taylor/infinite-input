import { Pool } from 'pg';
import { Document, SentenceWord, Word } from '../schema/gql-model';
import {
  cc_cedict,
  document,
  document_word,
  sentence,
  sentence_word,
  word,
} from './sql-model';
import Knex from 'knex';
import DataLoader from 'dataloader';

// IMPORTANT - cannot reuse dataloader instances across requests.
// so cannot use datasource instance across requests.
// this begs the question - why use data source? - possibly need to rip data source out
// Avoid multiple requests from different users using the DataLoader instance, which could result in cached data incorrectly appearing in each request. Typically, DataLoader instances are created when a Request begins, and are not used once the Request ends.

export type ReviewType = 'Reading' | 'Listening';

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
  private ccceLoader: DataLoader<unknown, any, unknown>;

  constructor(private knex: Knex) {
    this.ccceLoader = new DataLoader((keys: Readonly<string[]>) =>
      this.batchGetCCCE.bind(this)(keys)
    ); // todo remember bind and check if necassary
  }

  // these 'batch' methods are just the callbacks to my DataLoader calls, and could be moved into
  // some other code, ie 'create data loaders' ???

  // This needs to match the constraints mentioned here: https://github.com/graphql/dataloader
  private async batchGetCCCE(
    hanzis: Readonly<string[]>
  ): Promise<Array<cc_cedict[]>> {
    // because each chineseword can have multiple cc_cedict entrys, the return value is an array of arrays
    // can either have the sequel query return a flat list of cc_cedict boiz, and map them myself?
    // or could have the sql query return it in [[cc_cedict]]. even better if it could return
    // a map?

    // this is the most naive approach and requires some logic here in the code
    // TODO improve this so that more of that logic takes place in sql?

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

  // prior to data loader we were doing seperate calls for each, including
  // for the same word over and over
  async getCCCE(hanzi: string) {
    return this.ccceLoader.load(hanzi);
    // There can be more than one

    // just testin n+1
    // success - using the above rather than the below
    // batches the call to sql for
    /*
# Write your query or mutation here
 {
  words(words: ["他" "她"]) {
    ccceDefinitions {
     simplified 
    }
  	
	}
}
    */
    // CONTINUE HERE
    // now just need to work out why the sql call for cc definitions
    // doesnt appear to be batched on the documents query!!

    // is it because i need to add dataloaders upstream??

    //return this.getCCCEUnbatched(hanzi);
  }

  // temporary method for testin n+1 thingo
  async getCCCEUnbatched(hanzi: string) {
    return this.knex
      .select<cc_cedict[]>('*')
      .from('cc_cedict')
      .where({ hanzi });
  }

  async getWord(hanzi: string): Promise<word> {
    return this.knex
      .select<word>('*')
      .from('word')
      .where({ hanzi })
      .first() as Promise<word>;
    // TODO is this as safe?
  }
  async getSentenceWords(sentenceId: string) {
    return this.knex
      .select<sentence_word[]>('*')
      .from('sentence_word')
      .where({ sentence_id: sentenceId });
    // TODO sort this
  }
  async getDueDocuments(
    _type: ReviewType = 'Reading',
    _studentId: string = '1'
  ): Promise<document[]> {
    // based on complete_query.sql, just for testing/mucking around purposes
    const candidates = `SELECT chinese,id, english, sub_corpus_title, corpus_title from document WHERE
-- doesn't exist a word I don't know
NOT EXISTS (
	Select 1 FROM document_word
	left join student_word_read ON student_word_read.word_hanzi = document_word.word AND student_word_read.student_id = 1
	WHERE student_word_read.word_hanzi is null
	and document_word.document_id = document.id
	) `;
    const due = `SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE`;

    return this.knex
      .with('candidates', this.knex.raw(candidates))
      .with('due', this.knex.raw(due))
      .select('id', 'sub_corpus_title', 'corpus_title', 'english', 'chinese')
      .from('candidates')
      .join('document_word', 'candidates.id', '=', 'document_word.document_id')
      .join('due', 'document_word.word', '=', 'due.word_hanzi')
      .groupBy('id', 'chinese', 'english', 'sub_corpus_title', 'corpus_title')
      .limit(20);
  }
  async getWords(words: string[]) {
    return this.knex.select<word[]>('*').from('word').whereIn('hanzi', words);
  }
  async getDocuments(options: { including: string[] }): Promise<document[]> {
    // make a 'word to document' function for single word reviews.
    // get the actual list of due words, then work thru results from this query etc

    // const raw = `select id, sub_corpus_title, corpus_title, previous_document, english, chinese from document join document_word on document.id = document_id limit 5;`
    // return this.knex.r

    return this.knex('document')
      .join('document_word', 'document.id', '=', 'document_word.document_id')
      .limit(10)
      .select(
        'id',
        'sub_corpus_title',
        'corpus_title',
        'previous_document',
        'english',
        'chinese'
      )
      .whereIn('word', options.including);
    // .limit(10); // TODO fix this so that if arg is not passed the wherein is not applied
    // TODO make this just return unique documents!
  }

  async getSentences(documentId: string) {
    // TODO make this sorted (at sql level or here at js by sentence id)
    return this.knex
      .select<sentence[]>('*')
      .from('sentence')
      .where({ document_id: documentId });
  }
}
