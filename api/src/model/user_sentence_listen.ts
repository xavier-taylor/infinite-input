// Automatically generated. Don't change this file manually.

import { userId } from './user';
import { sentenceId } from './sentence';

export default interface user_sentence_listen {
  user_id: userId;

  sentence_id: sentenceId;

  count: number;
}

export interface user_sentence_listenInitializer {
  /** Default value: nextval('mandarin.user_sentence_listen_user_id_seq'::regclass) */
  user_id?: userId;

  /** Default value: nextval('mandarin.user_sentence_listen_sentence_id_seq'::regclass) */
  sentence_id?: sentenceId;

  count: number;
}
