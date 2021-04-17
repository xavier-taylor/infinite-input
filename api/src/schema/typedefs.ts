import { gql } from 'apollo-server';
// TODO If/as this file grows, break it out types/queries/mutations?

export const typeDefs = gql`
  type NamedEntity {
    chinese: String!
    entityType: String!
    start: Number!
    end: Number!
  }

  type CCCEDefinition {
    simplified: String!
    traditional: String!
    pinyin: String!
    meanings: [String!]!
  }

  type Word {
    hanzi: String!
    hskWord2010: Number!
    hskChar2010: Number!
    definitions: [CCCEDefinition]! # possible that some words lack definition
  }

  type SentenceWord {
    wordHanzi: String!
    lemma: String!
    partOfSpeech: String!
    univeralPartOfSpeech: String!
    namedEntity: NamedEntity
    word: Word!
  }

  type Sentence {
    words: [SentenceWord!]!
    chinese: String!
  }

  type Document {
    sentences: [Sentence!]!
    english: String
    chinese: String!
  }

  type Query {
    word: Word
    document: Document
    documents: [Document!]!
  }
`;
