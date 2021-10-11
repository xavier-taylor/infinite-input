import { StudyType } from '../schema/gql-model';
import { student_word_read, student_word_listen } from './sql-model';

// This is to allow us to have a common gql type for two different tables.
// frankly its proably an argument against having those two tables
// distinct from student_word, but thats a future TODO
export type student_word_study = student_word_listen &
  student_word_read & {
    studyType: StudyType;
  };
