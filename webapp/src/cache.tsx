import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import { Document, TypedTypePolicies } from './schema/generated';

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

// CONTINUE HERE - using
// https://www.apollographql.com/blog/apollo-client/caching/local-state-management-with-reactive-variables/
// and https://www.apollographql.com/docs/react/local-state/client-side-schema/
// trying a simple local state solution using reacctive variables as value of local only query fields - see example of cart

// WHEN YOU CONTINUE HERE - basically work on this pag and in StudyContainer to get a 'reading' study going,
// ie - fetch the reading doc ids (if haveFetched is false)
// put them in docsToReadVar
// then, grab just the doc u want (using its id), grab the entire doc and pass it into the study component
// and so on and so forther
// you will then need to do
/// 1. user can click any word in Study to see definition for that word
// user can mark work as didnt understand
// word is mutated as understood or not understood when document finished
// user can go baack tp previous sentenence - for now, will refire study events for those words, so make back end idempotent
// future TODO - repeat mutations are not re sent to back end

// Remember - this doesn't need to be perfect yet. just useable for study! can tinker and improve gradually after that.

// Do not waste time optimizing until you are studying with it. Once you are studing with it (against a stable db schema),
// introduce a dev/master branch distinction. Study using the master branch, dev using the dev branch.

/*


*/
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

// TODO learn how to modify the cache of a sentence word.
// I want to add a 'lastClicked' whose value is new Date().getTime()

// TODO are there size limits on the in memory cache that I should worry about?

// TODO can I write a 'local schema' which gets picked up by my graphql codegen?? allowing me to have TypedDocumentNode including local only fields?

// I probably need that/want that for my Document compponent (think of case of going 'prev' and grabbing previous state on SentenceWords)
