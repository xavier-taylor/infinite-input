// Automatically generated. Don't change this file manually.

import { userId } from './user';
import { wordId } from './word';

export default interface user_word_listen {
  user_id: userId;

  word_hanzi: wordId | null;

  /** use in recurrence to calculate next due date (currently thinking of using fib sequence) */
  f1: number;

  f2: number;

  due: Date;

  /** number of times person has seen this word */
  understood: Date[];

  forgot: Date[];
}

export interface user_word_listenInitializer {
  /** Default value: nextval('mandarin.user_word_listen_user_id_seq'::regclass) */
  user_id?: userId;

  word_hanzi?: wordId | null;

  /** use in recurrence to calculate next due date (currently thinking of using fib sequence) */
  f1: number;

  f2: number;

  due: Date;

  /** number of times person has seen this word */
  understood: Date[];

  forgot: Date[];
}
