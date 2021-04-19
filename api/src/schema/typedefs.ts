import { gql } from 'apollo-server';
// TODO If/as this file grows, break it out types/queries/mutations?

export const typeDefs = gql`
  # TODO add id fields for cacheable objects
  type NamedEntity {
    chinese: String!
    entityType: String!
    start: Int!
    end: Int!
  }

  type CCCEDefinition {
    simplified: String!
    traditional: String!
    pinyin: String!
    meanings: [String!]!
  }

  type Word {
    hanzi: String!
    hskWord2010: Int!
    hskChar2010: Int!
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
    #word: Word
    #document: Document
    documents: [Document!]!
  }
`;
