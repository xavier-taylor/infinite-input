// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { documentId } from './document';

export default interface student_document_read {
  /** Primary key. Index: student_document_read_pkey */
  student_id: studentId;

  /** Primary key. Index: student_document_read_pkey */
  document_id: documentId;

  read_count: number;
}

export interface student_document_readInitializer {
  /** Primary key. Index: student_document_read_pkey */
  student_id: studentId;

  /** Primary key. Index: student_document_read_pkey */
  document_id: documentId;

  read_count: number;
}
