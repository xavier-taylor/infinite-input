import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import { Document, SentenceWord, TypedTypePolicies } from './schema/generated';

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

// TODO are the results of a query against reading typed?
// if not, maybe use useReactiveVar directly?
// can a typeddocumentnode be generated using
// TODO consider using either a react reducer or redux itself for this state managemnt

// Remember - this doesn't need to be perfect yet. just useable for study! can tinker and improve gradually after that.

// Do not waste time optimizing until you are studying with it. Once you are studing with it (against a stable db schema),
// introduce a dev/master branch distinction. Study using the master branch, dev using the dev branch.

/*


*/

// https://www.apollographql.com/blog/apollo-client/caching/local-state-management-with-reactive-variables/#use-case-3-locally-decorated-remote-data
export type SentenceWordLocal = Pick<SentenceWord, 'index' | 'sentenceId'> & {
  forgot: boolean | undefined;
};
export const readSentenceWordsVar = makeVar<SentenceWordLocal[]>([]);
export const listenSentenceWordsVar = makeVar<SentenceWordLocal[]>([]);

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
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
  },
  SentenceWord: {
    keyFields: ['index', 'sentenceId'],
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
      // forgotLISTEN: {
      //   read(_, { readField }) {
      //     const index = readField('index') as SentenceWord['index'];
      //     const sentenceId = readField(
      //       'sentenceId'
      //     ) as SentenceWord['sentenceId'];
      //     return !!readSentenceWordsVar().find(
      //       (w) => w.index === index && w.sentenceId === sentenceId
      //     )?.forgot;
      //   },
      // },
      // forgotREAD: {
      //   read(_, { readField }) {
      //     const index = readField('index') as SentenceWord['index'];
      //     const sentenceId = readField(
      //       'sentenceId'
      //     ) as SentenceWord['sentenceId'];
      //     return !!listenSentenceWordsVar().find(
      //       (w) => w.index === index && w.sentenceId === sentenceId
      //     )?.forgot;
      //   },
      // },
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
