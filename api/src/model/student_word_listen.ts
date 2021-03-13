// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { wordId } from './word';

export default interface student_word_listen {
  /** Primary key. Index: student_word_listen_pkey */
  student_id: studentId;

  /** Primary key. Index: student_word_listen_pkey */
  word_hanzi: wordId;

  f1: number;

  f2: number;

  due: Date | null;

  previous: Date | null;

  understood_count: number;
}

export interface student_word_listenInitializer {
  /**
   * Default value: nextval('mandarin.student_word_listen_student_id_seq'::regclass)
   * Primary key. Index: student_word_listen_pkey
   */
  student_id?: studentId;

  /** Primary key. Index: student_word_listen_pkey */
  word_hanzi: wordId;

  f1: number;

  f2: number;

  due?: Date | null;

  previous?: Date | null;

  understood_count: number;
}
