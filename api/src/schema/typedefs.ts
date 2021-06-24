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
    id: String! # this is *not* the id from sentence_word, but instead a unique id made by adding sentence_words id and sentence_id
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

  type Query {
    #word: Word
    #document: Document
    documents: [Document!]!
    concordanceDocs(word: String!): [Document!]!
  }
`;
