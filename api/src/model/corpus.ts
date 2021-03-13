// Automatically generated. Don't change this file manually.

export type corpusId = string & { __flavor?: 'corpus' };

export default interface corpus {
  /** Primary key. Index: corpus_pkey */
  name: corpusId;

  licence: string;

  website: string;
}

export interface corpusInitializer {
  /** Primary key. Index: corpus_pkey */
  name: corpusId;

  licence: string;

  website: string;
}
