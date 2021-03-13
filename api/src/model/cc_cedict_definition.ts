// Automatically generated. Don't change this file manually.

import { cc_cedictId } from './cc_cedict';

export default interface cc_cedict_definition {
  /** Primary key. Index: cc_cedict_definition_pkey */
  cc_cedict_id: cc_cedictId;

  /** Primary key. Index: cc_cedict_definition_pkey */
  definition_meaning: string;
}

export interface cc_cedict_definitionInitializer {
  /**
   * Default value: nextval('mandarin.cc_cedict_definition_cc_cedict_id_seq'::regclass)
   * Primary key. Index: cc_cedict_definition_pkey
   */
  cc_cedict_id?: cc_cedictId;

  /** Primary key. Index: cc_cedict_definition_pkey */
  definition_meaning: string;
}
