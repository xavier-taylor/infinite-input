import { gql } from 'apollo-server';

// TODO analyse fields against sql and stanza - are the right things nullable?
export const typeDefs = gql`
  # TODO add id fields for cacheable objects
  type NamedEntity {
    chinese: String!
    entityType: String!
    start: Int!
    end: Int!
  }

  type CCCEDefinition {
    id: String!
    simplified: String!
    traditional: String!
    pinyin: String!
    definitions: [String!]!
  }

  type Word {
    hanzi: String!
    hskWord2010: Int!
    hskChar2010: Int!
    ccceDefinitions: [CCCEDefinition!]! # possible that some words lack definition - in that case, we just get an empty array here.
  }

  type SentenceWord {
    sentenceId: String!
    index: Int! # this corresponds to what is currently 'id' on sentence_word, which is the index of the word in this sentence
    wordHanzi: String!
    lemma: String!
    partOfSpeech: String!
    universalPartOfSpeech: String!
    namedEntity: NamedEntity
    word: Word!
    due: Boolean! # whether this is a word we are reviewing, ie a word that was due today (or soon)
  }

  type Sentence {
    id: String!
    words: [SentenceWord!]!
    chinese: String!
  }

  type Document {
    id: String!
    sentences: [Sentence!]!
    english: String
    chinese: String!
  }

  enum StudyType {
    READ
    LISTEN
    LISTEN_HUMAN
  }

  type Query {
    words(words: [String!]!): [Word!]! # the param words is the hanzi strins
    #word: Word
    #document: Document
    documentsDue(studyType: StudyType!): [Document!]!
    document(id: String!): Document!
    concordanceDocs(word: String!): [Document!]!
  }
`;
