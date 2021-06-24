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
