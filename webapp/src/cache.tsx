import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import {
  Document,
  DocumentByIdQueryVariables,
  TypedTypePolicies,
} from './schema/generated';

// OPTIMIZATION - consider storying these properties in the cache somehow?
export type DocumentIdList = Array<Document['id']>;
// we read these 'to read' docs starting at index 0
export const docsToReadVar = makeVar<DocumentIdList>([]);
// these 'already read' docs have the most recently read arr[length-1]
export const readDocsVar = makeVar<DocumentIdList>([]);
export const haveFetchedDocsToReadVar = makeVar<boolean>(false);

export const docsToListenVar = makeVar<DocumentIdList>([]);
export const listenedDocsVar = makeVar<DocumentIdList>([]);
export const haveFetchedDocsToListenVar = makeVar<boolean>(false);

// TODO - wordsToRead and wordsToListen, for orphan words.

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
      haveFetchedDocsToRead: {
        read() {
          return haveFetchedDocsToReadVar();
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
      haveFetchedDocsToListen: {
        read() {
          return haveFetchedDocsToListenVar();
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
    },
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
