// Automatically generated. Don't change this file manually.

import { documentId } from './document';

export type sentenceId = number & { __flavor?: 'sentence' };

export default interface sentence {
  /** Primary key. Index: sentence_pkey */
  id: sentenceId;

  /** Index: idx_sentence_document_id */
  document_id: documentId;

  chinese: string;

  sentiment: string;
}

export interface sentenceInitializer {
  /**
   * Default value: nextval('mandarin.sentence_id_seq'::regclass)
   * Primary key. Index: sentence_pkey
   */
  id?: sentenceId;

  /** Index: idx_sentence_document_id */
  document_id: documentId;

  chinese: string;

  sentiment: string;
}
