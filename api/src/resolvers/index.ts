import { IContextType } from '../server';
import {
  DocumentStudyResponse,
  Due,
  LearningState,
  NewWordStudyResponse,
  Resolvers,
  ResolversTypes,
  StudentWordState,
  StudyType,
} from '../schema/gql-model';
import {
  document,
  learning_state,
  student_word,
} from '../repository/sql-model';
import { toGQLLearningStateEnum } from '../utils/typeConversions';
import axios from 'axios';
import { ForvoApiResponse } from '../utils/forvo';
import { PostgresqlRepo } from '../repository/repo';
import { MAX_GRAPHQL_INT } from '../utils/number';

const USER_ID = `1`; // TODO get this from ctx or whatever

const WORDS_PER_DAY = 20;
export const resolvers: Resolvers<IContextType> = {
  MutationResponse: {
    __resolveType(MutationResponse) {
      const NewWordStudyResponse = MutationResponse as NewWordStudyResponse;
      // const DocumentStudyResponse = MutationResponse as DocumentStudyResponse;
      if (NewWordStudyResponse.studentWord) {
        return 'NewWordStudyResponse';
      } else {
        return 'DocumentStudyResponse';
      }
    },
  },
  StudentWordStudy: {
    hanzi: ({ word_hanzi }) => word_hanzi,
    due: ({ due }) => due?.toISOString(),
    studyType: ({ studyType }) => studyType,
    word: ({ word_hanzi }, __, { repo }) => repo.getWord(word_hanzi),
  },
  StudentWord: {
    hanzi: ({ word_hanzi }) => word_hanzi,
    locked: ({ locked }) => locked,
    dateLastUnlocked: ({ date_last_unlocked }) =>
      date_last_unlocked?.toISOString() ?? null,
    dateLearned: ({ date_learned }) => date_learned?.toISOString() ?? null,
    learning: ({ learning }) => toGQLLearningStateEnum(learning),
    position: ({ position }) => position,
    tags: ({ tags }) => tags ?? [],
    word: ({ word_hanzi }, _, { repo }) => repo.getWord(word_hanzi),
    due: ({ due }) => due?.toISOString() ?? null,
  },
  CCCEDefinition: {
    simplified: ({ simplified }) => simplified,
    traditional: ({ traditional }) => traditional,
    pinyin: ({ pinyin }) => pinyin,
    definitions: ({ definitions }) => definitions,
    id: ({ id }) => id as string, // once again, this is just a limitation of the library. TODO - type the repositiory with a WithId<> generic
  },
  Word: {
    hanzi: ({ hanzi }) => hanzi,
    hskChar2010: ({ hsk_char_2010 }) => hsk_char_2010 ?? 7,
    hskWord2010: ({ hsk_word_2010 }) => hsk_word_2010 ?? 7,
    ccceDefinitions: ({ hanzi }, _args, { repo }) => repo.getCCCE(hanzi),
    // readStudy: TODO make resolvers for these. Note that these resolvers
    // listenStudy: get parametized by the hanzi via args, and by student_id via context!
  },
  SentenceWord: {
    sentenceId: ({ sentence_id }) => sentence_id,
    stanzaId: ({ stanza_id }) => stanza_id,
    wordHanzi: ({ word_hanzi }) => word_hanzi,
    lemma: ({ lemma }) => lemma,
    partOfSpeech: ({ part_of_speech }) => part_of_speech,
    universalPartOfSpeech: ({ universal_part_of_speech }) =>
      universal_part_of_speech,
    // namedEntity: () => undefined, // TODO
    due: () => true, // TODO implement
    word: ({ word_hanzi }, _args, { repo }) => repo.getWord(word_hanzi),
  },
  Sentence: {
    chinese: (parent) => parent.chinese,
    id: (parent) => parent.id as string,
    words: (parent, args, { repo }, _info) => {
      return repo.getSentenceWords(parent.id as string);
    },
  },
  Document: {
    chinese: (parent, args, context, _info) => parent.chinese,
    english: (parent, args, context, _info) => parent.english ?? null,
    id: (parent, args, context, _info) => parent.id as string, // TODO get a better type generation lib - this one just makes id fields optional for some reason (maybe coz PK, maybe coz serial)
    sentences: ({ id }, args, { repo }, _info) =>
      repo.getSentences(id as string),
  },
  Mutation: {
    toggleStudentWordLock: (_, { hanzi }, { repo }) => {
      const sw = repo.toggleStudentWordLock(USER_ID, hanzi);
      return { studentWord: sw, success: true };
    },
    documentStudy: (_, { payload, studyType }) => {
      console.log('in the mutation resolver for documentStudy');
      console.log(payload);
      console.log(studyType);
      return { success: true };
    },
    newWordStudy: (_, { hanzi, newDue, newLearning }, { repo }) => {
      console.log(
        'in the mutation resolver for new word study',
        hanzi,
        newDue,
        newLearning
      );

      let updated: Promise<student_word>;
      // Update student_word and create student_word_listen/read
      if (newLearning === LearningState.Learned) {
        updated = repo.learnWord(USER_ID, hanzi, newDue, newLearning);
      } else {
        // just update student_word
        updated = repo.updateStudentWord(USER_ID, hanzi, newDue, newLearning);
      }
      return {
        success: true,
        studentWord: updated,
      };
    },
  },
  Query: {
    words: (_parent, { words }, { repo }, _info) => repo.getWords(words),
    due: async (_parent, { studyType, dayStartUTC }, { repo }, _info) => {
      const due = await repo.getDue(studyType, dayStartUTC, USER_ID);
      return {
        documents: due.documents,
        orphans: due.orphans,
      };
    },
    document: (_parent, { id }, { repo }, _info) => repo.documentById(id),
    concordanceDocs: (_parent, { word }, { repo }, _info) =>
      repo.getDocuments({ including: [word] }),
    // TODO add document_word or whatever this query is relying on to source control

    newWords: async (_, { dayStartUTC }, { repo }) => {
      return newWords(repo, dayStartUTC);
    },
    moreNewWords: async (_, { dayStartUTC, count }, { repo }) => {
      const userId = `1`; // TODO get this from ctx or whatever
      // TODO optimization can I run these queries in parallel plz
      const wordsLearnedAlreadyToday = await repo.getCountWordsAlreadyLearnedToday(
        userId,
        dayStartUTC
      );
      const words = await repo.getNewWords(userId, count);
      return {
        wordsLearnedToday: wordsLearnedAlreadyToday,
        haveEnoughUnlockedWords: !(words.length < count),
        words,
      };
    },
    dailyNewWordsGoal: () => WORDS_PER_DAY,
    todaysDueWords: async (_, { dayStartUTC }, { repo }) => {
      // TODO verify that getDueWords uses the logic we will use
      // to determine which words are due today
      const { words } = await newWords(repo, dayStartUTC);
      const dueWords = await repo.getDueWords(USER_ID, dayStartUTC);
      return Array.from(
        new Set([...words.map((w) => w.word_hanzi), ...dueWords])
      );
    },
    knownWords: (_, __, { repo }) => {
      return repo.getLearnedWords(USER_ID);
    },
    // NOTE THIS CURRENTLY ONLY WORKS FOR SIMPLIFIED!!! TODO make it work for trad too
    browseWord: async (_, { word }, { repo }) => {
      const studentWord = await repo.getStudentWordIfExists(USER_ID, word);
      if (studentWord) {
        return {
          studentWord,
          studentWordState: StudentWordState.AlreadyExists,
        };
      } else {
        const dictDefinitions = await repo.getCCCE(word);
        if (dictDefinitions.length > 0) {
          return {
            studentWordState: StudentWordState.DoesntExistYet,
            studentWord: {
              word_hanzi: word,
              student_id: USER_ID,
              locked: true,
              learning: learning_state.not_yet_learned,
              position: MAX_GRAPHQL_INT,
            },
          };
        } else {
          return { studentWordState: StudentWordState.NoSuchWord };
        }
      }
    },
  },
};

async function newWords(repo: PostgresqlRepo, dayStartUTC: string) {
  // TODO optimization can I run these queries in parallel plz
  const wordsLearnedAlreadyToday = await repo.getCountWordsAlreadyLearnedToday(
    USER_ID,
    dayStartUTC
  );

  const wordsRemaining = WORDS_PER_DAY - wordsLearnedAlreadyToday;

  let words: student_word[];
  if (wordsRemaining > 0) {
    words = await repo.getNewWords(USER_ID, wordsRemaining);
  } else {
    words = [];
  }

  return {
    wordsLearnedToday: wordsLearnedAlreadyToday,
    haveEnoughUnlockedWords: !(words.length < wordsRemaining),
    words,
  };
}
