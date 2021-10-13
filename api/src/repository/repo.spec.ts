import { PostgresqlRepo, sortedDocument } from './repo';
import { Knex } from 'knex';

describe('unit tests for repo methods', () => {
  describe('selectDocuments()', () => {
    it('selects optimal set of documents and returns orphans', () => {
      // Note, this set of documents isn't really optimal, just a first attempt

      const repo = new PostgresqlRepo((null as unknown) as Knex);

      const docs: sortedDocument[] = [
        {
          chinese: '',
          english: '',
          id: 'a',
          count_due: 5,
          distinct_due_words: ['A', 'B', 'C', 'D', 'E'],
          sentence_len: 5,
          fraction_due: 1,
        },
        {
          chinese: '',
          english: '',
          id: 'b',
          count_due: 4,
          distinct_due_words: ['A', 'B', 'C', 'H'],
          sentence_len: 4,
          fraction_due: 1,
        },
        {
          // on face value this is worse that doc b, but after doc a has been grabbed,
          // this one becomes better than doc b for H, because it also has F
          chinese: '',
          english: '',
          id: 'c',
          count_due: 2,
          distinct_due_words: ['H', 'F'],
          sentence_len: 3,
          fraction_due: 0.6,
        },
        {
          chinese: '',
          english: '',
          id: 'd',
          count_due: 1,
          distinct_due_words: ['G'],
          sentence_len: 2,
          fraction_due: 0.5,
        },
      ];

      const dueWords = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].reduce(
        (acc, cur) => {
          acc.set(cur, 5);
          return acc;
        },
        new Map<string, number>()
      );
      const { documents, orphans } = repo.selectDocuments(docs, dueWords);
      expect(documents.map((d) => d.id)).toEqual(
        [
          {
            chinese: '',
            english: '',
            id: 'a',
            count_due: 5,
            distinct_due_words: ['A', 'B', 'C', 'D', 'E'],
            sentence_len: 5,
            fraction_due: 1,
          },
          {
            chinese: '',
            english: '',
            id: 'c',
            count_due: 2,
            distinct_due_words: ['H', 'F'],
            sentence_len: 3,
            fraction_due: 0.6,
          },
          {
            chinese: '',
            english: '',
            id: 'd',
            count_due: 1,
            distinct_due_words: ['G'],
            sentence_len: 2,
            fraction_due: 0.5,
          },
        ].map((d) => d.id)
      );
      expect(Array.from(orphans)).toEqual(['I']);
    });

    // TODO write test about the logic for words with interval of 1

    it('doesnt return a word as an orphan if the interval was 1 (therefor we wanted 3), but we only had 2/1 of that word availabile', () => {
      const repo = new PostgresqlRepo((null as unknown) as Knex);

      const docs: sortedDocument[] = [
        {
          chinese: '',
          english: '',
          id: 'a',
          count_due: 5,
          distinct_due_words: ['A', 'B', 'C'],
          sentence_len: 5,
          fraction_due: 1,
        },
        {
          chinese: '',
          english: '',
          id: 'b',
          count_due: 5,
          distinct_due_words: ['A', 'B'],
          sentence_len: 5,
          fraction_due: 1,
        },
      ];
      const dueWords = ['A', 'B', 'C', 'I'].reduce((acc, cur) => {
        acc.set(cur, 1);
        return acc;
      }, new Map<string, number>());
      const { documents, orphans } = repo.selectDocuments(docs, dueWords);
      expect(Array.from(orphans)).toEqual(['I']);
    });
  });
});
