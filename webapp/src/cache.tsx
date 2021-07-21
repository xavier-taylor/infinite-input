import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import { Document, TypedTypePolicies } from './schema/generated';

export type DocumentIdList = Array<Document['id']>;

export const docsToReadVar = makeVar<DocumentIdList>([]);
export const readDocsVar = makeVar<DocumentIdList>([]);
export const haveFetchedDocsToReadVar = makeVar<boolean>(false);

// TODO are the results of a query against reading typed?
// if not, maybe use useReactiveVar directly?
// can a typeddocumentnode be generated using
// TODO consider using either a react reducer or redux itself for this state managemnt

// CONTINUE HERE - using
// https://www.apollographql.com/blog/apollo-client/caching/local-state-management-with-reactive-variables/
// and https://www.apollographql.com/docs/react/local-state/client-side-schema/
// trying a simple local state solution using reacctive variables as value of local only query fields - see example of cart

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
    },
  },
  Word: {
    keyFields: ['hanzi'],
  },
  SentenceWord: {
    keyFields: ['id', 'sentenceId'],
  },
};

const config: InMemoryCacheConfig = {
  typePolicies,
};

interface Test {}

export const cache = new InMemoryCache(config);
