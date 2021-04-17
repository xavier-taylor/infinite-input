// Automatically generated. Don't change this file manually.

import { documentId } from './document';

export type named_entityId = number & { " __flavor"?: 'named_entity' };

export default interface named_entity {
  /** Primary key. Index: named_entity_pkey */
  id: named_entityId;

  chinese: string;

  entity_type: string;

  start_char: number;

  end_char: number;

  document_id: documentId;
}

export interface named_entityInitializer {
  /**
   * Default value: nextval('mandarin.named_entity_id_seq'::regclass)
   * Primary key. Index: named_entity_pkey
   */
  id?: named_entityId;

  chinese: string;

  entity_type: string;

  start_char: number;

  end_char: number;

  document_id: documentId;
}
