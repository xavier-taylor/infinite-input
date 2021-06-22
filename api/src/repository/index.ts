import { Pool } from 'pg';
import { Document, SentenceWord, Word } from '../schema/gql-model';

// By having this repository return direct graphql types (rather than the direct sql types it currently hides,
// I hope that if I swap to neo4j or even a different sql, I don't need to run around changing my resolvers, I can just do it here...)

// if I stick with postgres, should swap from the below to this, but for now stick with this so its easier to swap into  neo4j if desired
// possibly should be using something like this: https://github.com/cvburgess/SQLDataSource recommended here: https://www.apollographql.com/docs/apollo-server/data/data-sources/
export type ReviewType = 'Reading' | 'Listening';

export interface ILanguageRepository {
  getDocuments: () => Document[];
  getDueDocuments: (type: ReviewType, studentId: string) => Promise<Document[]>;
}
export class PostgresqlRepo implements ILanguageRepository {
  constructor(private pool: Pool) {}

  // TODO having this magic function do all the work doesn't feel very
  // graphql.
  // In reality, should probably actually use SQL data source and have field level resolvers for the various objects/database records etc
  getDueDocuments(type: ReviewType, studentId: string) {
    return Promise.resolve([]);
    // if (type === 'Reading') {
    //   return Promise.resolve([]);
    //   // return this.pool.query('');
    // } else {
    //   return Promise.resolve([]);
    // }
  }
  getDocuments() {
    const word: Word = {
      hanzi: 'bla',
      hskChar2010: 1,
      hskWord2010: 1,
      ccceDefinitions: [
        {
          simplified: 'bla',
          traditional: 'BLA',
          pinyin: 'bla1',
          definitions: ['bla means i dont care'],
        },
      ],
    };
    const sw: SentenceWord = {
      lemma: 'blalemma',
      partOfSpeech: 'verb',
      universalPartOfSpeech: 'verb1',
      word,
      due: true,
    };
    return [
      {
        id: 'id',
        sentences: [
          {
            id: 'id1',
            words: [sw, sw],
            chinese: 'bla bla',
          },
        ],
        chinese: 'bla bla',
        english: 'bloop',
      },
    ];
  }
}
