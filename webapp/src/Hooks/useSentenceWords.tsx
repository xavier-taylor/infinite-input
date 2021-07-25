import { ReactiveVar } from '@apollo/client';
import {
  listenSentenceWordsVar,
  readSentenceWordsVar,
  SentenceWordLocal,
} from '../cache';
import { SentenceWord, StudyType } from '../schema/generated';

// TODO - delete this code, I don't think I need it.

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
