// Automatically generated. Don't change this file manually.

export type corpusId = number & { __flavor?: 'corpus' };

export default interface corpus {
  name: string;

  /** Primary key. Index: corpus_pkey */
  id: corpusId;

  licence: string;

  website: string;
}

export interface corpusInitializer {
  name: string;

  /**
   * Default value: nextval('mandarin.corpus_id_seq'::regclass)
   * Primary key. Index: corpus_pkey
   */
  id?: corpusId;

  licence: string;

  website: string;
}
