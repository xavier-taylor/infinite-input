// Automatically generated. Don't change this file manually.

import { sentenceId } from './sentence';
import { wordId } from './word';

export type sentence_wordId = number & { __flavor?: 'sentence_word' };

export default interface sentence_word {
  /** Primary key. Index: sentence_word_pkey */
  id: sentence_wordId;

  sentence_id: sentenceId;

  word_hanzi: wordId | null;

  part_of_speech: string;

  sentence_index: number | null;
}

export interface sentence_wordInitializer {
  /**
   * Default value: nextval('mandarin.sentence_word_id_seq'::regclass)
   * Primary key. Index: sentence_word_pkey
   */
  id?: sentence_wordId;

  /** Default value: nextval('mandarin.sentence_word_sentence_id_seq'::regclass) */
  sentence_id?: sentenceId;

  word_hanzi?: wordId | null;

  part_of_speech: string;

  sentence_index?: number | null;
}
