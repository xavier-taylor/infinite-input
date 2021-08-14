import { ReactiveVar, useReactiveVar } from '@apollo/client';
import {
  docsToListenVar,
  docsToReadVar,
  DocumentIdList,
  haveFetchedListeningDueVar,
  haveFetchedReadingDueVar,
  listenedDocsVar,
  readDocsVar,
} from '../cache';
import { StudyType } from '../schema/generated';

// This module is to handle logic around the documents reactive variables

export const useDocuments = (mode: StudyType) => {
  let haveFetchedDueVar: ReactiveVar<boolean>;
  let docsToStudyVar: ReactiveVar<DocumentIdList>;
  let studiedDocsVar: ReactiveVar<DocumentIdList>;

  if (mode === StudyType.Read) {
    haveFetchedDueVar = haveFetchedReadingDueVar;
    docsToStudyVar = docsToReadVar;
    studiedDocsVar = readDocsVar;
  } else {
    haveFetchedDueVar = haveFetchedListeningDueVar;
    docsToStudyVar = docsToListenVar;
    studiedDocsVar = listenedDocsVar;
  }

  const nextDocument = () => {
    const toStudy = docsToStudyVar();
    const studied = studiedDocsVar();
    if (toStudy.length > 0) {
      studiedDocsVar([...studied, toStudy[0]]);
      docsToStudyVar(toStudy.slice(1));
    }
  };

  const toStudyLength = useReactiveVar(docsToStudyVar).length;
  return {
    nextDocument,
    isLast: useReactiveVar(haveFetchedDueVar) && toStudyLength === 1,
    current: useReactiveVar(docsToStudyVar)[0],
    loading: !useReactiveVar(haveFetchedDueVar),
    finished: haveFetchedDueVar() && docsToStudyVar().length === 0,
    countRemaining: useReactiveVar(docsToStudyVar).length,
  };
};
