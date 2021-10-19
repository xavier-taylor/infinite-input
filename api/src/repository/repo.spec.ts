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
      expect(orphans).toEqual(['I']);
    });

    it('when interval is 1, we want the word 3 times in documents. If just available in 1-2 documents, return those 1-2 documents, but no orphans for that word. Only return orphans for words that appear in no documents', () => {
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
      expect(documents.length).toBe(2);
      expect(orphans).toEqual(['I']);
    });
    it('all orphans are returned just once, regardless of their interval', () => {
      const repo = new PostgresqlRepo((null as unknown) as Knex);

      const docs: sortedDocument[] = [];
      const dueWords = ['A'].reduce((acc, cur) => {
        acc.set(cur, 1);
        return acc;
      }, new Map<string, number>());
      dueWords.set('B', 2);
      const { documents, orphans } = repo.selectDocuments(docs, dueWords);
      expect(orphans).toEqual(['A', 'B']);
    });
  });
});
