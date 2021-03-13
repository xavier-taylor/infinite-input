// Automatically generated. Don't change this file manually.

import { sentenceId } from './sentence';
import { wordId } from './word';

export default interface sentence_word {
    /** Primary key. Index: sentence_word_pkey */
    sentence_id: sentenceId;

    /** Primary key. Index: sentence_word_pkey */
    word_hanzi: wordId;

    part_of_speech: string;

    /** Primary key. Index: sentence_word_pkey */
    sentence_index: number;
}

export interface sentence_wordInitializer {
    /**
     * Default value: nextval('mandarin.sentence_word_sentence_id_seq'::regclass)
     * Primary key. Index: sentence_word_pkey
     */
    sentence_id?: sentenceId;

    /** Primary key. Index: sentence_word_pkey */
    word_hanzi: wordId;

    part_of_speech: string;

    /** Primary key. Index: sentence_word_pkey */
    sentence_index: number;
}
