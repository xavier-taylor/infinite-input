// Automatically generated. Don't change this file manually.

export type wordId = string & { __flavor?: 'word' };

/**
 * Represents a string of hanzi(traditional or simplified) and or alphanumeric characters that constitutes a word in Chinese.
 */
export default interface word {
    /** Primary key. Index: word_pkey */
    hanzi: wordId;

    /** In range [1,7], 7 denotes not in hsk. This denotes the first level where this word appeared as a hsk word. So for example, 朋友 would appear as 1, but 朋 友 would each be some other level (maybe 7), because as single character words, they are not part of HSK 1 */
    hsk_word_2010: number;

    /** In range [1,7] where 7 denotes not appearing in HSK. This is the first level where all the charactes in this word had appeared (by this or previous levels). So for some word ABC where A appeared in level 1, B appeared in level two (as part of some word BD) and C appeared at level 3, we would have the value 3. Hsk level 1 has 174 distinct characters, so to find the hsk level 1 characters you would select * from word where hsk_char_2010 =1 && length(hanz)=1. */
    hsk_char_2010: number;
}

/**
 * Represents a string of hanzi(traditional or simplified) and or alphanumeric characters that constitutes a word in Chinese.
 */
export interface wordInitializer {
    /** Primary key. Index: word_pkey */
    hanzi: wordId;

    /** In range [1,7], 7 denotes not in hsk. This denotes the first level where this word appeared as a hsk word. So for example, 朋友 would appear as 1, but 朋 友 would each be some other level (maybe 7), because as single character words, they are not part of HSK 1 */
    hsk_word_2010: number;

    /** In range [1,7] where 7 denotes not appearing in HSK. This is the first level where all the charactes in this word had appeared (by this or previous levels). So for some word ABC where A appeared in level 1, B appeared in level two (as part of some word BD) and C appeared at level 3, we would have the value 3. Hsk level 1 has 174 distinct characters, so to find the hsk level 1 characters you would select * from word where hsk_char_2010 =1 && length(hanz)=1. */
    hsk_char_2010: number;
}
