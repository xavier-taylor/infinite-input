// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { sentenceId } from './sentence';

export default interface student_sentence_read {
  /** Primary key. Index: student_sentence_read_pkey */
  student_id: studentId;

  /** Primary key. Index: student_sentence_read_pkey */
  sentence_id: sentenceId;

  read_count: number;
}

export interface student_sentence_readInitializer {
  /**
   * Default value: nextval('mandarin.student_sentence_read_student_id_seq'::regclass)
   * Primary key. Index: student_sentence_read_pkey
   */
  student_id?: studentId;

  /**
   * Default value: nextval('mandarin.student_sentence_read_sentence_id_seq'::regclass)
   * Primary key. Index: student_sentence_read_pkey
   */
  sentence_id?: sentenceId;

  read_count: number;
}
