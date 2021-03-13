// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { sentence_wordId } from './sentence_word';

export default interface read_log {
  /** Primary key. Index: read_log_pkey */
  date_time: Date;

  /** Primary key. Index: read_log_pkey */
  student_id: studentId;

  /** Primary key. Index: read_log_pkey */
  sentence_id: sentence_wordId;

  word_hanzi: sentence_wordId;

  sentence_index: sentence_wordId;

  understood: boolean;
}

export interface read_logInitializer {
  /** Primary key. Index: read_log_pkey */
  date_time: Date;

  /**
   * Default value: nextval('mandarin.read_log_student_id_seq'::regclass)
   * Primary key. Index: read_log_pkey
   */
  student_id?: studentId;

  /**
   * Default value: nextval('mandarin.read_log_sentence_id_seq'::regclass)
   * Primary key. Index: read_log_pkey
   */
  sentence_id?: sentence_wordId;

  word_hanzi: sentence_wordId;

  sentence_index: sentence_wordId;

  understood: boolean;
}
