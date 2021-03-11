// Automatically generated. Don't change this file manually.

import { corpusId } from './corpus';

export type sentenceId = number & { __flavor?: 'sentence' };

export default interface sentence {
  /** Primary key. Index: sentence_pkey */
  id: sentenceId;

  english: string;

  chinese: string;

  corpus_id: corpusId;
}

export interface sentenceInitializer {
  /**
   * Default value: nextval('mandarin.sentence_id_seq'::regclass)
   * Primary key. Index: sentence_pkey
   */
  id?: sentenceId;

  english: string;

  chinese: string;

  /** Default value: nextval('mandarin.sentence_corpus_id_seq'::regclass) */
  corpus_id?: corpusId;
}
