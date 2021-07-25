import { ReactiveVar } from '@apollo/client';
import {
  listenSentenceWordsVar,
  readSentenceWordsVar,
  SentenceWordLocal,
} from '../cache';
import { SentenceWord, StudyType } from '../schema/generated';

// inspired by this pattern
// https://www.apollographql.com/blog/apollo-client/caching/local-state-management-with-reactive-variables/#use-case-3-locally-decorated-remote-data

// note that currently we are just storing a single boolean that represents
// whether the word was forgotten - can add more

// maybe even just have one reactive var, rather than one for read and one for listen?
// anyhow, think a bout that as the time comes.
export function useSentenceWords(
  readSWV: ReactiveVar<SentenceWordLocal[]> = readSentenceWordsVar,
  listenSWV: ReactiveVar<SentenceWordLocal[]> = listenSentenceWordsVar
) {
  const setForgot = (
    mode: StudyType,
    forgot: boolean,
    index: SentenceWord['index'],
    sentenceId: SentenceWord['sentenceId']
  ) => {
    let newOrUpdated;
    if (mode === StudyType.Read) {
      const existing = readSWV().find(
        (w) => w.index === index && w.sentenceId === sentenceId
      );
      if (existing) {
        newOrUpdated = { ...existing, forgot };
      } else {
        newOrUpdated = { index, sentenceId, forgot };
      }
      readSWV([
        ...readSWV().filter(
          (w) => !(w.index === index && w.sentenceId === sentenceId)
        ),
        newOrUpdated,
      ]);
    } else if (mode === StudyType.Listen) {
      const existing = listenSWV().find(
        (w) => w.index === index && w.sentenceId === sentenceId
      );
      if (existing) {
        newOrUpdated = { ...existing, forgot };
      } else {
        newOrUpdated = { index, sentenceId, forgot };
      }
      listenSWV([
        ...listenSWV().filter(
          (w) => !(w.index === index && w.sentenceId === sentenceId)
        ),
        newOrUpdated,
      ]);
    } else {
      throw new Error(`${mode} not yet implemented`); // TODO
    }
  };

  return {
    operations: { setForgot },
  };
}

// TODO continue here
/*
1. Finish off using reactive variable to track sentence word 'forgot' state. (DONT DELETE OLD CODE IN THE PROCESS)
2. validate that that approach works.

3. Now, compare with the lastclicked approach (where no reactive variable was necassary)
    work out whether/how each change to lastclicked i both a) updating the cache and b) resulting in a 
    re-render of the required react components.

    It seemed to me that a similar approach wasn't working for forgot - the cache was being updated via writeQuery,
    but it seemed like the react component wasn't re-rendering. This is why I tried the reactive variable approach.
    but the reactive variable approach is less elegant and has more boilerplate/overhead - it basically
    results in us creating a second bloody cache.


    if can validate that the lastClicked case works robustly, then (GIT COMMIT CLEARLY) then
    Try and work out if possible to do the 'forgot' case the same way we are doing the lastClicked case - without
    reactive variables


*/
