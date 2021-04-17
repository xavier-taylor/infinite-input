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

  /** Primary key. Index: listen_log_pkey */
  sentence_id: sentence_wordId;
}

export interface listen_logInitializer {
  /** Primary key. Index: listen_log_pkey */
  date_time: Date;

  /** Primary key. Index: listen_log_pkey */
  student_id: studentId;

  understood: boolean;

  /** Primary key. Index: listen_log_pkey */
  sentence_word_id: sentence_wordId;

  /** Primary key. Index: listen_log_pkey */
  sentence_id: sentence_wordId;
}
