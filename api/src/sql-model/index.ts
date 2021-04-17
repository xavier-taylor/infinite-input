// Automatically generated. Don't change this file manually.

import cc_cedict, { cc_cedictInitializer, cc_cedictId } from './cc_cedict';
import cc_cedict_definition, { cc_cedict_definitionInitializer } from './cc_cedict_definition';
import corpus, { corpusInitializer, corpusId } from './corpus';
import document, { documentInitializer, documentId } from './document';
import listen_log, { listen_logInitializer } from './listen_log';
import named_entity, { named_entityInitializer, named_entityId } from './named_entity';
import read_log, { read_logInitializer } from './read_log';
import sentence, { sentenceInitializer, sentenceId } from './sentence';
import sentence_word, { sentence_wordInitializer } from './sentence_word';
import student, { studentInitializer, studentId } from './student';
import student_document_listen, { student_document_listenInitializer } from './student_document_listen';
import student_document_read, { student_document_readInitializer } from './student_document_read';
import student_word_listen, { student_word_listenInitializer } from './student_word_listen';
import student_word_read, { student_word_readInitializer } from './student_word_read';
import sub_corpus, { sub_corpusInitializer } from './sub_corpus';
import word, { wordInitializer, wordId } from './word';

type Model =
  | cc_cedict
  | cc_cedict_definition
  | corpus
  | document
  | listen_log
  | named_entity
  | read_log
  | sentence
  | sentence_word
  | student
  | student_document_listen
  | student_document_read
  | student_word_listen
  | student_word_read
  | sub_corpus
  | word

interface ModelTypeMap {
  'cc_cedict': cc_cedict;
  'cc_cedict_definition': cc_cedict_definition;
  'corpus': corpus;
  'document': document;
  'listen_log': listen_log;
  'named_entity': named_entity;
  'read_log': read_log;
  'sentence': sentence;
  'sentence_word': sentence_word;
  'student': student;
  'student_document_listen': student_document_listen;
  'student_document_read': student_document_read;
  'student_word_listen': student_word_listen;
  'student_word_read': student_word_read;
  'sub_corpus': sub_corpus;
  'word': word;
}

type ModelId =
  | cc_cedictId
  | corpusId
  | documentId
  | named_entityId
  | sentenceId
  | studentId
  | wordId

interface ModelIdTypeMap {
  'cc_cedict': cc_cedictId;
  'corpus': corpusId;
  'document': documentId;
  'named_entity': named_entityId;
  'sentence': sentenceId;
  'student': studentId;
  'word': wordId;
}

type Initializer =
  | cc_cedictInitializer
  | cc_cedict_definitionInitializer
  | corpusInitializer
  | documentInitializer
  | listen_logInitializer
  | named_entityInitializer
  | read_logInitializer
  | sentenceInitializer
  | sentence_wordInitializer
  | studentInitializer
  | student_document_listenInitializer
  | student_document_readInitializer
  | student_word_listenInitializer
  | student_word_readInitializer
  | sub_corpusInitializer
  | wordInitializer

interface InitializerTypeMap {
  'cc_cedict': cc_cedictInitializer;
  'cc_cedict_definition': cc_cedict_definitionInitializer;
  'corpus': corpusInitializer;
  'document': documentInitializer;
  'listen_log': listen_logInitializer;
  'named_entity': named_entityInitializer;
  'read_log': read_logInitializer;
  'sentence': sentenceInitializer;
  'sentence_word': sentence_wordInitializer;
  'student': studentInitializer;
  'student_document_listen': student_document_listenInitializer;
  'student_document_read': student_document_readInitializer;
  'student_word_listen': student_word_listenInitializer;
  'student_word_read': student_word_readInitializer;
  'sub_corpus': sub_corpusInitializer;
  'word': wordInitializer;
}

export {
  cc_cedict, cc_cedictInitializer, cc_cedictId,
  cc_cedict_definition, cc_cedict_definitionInitializer,
  corpus, corpusInitializer, corpusId,
  document, documentInitializer, documentId,
  listen_log, listen_logInitializer,
  named_entity, named_entityInitializer, named_entityId,
  read_log, read_logInitializer,
  sentence, sentenceInitializer, sentenceId,
  sentence_word, sentence_wordInitializer,
  student, studentInitializer, studentId,
  student_document_listen, student_document_listenInitializer,
  student_document_read, student_document_readInitializer,
  student_word_listen, student_word_listenInitializer,
  student_word_read, student_word_readInitializer,
  sub_corpus, sub_corpusInitializer,
  word, wordInitializer, wordId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
