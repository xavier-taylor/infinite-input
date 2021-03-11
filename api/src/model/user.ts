// Automatically generated. Don't change this file manually.

export type userId = number & { __flavor?: 'user' };

export default interface user {
  first_name: string;

  last_name: string;

  /** Primary key. Index: user_pkey */
  id: userId;
}

export interface userInitializer {
  first_name: string;

  last_name: string;

  /**
   * Default value: nextval('mandarin.user_id_seq'::regclass)
   * Primary key. Index: user_pkey
   */
  id?: userId;
}
