// Automatically generated. Don't change this file manually.

import { sub_corpusId } from './sub_corpus';

export type documentId = number & { __flavor?: 'document' };

export default interface document {
  /** Primary key. Index: document_pkey */
  id: documentId;

  sub_corpus_title: sub_corpusId;

  corpus_title: sub_corpusId;

  previous_document: documentId | null;

  english: string | null;

  chinese: string;

  words_upos_not_punct: string[];
}

export interface documentInitializer {
  /**
   * Default value: nextval('mandarin.document_id_seq'::regclass)
   * Primary key. Index: document_pkey
   */
  id?: documentId;

  sub_corpus_title: sub_corpusId;

  corpus_title: sub_corpusId;

  previous_document?: documentId | null;

  english?: string | null;

  chinese: string;

  words_upos_not_punct: string[];
}
