// Automatically generated. Don't change this file manually.

export type corpusId = string & { " __flavor"?: 'corpus' };

export default interface corpus {
  /** Primary key. Index: corpus_pkey */
  title: corpusId;

  licence: string;

  website: string;

  summary: string;
}

export interface corpusInitializer {
  /** Primary key. Index: corpus_pkey */
  title: corpusId;

  licence: string;

  website: string;

  summary: string;
}
