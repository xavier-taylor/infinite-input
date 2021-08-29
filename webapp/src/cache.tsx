import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import {
  Document,
  DocumentByIdQueryVariables,
  TypedTypePolicies,
  Word,
} from './schema/generated';

export type DocumentIdList = Array<Document['id']>;
export type WordHanziList = Array<Word['hanzi']>;

/**
 * The following reactive variables track:
 *  1. documents for review
 *  2. orphan words
 *  3. words we go wrong during a document review
 * See Hooks/words.tsx
 */
// we read these 'to read' docs starting at index 0
export const docsToReadVar = makeVar<DocumentIdList>([]);
// these 'already read' docs have the most recently read arr[length-1]
export const readDocsVar = makeVar<DocumentIdList>([]);
export const wordsToReadVar = makeVar<WordHanziList>([]);
export const readWordsVar = makeVar<WordHanziList>([]);
export const haveFetchedReadingDueVar = makeVar<boolean>(false);

export const docsToListenVar = makeVar<DocumentIdList>([]);
export const listenedDocsVar = makeVar<DocumentIdList>([]);
export const wordsToListenVar = makeVar<WordHanziList>([]);
export const listenedWordsVar = makeVar<WordHanziList>([]);
export const haveFetchedListeningDueVar = makeVar<boolean>(false);

/**
 * The following reactive variables track New words
 * TODO(later, once app useable) add support to track how many words you already learned today (ie if you start a second session later in the day, it doesn't suggest that you learn 10 new words (unless you want to))
 * (for this have a standalone endpoint that we automatically fetch when starting up the app, and also refetch whenever a word learning mutation fires)
 *
 */

/**
 *
 * 1. Make a new graphql type called studentWord, a 1:1 clone of student_word. DONE
 * 2. query for getNewWords - returns an array of up to 10 StudentWords whose LearningState is anything but learned
 *  and who have lowest position and who are unlocked. If there aren't 10 unlocked words the response should say 'there arenlt unlocked words etc'. priotize words in intermitent state, if any, over words in not_yet_learned
 * 3. Put the ids for into wordsToLearnVar, (also have learnedWordsVar) and set haveFetchedWordsToLearn to true
 * 4. build a UI for cycling through these words, like the sentence study UI.
 * 5. build a mutation for updating student_word each time you click 'next' (with optimistic local stuff?) (this includes generating creating of student_word_read/listen due tomorrow)
 * 6. WHen done, have a button somewhere to force fetch 10 more words.
 *
 * Can test it out by putting student_words into the required state in pgadmin
 *
 * *  TODO continue here ^ implement above logic
 *
 * NEXT UP
 * build basic browse UI that does this
 * 1. you can search for a word
 * 2. returns that word and any subwords and characters in a sort of table like ui with checkboxes (TODO, design this on paper first)
 * 3. Initially, you can just a) unlock or lock the word (with position being automatically set - custom setting of position is a future TODO)
 *
 * NEXT UP
 * 1. set up the SRS stuff for student_word_read/listen (for both when studying documents and studying orphan/lapsed words)
 *
 * ??? whats next?
 *
 *
 *
 */

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      document: {
        read(_, { args, toReference }) {
          // This tells us to try the query Document (which is a by id query) first against our cache.
          // note that if there is a cache miss, it still queries the server
          // https://stackoverflow.com/questions/65842596/apollo-client-using-cached-results-from-object-list-in-response-to-query-for-s?rq=1
          const vars = args as DocumentByIdQueryVariables;
          return toReference({
            __typename: 'Document',
            id: vars.id,
          });
        },
      },
      // Not currently using this reactive variables via the cache, but may do so...
      haveFetchedReadingDue: {
        read() {
          return haveFetchedReadingDueVar();
        },
      },
      docsToRead: {
        read() {
          return docsToReadVar();
        },
      },
      readDocs: {
        read() {
          return readDocsVar();
        },
      },
      wordsToRead: {
        read() {
          return wordsToReadVar();
        },
      },
      readWords: {
        read() {
          return readWordsVar();
        },
      },
      haveFetchedListeningDue: {
        read() {
          return haveFetchedListeningDueVar();
        },
      },
      docsToListen: {
        read() {
          return docsToListenVar();
        },
      },
      listenedDocs: {
        read() {
          return listenedDocsVar();
        },
      },
      wordsToListen: {
        read() {
          return wordsToListenVar();
        },
      },
      listenedWords: {
        read() {
          return listenedWordsVar();
        },
      },
    },
  },
  StudyState: {
    keyFields: ['hanzi', 'studyType'],
  },
  StudentWord: {
    keyFields: ['hanzi'],
  },
  Word: {
    keyFields: ['hanzi'],
    fields: {
      // forgot is just used when doing word level review
      forgotLISTEN: {
        read(forgotLISTEN = false) {
          return forgotLISTEN;
        },
      },
      forgotREAD: {
        read(forgotREAD = false) {
          return forgotREAD;
        },
      },
    },
  },
  SentenceWord: {
    keyFields: ['stanzaId', 'sentenceId'],
    fields: {
      forgotLISTEN: {
        read(forgotLISTEN = false) {
          return forgotLISTEN;
        },
      },
      forgotREAD: {
        read(forgotREAD = false) {
          return forgotREAD;
        },
      },
      lastClicked: {
        read(lastClicked = 0) {
          // a default value of zero means it hasn't been clicked on yet
          return lastClicked;
        },
      },
    },
  },
};

const config: InMemoryCacheConfig = {
  typePolicies,
};

export const cache = new InMemoryCache(config);
