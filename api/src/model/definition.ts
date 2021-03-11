// Automatically generated. Don't change this file manually.

export type definitionId = string & { __flavor?: 'definition' };

/**
 * This represents an english definition of a word. It can be a single word, ie 'bread', or 'to betray' or something arbitrarily complex ie 'simultaneous interpretation facilities (loanword from "earphone")' or 'variant of 警戒[jing3 jie4]/'. It represents unstructured data, but often enough the definitions of a word (initially in CC-CEDICT) will match, so this table allows us to (in a naive way) find at least some synonyms via common english definition.
 */
export default interface definition {
  /** Primary key. Index: definition_pkey */
  meaning: definitionId;
}

/**
 * This represents an english definition of a word. It can be a single word, ie 'bread', or 'to betray' or something arbitrarily complex ie 'simultaneous interpretation facilities (loanword from "earphone")' or 'variant of 警戒[jing3 jie4]/'. It represents unstructured data, but often enough the definitions of a word (initially in CC-CEDICT) will match, so this table allows us to (in a naive way) find at least some synonyms via common english definition.
 */
export interface definitionInitializer {
  /** Primary key. Index: definition_pkey */
  meaning: definitionId;
}
