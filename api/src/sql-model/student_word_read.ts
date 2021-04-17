// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { wordId } from './word';

export default interface student_word_read {
  /** Primary key. Index: student_word_read_pkey */
  student_id: studentId;

  /** Primary key. Index: student_word_read_pkey */
  word_hanzi: wordId;

  f1: number;

  f2: number;

  due: Date;

  previous: Date;

  understood_count: number;

  understood_distinct_documents_count: number;
}

export interface student_word_readInitializer {
  /** Primary key. Index: student_word_read_pkey */
  student_id: studentId;

  /** Primary key. Index: student_word_read_pkey */
  word_hanzi: wordId;

  f1: number;

  f2: number;

  due: Date;

  previous: Date;

  understood_count: number;

  understood_distinct_documents_count: number;
}
