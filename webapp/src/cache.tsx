import { InMemoryCache, InMemoryCacheConfig, makeVar } from '@apollo/client';
import {
  Document,
  DocumentByIdQueryVariables,
  TypedTypePolicies,
  Word,
} from './schema/generated';

export type DocumentIdList = Array<Document['id']>;
export type WordHanziList = Array<Word['hanzi']>;

/**
 * The following reactive variables track:
 *  1. documents for review
 *  2. orphan words
 *  3. words we go wrong during a document review
 * See Hooks/words.tsx
 */
// we read these 'to read' docs starting at index 0
export const docsToReadVar = makeVar<DocumentIdList>([]);
// these 'already read' docs have the most recently read arr[length-1]
export const readDocsVar = makeVar<DocumentIdList>([]);
export const wordsToReadVar = makeVar<WordHanziList>([]);
export const readWordsVar = makeVar<WordHanziList>([]);
export const haveFetchedReadingDueVar = makeVar<boolean>(false);

export const docsToListenVar = makeVar<DocumentIdList>([]);
export const listenedDocsVar = makeVar<DocumentIdList>([]);
export const wordsToListenVar = makeVar<WordHanziList>([]);
export const listenedWordsVar = makeVar<WordHanziList>([]);
export const haveFetchedListeningDueVar = makeVar<boolean>(false);

/**
 * The following reactive variables track New words
 *
 */

/**
 * Think through the new word flow (at high level)
 * Then think about how to implement it.
 * Where possible, minimize use of reactive variables and front end stuff
 *
 * Initially, we can't unlock a word just for reading or listening, must do it for both
 *
 * // We will force you to listen to trad variants as well (not just read them) if you
 * want to unlock the trad variant - justification 'taiwanese pronunciation is different'
 * . So there is no need to unlock simp listen and read and trad read.
 *
 * In what order should the backend serve up new cards, if you have lots of newcards unlocked?
 * Ideally we can support anki style user configurable sorting, although tbh that might be quite hard.
 *
 * The general idea is that the user unlocks words from the browse view (electing to optionaly also unlock trad/simp variants)
 *
 * The most obviously useful solution is that we serve newCards up in order of how long ago they were unlocked.
 * So store unlockedDate on student_word_listen and student_word_read.
 * I think I can safely leave improving that till the future.
 * For now,
 *
 * Ok so newWords endpoint returns a list of words, with no in build knowledge about trad/simp variants
 * you store those words' (wordHanzi id) in a reactive variable toLearn[]
 * then have: 2/3 -> 1/3 meaning[] (can you remember the meaning when shown char and pronunciation/audio)
 * then into: 2/3 -> 1/3 pronunciation[] can you remember the pronunciation when shown char and meaning
 * then into: 2/3 -> 1/3 recognition[] can you pick the character (against some random others) when given audio/pronuncation and meaning
 * then into 1/3 -> 2/3 reading[] can you read the character (remember its meaning and prondunciation)
 * Could do more, but that is maybe enough for now. After you successfully read it
 * send a mutation that sets that student_word_listen and student_word_read
 * into 'due tomorrow' so to speak.
 *
 * We have a learning_state on the student_word that ideally we would  set
 * after each word.
 *
 * We will introduce a new graphql type called NewWord.
 * Should we?
 * The point of storing learning_state is that we can update the backend with partial learning states
 * so that interupted study sessions can be reviewed.
 *
 * We can use that enum on the front end via graphql, or we can not. The choice is ours.
 * Take time to think about it before implementing something.
 *
 * how about: 1. query to backend gets say 15 words to learn (prioritizing words in intermediate learning_state)
 * we store those words id in a reactive variable.
 *  Note that if we already learned 15 words today, query returns nothing,
 * givign us message 'already studied 15 words', can click 'study more'
 * and requery with a FORCE param.
 * after studying all available words, if we studied less than 15 today,
 * message' you need to unlock more words over in browse tab'
 * 2. we work thru the words. as we click 'done' or whatever,
 * we optimisticallly update our cached value of the 'learning_state'
 *
 * How do we actually work thru the words tho? do we store our reference to them in 4 different
 * reactive variables? That would probably work. just need to, when we grab from server,
 * initially put them in the right reactive variable based on their learning_state
 *
 * Then how do we work thru them? Could just go end to end, like 'all meaning'
 * then 'all prounciation' then 'all recognition'
 * and just when get word wrong, put it to back of current queue rather than promote it
 *
 * downside would be if word is last in queue and we get it wrong, we see it again instantly
 * might be better to do anki style 'due' based on date_time, purely local.
 *
 * TODO continue here ^ implement new word logic in the front end.
 *
 *
 *
 */

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      document: {
        read(_, { args, toReference }) {
          // This tells us to try the query Document (which is a by id query) first against our cache.
          // note that if there is a cache miss, it still queries the server
          // https://stackoverflow.com/questions/65842596/apollo-client-using-cached-results-from-object-list-in-response-to-query-for-s?rq=1
          const vars = args as DocumentByIdQueryVariables;
          return toReference({
            __typename: 'Document',
            id: vars.id,
          });
        },
      },
      // Not currently using this reactive variables via the cache, but may do so...
      haveFetchedReadingDue: {
        read() {
          return haveFetchedReadingDueVar();
        },
      },
      docsToRead: {
        read() {
          return docsToReadVar();
        },
      },
      readDocs: {
        read() {
          return readDocsVar();
        },
      },
      wordsToRead: {
        read() {
          return wordsToReadVar();
        },
      },
      readWords: {
        read() {
          return readWordsVar();
        },
      },
      haveFetchedListeningDue: {
        read() {
          return haveFetchedListeningDueVar();
        },
      },
      docsToListen: {
        read() {
          return docsToListenVar();
        },
      },
      listenedDocs: {
        read() {
          return listenedDocsVar();
        },
      },
      wordsToListen: {
        read() {
          return wordsToListenVar();
        },
      },
      listenedWords: {
        read() {
          return listenedWordsVar();
        },
      },
    },
  },
  Word: {
    keyFields: ['hanzi'],
    fields: {
      // forgot is just used when doing word level review
      forgotLISTEN: {
        read(forgotLISTEN = false) {
          return forgotLISTEN;
        },
      },
      forgotREAD: {
        read(forgotREAD = false) {
          return forgotREAD;
        },
      },
    },
  },
  SentenceWord: {
    keyFields: ['stanzaId', 'sentenceId'],
    fields: {
      forgotLISTEN: {
        read(forgotLISTEN = false) {
          return forgotLISTEN;
        },
      },
      forgotREAD: {
        read(forgotREAD = false) {
          return forgotREAD;
        },
      },
      lastClicked: {
        read(lastClicked = 0) {
          // a default value of zero means it hasn't been clicked on yet
          return lastClicked;
        },
      },
    },
  },
};

const config: InMemoryCacheConfig = {
  typePolicies,
};

export const cache = new InMemoryCache(config);
