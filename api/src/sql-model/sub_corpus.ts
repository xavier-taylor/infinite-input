// Automatically generated. Don't change this file manually.

import { corpusId } from './corpus';

export default interface sub_corpus {
  /** Primary key. Index: sub_corpus_pkey */
  title: string;

  /** Primary key. Index: sub_corpus_pkey */
  corpus_title: corpusId;

  summary: string;
}

export interface sub_corpusInitializer {
  /** Primary key. Index: sub_corpus_pkey */
  title: string;

  /** Primary key. Index: sub_corpus_pkey */
  corpus_title: corpusId;

  summary: string;
}
