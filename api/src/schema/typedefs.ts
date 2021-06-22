import { gql } from 'apollo-server';
// TODO If/as this file grows, break it out types/queries/mutations?

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
    simplified: String!
    traditional: String!
    pinyin: String!
    definitions: [String!]!
  }

  type Word {
    hanzi: String!
    hskWord2010: Int!
    hskChar2010: Int!
    ccceDefinitions: [CCCEDefinition]! # possible that some words lack definition
  }

  type SentenceWord {
    # wordHanzi: String! redundant coz in Word as hanzi
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

  type Query {
    #word: Word
    #document: Document
    documents: [Document!]!
  }
`;
