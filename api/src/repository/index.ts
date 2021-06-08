import { Document } from '../schema/gql-model';

// By having this repository return direct graphql types (rather than the direct sql types it currently hides,
// I hope that if I swap to neo4j or even a different sql, I don't need to run around changing my resolvers, I can just do it here...)

// this might be naive, especially with reference to:
// possibly should be using something like this: https://github.com/cvburgess/SQLDataSource recommended here: https://www.apollographql.com/docs/apollo-server/data/data-sources/

export interface ILanguageRepository {
  getDocuments: () => Document[];
}
// CONTINUE HERE - put a full fake 'document' here, then set up
// apollo client in the front end and get it to pull from here.
// then actually connect postgres here.
export class PostgresqlRepo implements ILanguageRepository {
  getDocuments() {
    return [
      {
        sentences: [
          {
            words: [{ wordHanzi: '' }],
            chinese: 'bla bla',
          },
        ],
        chinese: 'bla bla',
        english: 'bloop',
      },
    ];
  }
}
