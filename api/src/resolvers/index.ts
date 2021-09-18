import { IContextType } from '../server';
import { LearningState, Resolvers, StudyType } from '../schema/gql-model';
import { learning_state, student_word } from '../repository/sql-model';

function toGQLLearningStateEnum(ls: learning_state): LearningState {
  switch (ls) {
    case learning_state.not_yet_learned:
      return LearningState.NotYetLearned;
    case learning_state.meaning:
      return LearningState.Meaning;
    case learning_state.pronunciation:
      return LearningState.Pronunciation;
    case learning_state.recognition:
      return LearningState.Recognition;
    case learning_state.reading:
      return LearningState.Reading;
    case learning_state.learned:
      return LearningState.Learned;
    default:
      const _ex = ls;
      return _ex;
  }
}

const WORDS_PER_DAY = 10;
export const resolvers: Resolvers<IContextType> = {
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
    english: (parent, args, context, _info) => parent.english,
    id: (parent, args, context, _info) => parent.id as string, // TODO get a better type generation lib - this one just makes id fields optional for some reason (maybe coz PK, maybe coz serial)
    sentences: ({ id }, args, { repo }, _info) =>
      repo.getSentences(id as string),
  },
  Mutation: {
    documentStudy: (_, { payload, studyType }) => {
      console.log('in the mutation resolver for documentStudy');
      console.log(payload);
      console.log(studyType);
      return { success: true };
    },
  },
  Query: {
    // just to demonstrate if the dataloader on the definition is working
    // TODO consider deleting this words query unless there is a conceivable use for it?
    words: (_parent, { words }, { repo }, _info) => repo.getWords(words),
    // TODO - the query from the front end does *not* pass in the user id!
    // that would be abusable. instead, here at the backend we have some kind of auth thingo whichi gives
    // use the user id
    due: async (_parent, { studyType }, { repo }, _info) => {
      // TODO actually get a set of documents to cover as many
      // due words as possible, then return the rest of the due words as
      // orphans
      const orphans =
        studyType === StudyType.Read
          ? await repo.getWords(['我', '她'])
          : await repo.getWords(['熟悉', '热心', '看起来']);
      const documents =
        studyType === StudyType.Read
          ? await repo.getDueDocuments(studyType)
          : (await repo.getDueDocuments(studyType)).slice(1);
      return {
        documents,
        orphans,
      };
    },
    document: (_parent, { id }, { repo }, _info) => repo.documentById(id),
    concordanceDocs: (_parent, { word }, { repo }, _info) =>
      repo.getDocuments({ including: [word] }),
    // TODO add document_word or whatever this query is relying on to source control

    newWords: async (_, { dayStartUTC }, { repo }) => {
      const userId = `1`; // TODO get this from ctx or whatever
      // TODO optimization can I run these queries in parallel plz
      const wordsLearnedAlreadyToday = await repo.getCountWordsAlreadyLearnedToday(
        userId,
        dayStartUTC
      );
      console.log(wordsLearnedAlreadyToday);

      const wordsRemaining = WORDS_PER_DAY - wordsLearnedAlreadyToday;

      let words: student_word[];
      if (wordsRemaining > 0) {
        words = await repo.getNewWords(userId, wordsRemaining);
      } else {
        words = [];
      }

      return {
        wordsLearnedToday: wordsLearnedAlreadyToday,
        haveEnoughUnlockedWords: !(words.length < wordsRemaining),
        words,
      };
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
  },
};
