// Automatically generated. Don't change this file manually.

import { studentId } from './student';
import { documentId } from './document';

export default interface student_document_listen {
  /** Primary key. Index: student_document_listen_pkey */
  student_id: studentId;

  /** Primary key. Index: student_document_listen_pkey */
  document_id: documentId;

  listen_count: number;
}

export interface student_document_listenInitializer {
  /** Primary key. Index: student_document_listen_pkey */
  student_id: studentId;

  /** Primary key. Index: student_document_listen_pkey */
  document_id: documentId;

  listen_count: number;
}
