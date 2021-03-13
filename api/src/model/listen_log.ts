// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { sentence_wordId } from './sentence_word';

export default interface listen_log {
  /** Primary key. Index: listen_log_pkey */
  date_time: Date;

  /** Primary key. Index: listen_log_pkey */
  student_id: studentId;

  understood: boolean;

  /** Primary key. Index: listen_log_pkey */
  sentence_word_id: sentence_wordId;
}

export interface listen_logInitializer {
  /** Primary key. Index: listen_log_pkey */
  date_time: Date;

  /**
   * Default value: nextval('mandarin.listen_log_student_id_seq'::regclass)
   * Primary key. Index: listen_log_pkey
   */
  student_id?: studentId;

  understood: boolean;

  /**
   * Default value: nextval('mandarin.listen_log_sentence_word_id_seq'::regclass)
   * Primary key. Index: listen_log_pkey
   */
  sentence_word_id?: sentence_wordId;
}
