// Automatically generated. Don't change this file manually.

import { wordId } from './word';

export type cc_cedictId = number & { __flavor?: 'cc_cedict' };

/**
 * Represents an entry in the https://cc-cedict.org/wiki/start dictionary. Note that in this table the simplfied or traditional values are not unique - there can be entries with the same string of chinese characters. It is possible that the pinyin and the simplified+trad would be a composite key, but not sure about that, so just using an id. The definitions array is redundant data, i will calculate the cost of using cc_cedict_definition for finding words (as opposed to finding synonyms), and possibly delete definitions array.
 */
export default interface cc_cedict {
    /** Primary key. Index: cc_cedict_pkey */
    id: cc_cedictId;

    simplified: wordId;

    traditional: wordId;

    pinyin: string;

    /** This is redundant data, the definitions are stored in the definition table. I am just including it so I can compare query times against the joined data, in future I will probably delete this once I confirm that I am not paying a cost at query time for normalizing the definitions. */
    definitions: string[];
}

/**
 * Represents an entry in the https://cc-cedict.org/wiki/start dictionary. Note that in this table the simplfied or traditional values are not unique - there can be entries with the same string of chinese characters. It is possible that the pinyin and the simplified+trad would be a composite key, but not sure about that, so just using an id. The definitions array is redundant data, i will calculate the cost of using cc_cedict_definition for finding words (as opposed to finding synonyms), and possibly delete definitions array.
 */
export interface cc_cedictInitializer {
    /**
     * Default value: nextval('mandarin.cc_cedict_id_seq'::regclass)
     * Primary key. Index: cc_cedict_pkey
     */
    id?: cc_cedictId;

    simplified: wordId;

    traditional: wordId;

    pinyin: string;

    /** This is redundant data, the definitions are stored in the definition table. I am just including it so I can compare query times against the joined data, in future I will probably delete this once I confirm that I am not paying a cost at query time for normalizing the definitions. */
    definitions: string[];
}
