import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import {
  Document,
  DocumentByIdQueryVariables,
  StudentWordForLearningQueryVariables,
  TypedTypePolicies,
  Word,
} from './schema/generated';

export type DocumentIdList = Array<Document['id']>;
export type WordHanziList = Array<Word['hanzi']>;

// TODO code review - originally I had vars like 'readWordsVar' 'listenedDocsVar'
// because I wanted to be able to undo in the UI. I no longer allow that - should
// I simplify code by getting rid of these extra reactive vars or do I need/use them?

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
 *
 */
export const newWordsToLearnVar = makeVar<WordHanziList>([]);
export const learnedNewWordsVar = makeVar<WordHanziList>([]);
// This var represents the first fetch of new words for today
// It doesnt( yet?) represent subsequent above and beyond new words.
export const haveFetchedNewWordsToLearnVar = makeVar<boolean>(false);

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      document: {
        // TODO this and similar logic could potentially be replaced with use of readQuery
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
      studentWord: {
        read(_, { args, toReference }) {
          const vars = args as StudentWordForLearningQueryVariables;
          return toReference({ __typename: 'StudentWord', hanzi: vars.hanzi });
        },
      },
      // Not currently using this reactive variables via the cache, but may do so...
      // TODO read the docs and look at my code and think about whether I should query reactive vars
      // only via propery queries of hte cache...
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
  // Note - if you specify a keyFields, you need to include it in any query (apollo requirement) https://github.com/apollographql/apollo-client/issues/5711
  StudentWordStudy: {
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

// I seem to remember reading that we shouldnt call methods on the cache object,
// just on the client object - cant find a reference, but beware.
// Apollo docs do show it as client.readQuery. Maybe only that is a reactive query?
export const cache = new InMemoryCache(config);
