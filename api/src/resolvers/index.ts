import { IContextType } from '../server';
import { Resolvers } from '../schema/gql-model';

export const resolvers: Resolvers<IContextType> = {
  CCCEDefinition: {
    simplified: ({ simplified }) => simplified,
    traditional: ({ traditional }) => traditional,
    pinyin: ({ pinyin }) => pinyin,
    definitions: ({ definitions }) => definitions,
  },
  Word: {
    hanzi: ({ hanzi }) => hanzi,
    hskChar2010: ({ hsk_char_2010 }) => hsk_char_2010,
    hskWord2010: ({ hsk_word_2010 }) => hsk_word_2010,
    ccceDefinitions: ({ hanzi }, _args, { dataSources }) =>
      dataSources.db.getCCCE(hanzi),
  },
  SentenceWord: {
    wordHanzi: ({ word_hanzi }) => word_hanzi,
    lemma: ({ lemma }) => lemma,
    partOfSpeech: ({ part_of_speech }) => part_of_speech,
    universalPartOfSpeech: ({ universal_part_of_speech }) =>
      universal_part_of_speech,
    // namedEntity: () => undefined, // TODO
    due: () => true, // TODO implement
    word: ({ word_hanzi }, _args, { dataSources }) =>
      dataSources.db.getWord(word_hanzi),
  },
  Sentence: {
    chinese: (parent) => parent.chinese,
    id: (parent) => parent.id as string,
    words: (parent, args, { dataSources }, _info) => {
      return dataSources.db.getSentenceWords(parent.id as string);
    },
  },
  Document: {
    chinese: (parent, args, context, _info) => parent.chinese,
    english: (parent, args, context, _info) => parent.english,
    id: (parent, args, context, _info) => parent.id as string, // TODO get a better type generation lib - this one just makes id fields optional for some reason (maybe coz PK, maybe coz serial)
    sentences: ({ id }, args, { dataSources }, _info) =>
      dataSources.db.getSentences(id as string),
  },
  Query: {
    // TODO - the query from the front end does *not* pass in the user id!
    // that would be abusable. instead, here at the backend we have some kind of auth thingo whichi gives
    // use the user id
    documents: (_parent, _args, context, _info) =>
      context.dataSources.db.getDueDocuments(),
  },
};
