import React from 'react';
import { compare, ToLearnStudentWordPartial } from '../Hooks/newWords';
import { LearningState } from '../schema/generated';

test('compare function works like I think it does', () => {
  //  nextNewWord is tasked with sorting the array newWordsToLearnVar like so:
  //  [wordsDueInThePast, wordsDueThisSecond, wordsWithNullDue, wordsDueInTheFuture ]
  const now = new Date();

  const past = new Date();
  past.setFullYear(past.getFullYear() - 1);

  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);

  const words: ToLearnStudentWordPartial[] = [
    {
      hanzi: 'undefined',
      due: undefined,
      learning: LearningState.Meaning,
    },
    {
      hanzi: 'future',
      due: future.toISOString(),
      learning: LearningState.Meaning,
    },
    {
      hanzi: 'past',
      due: past.toISOString(),
      learning: LearningState.Meaning,
    },
    {
      hanzi: 'future2',
      due: future.toISOString(),
      learning: LearningState.Meaning,
    },
    { hanzi: 'null', due: null, learning: LearningState.Meaning },
    {
      hanzi: 'now',
      due: now.toISOString(),
      learning: LearningState.Meaning,
    },
  ];
  words.sort(compare(now));

  expect(words.map((w) => w.hanzi)).toEqual([
    'past',
    'now',
    'undefined',
    'null',
    'future',
    'future2',
  ]);
});
