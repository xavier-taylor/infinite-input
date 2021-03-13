// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { sentence_wordId } from './sentence_word';

export default interface listen_log {
    /** Primary key. Index: listen_log_pkey */
    date_time: Date;

    /** Primary key. Index: listen_log_pkey */
    student_id: studentId;

    /** Primary key. Index: listen_log_pkey */
    sentence_id: sentence_wordId;

    word_hanzi: sentence_wordId;

    sentence_index: sentence_wordId;

    understood: boolean;
}

export interface listen_logInitializer {
    /** Primary key. Index: listen_log_pkey */
    date_time: Date;

    /**
     * Default value: nextval('mandarin.listen_log_student_id_seq'::regclass)
     * Primary key. Index: listen_log_pkey
     */
    student_id?: studentId;

    /**
     * Default value: nextval('mandarin.listen_log_sentence_id_seq'::regclass)
     * Primary key. Index: listen_log_pkey
     */
    sentence_id?: sentence_wordId;

    word_hanzi: sentence_wordId;

    sentence_index: sentence_wordId;

    understood: boolean;
}
