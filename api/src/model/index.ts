// Automatically generated. Don't change this file manually.

import cc_cedict, { cc_cedictInitializer, cc_cedictId } from './cc_cedict';
import cc_cedict_definition, { cc_cedict_definitionInitializer } from './cc_cedict_definition';
import corpus, { corpusInitializer, corpusId } from './corpus';
import definition, { definitionInitializer, definitionId } from './definition';
import next_sentence, { next_sentenceInitializer } from './next_sentence';
import sentence, { sentenceInitializer, sentenceId } from './sentence';
import sentence_word, { sentence_wordInitializer } from './sentence_word';
import user, { userInitializer, userId } from './user';
import user_sentence_listen, { user_sentence_listenInitializer } from './user_sentence_listen';
import user_sentence_read, { user_sentence_readInitializer } from './user_sentence_read';
import user_word_listen, { user_word_listenInitializer } from './user_word_listen';
import user_word_read, { user_word_readInitializer } from './user_word_read';
import word, { wordInitializer, wordId } from './word';

type Model =
  | cc_cedict
  | cc_cedict_definition
  | corpus
  | definition
  | next_sentence
  | sentence
  | sentence_word
  | user
  | user_sentence_listen
  | user_sentence_read
  | user_word_listen
  | user_word_read
  | word

interface ModelTypeMap {
  'cc_cedict': cc_cedict;
  'cc_cedict_definition': cc_cedict_definition;
  'corpus': corpus;
  'definition': definition;
  'next_sentence': next_sentence;
  'sentence': sentence;
  'sentence_word': sentence_word;
  'user': user;
  'user_sentence_listen': user_sentence_listen;
  'user_sentence_read': user_sentence_read;
  'user_word_listen': user_word_listen;
  'user_word_read': user_word_read;
  'word': word;
}

type ModelId =
  | cc_cedictId
  | corpusId
  | definitionId
  | sentenceId
  | userId
  | wordId

interface ModelIdTypeMap {
  'cc_cedict': cc_cedictId;
  'corpus': corpusId;
  'definition': definitionId;
  'sentence': sentenceId;
  'user': userId;
  'word': wordId;
}

type Initializer =
  | cc_cedictInitializer
  | cc_cedict_definitionInitializer
  | corpusInitializer
  | definitionInitializer
  | next_sentenceInitializer
  | sentenceInitializer
  | sentence_wordInitializer
  | userInitializer
  | user_sentence_listenInitializer
  | user_sentence_readInitializer
  | user_word_listenInitializer
  | user_word_readInitializer
  | wordInitializer

interface InitializerTypeMap {
  'cc_cedict': cc_cedictInitializer;
  'cc_cedict_definition': cc_cedict_definitionInitializer;
  'corpus': corpusInitializer;
  'definition': definitionInitializer;
  'next_sentence': next_sentenceInitializer;
  'sentence': sentenceInitializer;
  'sentence_word': sentence_wordInitializer;
  'user': userInitializer;
  'user_sentence_listen': user_sentence_listenInitializer;
  'user_sentence_read': user_sentence_readInitializer;
  'user_word_listen': user_word_listenInitializer;
  'user_word_read': user_word_readInitializer;
  'word': wordInitializer;
}

export {
  cc_cedict, cc_cedictInitializer, cc_cedictId,
  cc_cedict_definition, cc_cedict_definitionInitializer,
  corpus, corpusInitializer, corpusId,
  definition, definitionInitializer, definitionId,
  next_sentence, next_sentenceInitializer,
  sentence, sentenceInitializer, sentenceId,
  sentence_word, sentence_wordInitializer,
  user, userInitializer, userId,
  user_sentence_listen, user_sentence_listenInitializer,
  user_sentence_read, user_sentence_readInitializer,
  user_word_listen, user_word_listenInitializer,
  user_word_read, user_word_readInitializer,
  word, wordInitializer, wordId,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
