// Automatically generated. Don't change this file manually.

import cc_cedict, { cc_cedictInitializer, cc_cedictId } from './cc_cedict';
import cc_cedict_definition, { cc_cedict_definitionInitializer } from './cc_cedict_definition';
import corpus, { corpusInitializer, corpusId } from './corpus';
import listen_log, { listen_logInitializer } from './listen_log';
import read_log, { read_logInitializer } from './read_log';
import sentence, { sentenceInitializer, sentenceId } from './sentence';
import sentence_word, { sentence_wordInitializer, sentence_wordId } from './sentence_word';
import student, { studentInitializer, studentId } from './student';
import student_sentence_listen, { student_sentence_listenInitializer } from './student_sentence_listen';
import student_sentence_read, { student_sentence_readInitializer } from './student_sentence_read';
import student_word_listen, { student_word_listenInitializer } from './student_word_listen';
import student_word_read, { student_word_readInitializer } from './student_word_read';
import word, { wordInitializer, wordId } from './word';

type Model =
  | cc_cedict
  | cc_cedict_definition
  | corpus
  | listen_log
  | read_log
  | sentence
  | sentence_word
  | student
  | student_sentence_listen
  | student_sentence_read
  | student_word_listen
  | student_word_read
  | word

interface ModelTypeMap {
  'cc_cedict': cc_cedict;
  'cc_cedict_definition': cc_cedict_definition;
  'corpus': corpus;
  'listen_log': listen_log;
  'read_log': read_log;
  'sentence': sentence;
  'sentence_word': sentence_word;
  'student': student;
  'student_sentence_listen': student_sentence_listen;
  'student_sentence_read': student_sentence_read;
  'student_word_listen': student_word_listen;
  'student_word_read': student_word_read;
  'word': word;
}

type ModelId =
  | cc_cedictId
  | corpusId
  | sentenceId
  | sentence_wordId
  | studentId
  | wordId

interface ModelIdTypeMap {
  'cc_cedict': cc_cedictId;
  'corpus': corpusId;
  'sentence': sentenceId;
  'sentence_word': sentence_wordId;
  'student': studentId;
  'word': wordId;
}

type Initializer =
  | cc_cedictInitializer
  | cc_cedict_definitionInitializer
  | corpusInitializer
  | listen_logInitializer
  | read_logInitializer
  | sentenceInitializer
  | sentence_wordInitializer
  | studentInitializer
  | student_sentence_listenInitializer
  | student_sentence_readInitializer
  | student_word_listenInitializer
  | student_word_readInitializer
  | wordInitializer

interface InitializerTypeMap {
  'cc_cedict': cc_cedictInitializer;
  'cc_cedict_definition': cc_cedict_definitionInitializer;
  'corpus': corpusInitializer;
  'listen_log': listen_logInitializer;
  'read_log': read_logInitializer;
  'sentence': sentenceInitializer;
  'sentence_word': sentence_wordInitializer;
  'student': studentInitializer;
  'student_sentence_listen': student_sentence_listenInitializer;
  'student_sentence_read': student_sentence_readInitializer;
  'student_word_listen': student_word_listenInitializer;
  'student_word_read': student_word_readInitializer;
  'word': wordInitializer;
}

export {
  cc_cedict, cc_cedictInitializer, cc_cedictId,
  cc_cedict_definition, cc_cedict_definitionInitializer,
  corpus, corpusInitializer, corpusId,
  listen_log, listen_logInitializer,
  read_log, read_logInitializer,
  sentence, sentenceInitializer, sentenceId,
  sentence_word, sentence_wordInitializer, sentence_wordId,
  student, studentInitializer, studentId,
  student_sentence_listen, student_sentence_listenInitializer,
  student_sentence_read, student_sentence_readInitializer,
  student_word_listen, student_word_listenInitializer,
  student_word_read, student_word_readInitializer,
  word, wordInitializer, wordId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
