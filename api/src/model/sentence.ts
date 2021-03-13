// Automatically generated. Don't change this file manually.

import { corpusId } from './corpus';

export type sentenceId = number & { __flavor?: 'sentence' };

export default interface sentence {
  /** Primary key. Index: sentence_pkey */
  id: sentenceId;

  english: string;

  chinese: string;

  corpus_name: corpusId;

  next_sentence: sentenceId;
}

export interface sentenceInitializer {
  /**
   * Default value: nextval('mandarin.sentence_id_seq'::regclass)
   * Primary key. Index: sentence_pkey
   */
  id?: sentenceId;

  english: string;

  chinese: string;

  corpus_name: corpusId;

  /** Default value: nextval('mandarin.sentence_next_sentence_seq'::regclass) */
  next_sentence?: sentenceId;
}
