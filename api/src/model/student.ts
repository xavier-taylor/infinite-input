// Automatically generated. Don't change this file manually.

export type studentId = number & { __flavor?: 'student' };

export default interface student {
    /** Primary key. Index: student_pkey */
    id: studentId;

    first_name: string;

    last_name: string;
}

export interface studentInitializer {
    /**
     * Default value: nextval('mandarin.student_id_seq'::regclass)
     * Primary key. Index: student_pkey
     */
    id?: studentId;

    first_name: string;

    last_name: string;
}
