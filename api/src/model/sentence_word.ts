// Automatically generated. Don't change this file manually.

import { sentenceId } from './sentence';
import { wordId } from './word';

export default interface sentence_word {
  sentence_id: sentenceId;

  word_hanzi: wordId | null;

  part_of_speech: string | null;
}

export interface sentence_wordInitializer {
  /** Default value: nextval('mandarin.sentence_word_sentence_id_seq'::regclass) */
  sentence_id?: sentenceId;

  word_hanzi?: wordId | null;

  part_of_speech?: string | null;
}
