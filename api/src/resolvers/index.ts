import { IContextType } from '../server';
import { Resolvers } from '../schema/gql-model';

export const resolvers: Resolvers<IContextType> = {
  CCCEDefinition: {
    simplified: ({ simplified }) => simplified,
    traditional: ({ traditional }) => traditional,
    pinyin: ({ pinyin }) => pinyin,
    definitions: ({ definitions }) => definitions,
    id: ({ id }) => id as string, // once again, this is just a limitation of the library. TODO - type the repositiory with a WithId<> generic
  },
  Word: {
    hanzi: ({ hanzi }) => hanzi,
    hskChar2010: ({ hsk_char_2010 }) => hsk_char_2010,
    hskWord2010: ({ hsk_word_2010 }) => hsk_word_2010,
    ccceDefinitions: ({ hanzi }, _args, { repo }) => repo.getCCCE(hanzi),
  },
  SentenceWord: {
    sentenceId: ({ sentence_id }) => sentence_id,
    index: ({ id }) => id,
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
  Query: {
    // just to demonstrate if the dataloader on the definition is working
    // TODO consider deleting this words query unless there is a conceivable use for it?
    words: (_parent, { words }, { repo }, _info) => repo.getWords(words),
    // TODO - the query from the front end does *not* pass in the user id!
    // that would be abusable. instead, here at the backend we have some kind of auth thingo whichi gives
    // use the user id
    documentsDue: (_parent, { studyType }, { repo }, _info) =>
      repo.getDueDocuments(studyType),
    document: (_parent, { id }, { repo }, _info) => repo.documentById(id),
    concordanceDocs: (_parent, { word }, { repo }, _info) =>
      repo.getDocuments({ including: [word] }),
    // TODO add document_word or whatever this query is relying on to source control
  },
};
