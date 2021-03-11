// Automatically generated. Don't change this file manually.

import { cc_cedictId } from './cc_cedict';
import { definitionId } from './definition';

/**
 * This is a curious join table... because the table 'definition' only has one column, its natural key. So, absent other columns coming later, it seems like this special case of a many to many could be served with just the join table... without the table being joined to...
 */
export default interface cc_cedict_definition {
  cc_cedict_id: cc_cedictId;

  definition_meaning: definitionId | null;
}

/**
 * This is a curious join table... because the table 'definition' only has one column, its natural key. So, absent other columns coming later, it seems like this special case of a many to many could be served with just the join table... without the table being joined to...
 */
export interface cc_cedict_definitionInitializer {
  /** Default value: nextval('mandarin.cc_cedict_definition_cc_cedict_id_seq'::regclass) */
  cc_cedict_id?: cc_cedictId;

  definition_meaning?: definitionId | null;
}
