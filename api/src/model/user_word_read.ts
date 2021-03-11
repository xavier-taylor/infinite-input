// Automatically generated. Don't change this file manually.

import { userId } from './user';
import { wordId } from './word';

export default interface user_word_read {
  user_id: userId;

  word_hanzi: wordId | null;

  f1: number;

  f2: number;

  due: Date;

  understood: Date[];

  forgot: Date[];
}

export interface user_word_readInitializer {
  /** Default value: nextval('mandarin.user_word_read_user_id_seq'::regclass) */
  user_id?: userId;

  word_hanzi?: wordId | null;

  f1: number;

  f2: number;

  due: Date;

  understood: Date[];

  forgot: Date[];
}
