// Automatically generated. Don't change this file manually.

import { sub_corpusId } from './sub_corpus';

export type sentenceId = number & { __flavor?: 'sentence' };

export default interface sentence {
  /** Primary key. Index: sentence_pkey */
  id: sentenceId;

  english: string;

  chinese: string;

  sub_corpus_title: sub_corpusId;

  corpus_title: sub_corpusId;

  previous_sentence: sentenceId;
}

export interface sentenceInitializer {
  /**
   * Default value: nextval('mandarin.sentence_id_seq'::regclass)
   * Primary key. Index: sentence_pkey
   */
  id?: sentenceId;

  english: string;

  chinese: string;

  sub_corpus_title: sub_corpusId;

  corpus_title: sub_corpusId;

  /** Default value: nextval('mandarin.sentence_previous_sentence_seq'::regclass) */
  previous_sentence?: sentenceId;
}
