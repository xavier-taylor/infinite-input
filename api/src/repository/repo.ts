import { Pool } from 'pg';
import { Document, SentenceWord, Word } from '../schema/gql-model';
import {
  cc_cedict,
  document,
  sentence,
  sentence_word,
  word,
} from './sql-model';
import { SQLDataSource } from 'datasource-sql';

export type ReviewType = 'Reading' | 'Listening';

// TODO explore more TS support
export class PostgresqlRepo extends SQLDataSource {
  async getCCCE(hanzi: string) {
    return this.knex
      .select<cc_cedict[]>('*')
      .from('cc_cedict')
      .where({ simplified: hanzi });
    // There can be more than one
  }

  async getWord(hanzi: string) {
    return this.knex
      .select<word>('*')
      .from('word')
      .where({ hanzi })
      .first() as Promise<word>;
    // TODO think about this - probably safer to adjust types and accept undefined? - but hanzi is a PK and all sentencewords hanzi get created as hanzi in my db
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
    // make a 'word to document' function for single word reviews.
    // get the actual list of due words, then work thru results from this query etc
    const res = this.knex.select<document[]>('*').from('document').limit(2);
    return res;
  }

  async getSentences(documentId: string) {
    // TODO make this sorted (at sql level or here at js by sentence id)
    return this.knex
      .select<sentence[]>('*')
      .from('sentence')
      .where({ document_id: documentId });
  }
}
