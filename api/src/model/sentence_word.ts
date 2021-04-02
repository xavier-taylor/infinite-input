// Automatically generated. Don't change this file manually.

import { sentenceId } from './sentence';
import { wordId } from './word';
import { named_entityId } from './named_entity';

export default interface sentence_word {
  /** Primary key. Index: sentence_word_pkey */
  id: number;

  /** Primary key. Index: sentence_word_pkey */
  sentence_id: sentenceId;

  word_hanzi: wordId;

  lemma: wordId;

  part_of_speech: string;

  universal_part_of_speech: string;

  head: number;

  deprel: string;

  feats: unknown;

  start_char: number;

  end_char: number;

  ner: string;

  /** The named entity, if any, that this word is part of. 1 named_entity has 1+ sentence_words, one sentence_word has 1 or 0 NE. */
  named_entity_id: named_entityId | null;
}

export interface sentence_wordInitializer {
  /** Primary key. Index: sentence_word_pkey */
  id: number;

  /** Primary key. Index: sentence_word_pkey */
  sentence_id: sentenceId;

  word_hanzi: wordId;

  lemma: wordId;

  part_of_speech: string;

  universal_part_of_speech: string;

  head: number;

  deprel: string;

  feats: unknown;

  start_char: number;

  end_char: number;

  ner: string;

  /** The named entity, if any, that this word is part of. 1 named_entity has 1+ sentence_words, one sentence_word has 1 or 0 NE. */
  named_entity_id?: named_entityId | null;
}
