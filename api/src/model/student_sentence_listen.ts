// Automatically generated. Don't change this file manually.

import { studentId } from './student';

export default interface student_sentence_listen {
  /** Primary key. Index: student_sentence_listen_pkey */
  student_id: studentId;

  /** Primary key. Index: student_sentence_listen_pkey */
  sentence_id: studentId;

  listen_count: number;
}

export interface student_sentence_listenInitializer {
  /**
   * Default value: nextval('mandarin.student_sentence_listen_student_id_seq'::regclass)
   * Primary key. Index: student_sentence_listen_pkey
   */
  student_id?: studentId;

  /**
   * Default value: nextval('mandarin.student_sentence_listen_sentence_id_seq'::regclass)
   * Primary key. Index: student_sentence_listen_pkey
   */
  sentence_id?: studentId;

  listen_count: number;
}
