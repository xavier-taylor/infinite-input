import { ReactiveVar, useReactiveVar } from '@apollo/client';
import {
  haveFetchedListeningDueVar,
  haveFetchedReadingDueVar,
  listenedWordsVar,
  readWordsVar,
  WordHanziList,
  wordsToListenVar,
  wordsToReadVar,
} from '../cache';
import { StudyType } from '../schema/generated';

// These hooks and their associated reactive variables
// are for reviewing both orphan words, and individual words
// that we forgot during a sentence review.

export const useWords = (mode: StudyType) => {
  let haveFetchedDueVar: ReactiveVar<boolean>;
  let wordsToStudyVar: ReactiveVar<WordHanziList>;
  let studiedWordsVar: ReactiveVar<WordHanziList>;
  if (mode === StudyType.Read) {
    haveFetchedDueVar = haveFetchedReadingDueVar;
    wordsToStudyVar = wordsToReadVar;
    studiedWordsVar = readWordsVar;
  } else {
    haveFetchedDueVar = haveFetchedListeningDueVar;
    wordsToStudyVar = wordsToListenVar;
    studiedWordsVar = listenedWordsVar;
  }

  const nextWord = () => {
    const toStudy = wordsToStudyVar();
    const studied = studiedWordsVar();
    if (toStudy.length > 0) {
      studiedWordsVar([...studied, toStudy[0]]);
      wordsToStudyVar(toStudy.slice(1));
    }
  };

  return {
    next: nextWord,
    countRemaining: useReactiveVar(wordsToStudyVar).length,
  };
};
