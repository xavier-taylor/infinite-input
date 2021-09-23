import { ReactiveVar, useReactiveVar } from '@apollo/client';
import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import { ResultOf } from '@graphql-typed-document-node/core';
import { client } from '..';
import { cache, WordHanziList } from '../cache';
import {
  learnedNewWordsVar,
  haveFetchedNewWordsToLearnVar,
  newWordsToLearnVar,
} from '../cache';
import { LearningState, StudentWordDocument } from '../schema/generated';

interface NewWords {
  nextNewWord: () => void;
  current: string; // the 0th item in the array, the one that is due for learning now
  isLast: boolean;
  loading: boolean;
  finished: boolean;
}
export type ToLearnStudentWordPartial = ResultOf<
  typeof StudentWordDocument
>['studentWord'];
// TODO must go through all graphql useQuery and check if
// I need to set a different than default fetch policy (which is cache first)
export const useNewWords = (): NewWords => {
  // NOTE - this function must be called *after* updated to the StudentWords in the cache!
  const nextNewWord = () => {
    const toLearn = newWordsToLearnVar();
    const learned = learnedNewWordsVar();
    // 1) Check if There is a word in toLearn in state learned - if so, bump it into learned
    const augmentedToLearn: Array<ToLearnStudentWordPartial> = toLearn.map(
      (hanzi) => {
        const rv = client.readQuery({
          query: StudentWordDocument,
          variables: {
            hanzi,
          },
        });
        if (!rv) throw Error(`Cache didnt have ${hanzi}`); // TODO remove this
        return rv!.studentWord;
      }
    );
    const newLearned = augmentedToLearn
      .filter((a) => a.learning === LearningState.Learned)
      .map((a) => a.hanzi);
    learnedNewWordsVar([...learned, ...newLearned]);

    const newToLearn = augmentedToLearn.filter(
      (a) => a.learning !== LearningState.Learned
    );
    // 2) apply sort on the remaining words
    const now = new Date();
    newToLearn.sort(compare(now));
    // 3) pop those into the reactive var
    newWordsToLearnVar(newToLearn.map((w) => w.hanzi));
  };

  // TODO - review all these - copied kind of blindly, can probably trim some
  const toLearnLength = useReactiveVar(newWordsToLearnVar).length;
  return {
    nextNewWord,
    loading: !useReactiveVar(haveFetchedNewWordsToLearnVar),
    isLast:
      useReactiveVar(haveFetchedNewWordsToLearnVar) && toLearnLength === 1,
    current: useReactiveVar(newWordsToLearnVar)[0],
    finished: haveFetchedNewWordsToLearnVar() && toLearnLength === 0,
  };
};

// Used for sorting such that an array ends up in this order:
//    * [wordsDueInThePast, wordsDueThisSecond, wordsWithNullDue, wordsDueInTheFuture ]
export const compare = (now: Date) => (
  a: ToLearnStudentWordPartial,
  b: ToLearnStudentWordPartial
): number => {
  if (a.due && b.due) {
    const aDate = new Date(a.due);
    const bDate = new Date(b.due);
    return aDate.getTime() - bDate.getTime();
  } else if (a.due && !b.due) {
    //    * [wordsDueInThePast, wordsDueThisSecond, wordsWithNullDue, wordsDueInTheFuture ]
    // 3 cases. a is now. a is past. a is future
    const aDate = new Date(a.due);
    if (aDate.getTime() > now.getTime()) {
      //a is in future
      return 1;
    } else if (aDate.getTime() === now.getTime()) {
      // a is now
      return -1;
    } else {
      // a is in the past
      return -1;
    }
  } else if (!a.due && b.due) {
    //    * [wordsDueInThePast, wordsDueThisSecond, wordsWithNullDue, wordsDueInTheFuture ]
    // 3 cases. b is now. b is past. b is future
    const bDate = new Date(b.due);
    // if b is in the future dont flip
    if (bDate.getTime() > now.getTime()) return -1;
    // if b is now or in hte past, flip
    return 1;
  } else {
    return 0;
  }
};
