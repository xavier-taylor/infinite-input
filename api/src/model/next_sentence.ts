// Automatically generated. Don't change this file manually.

/**
 * This table records, for each sentence, the next sentence in the corpus it came from (if any). In some corpora this is useless, but it is useful for corpora where sentences are from continuous text - especiallly so if a corpus has a minor alignment issue!
 */
export default interface next_sentence {
  /** Primary key. Index: next_sentence_pkey */
  sentence_id: number;

  /** Primary key. Index: next_sentence_pkey */
  next_sentence_id: number;
}

/**
 * This table records, for each sentence, the next sentence in the corpus it came from (if any). In some corpora this is useless, but it is useful for corpora where sentences are from continuous text - especiallly so if a corpus has a minor alignment issue!
 */
export interface next_sentenceInitializer {
  /** Primary key. Index: next_sentence_pkey */
  sentence_id: number;

  /** Primary key. Index: next_sentence_pkey */
  next_sentence_id: number;
}
