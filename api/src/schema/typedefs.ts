import { gql } from 'apollo-server';
// TODO If/as this file grows, break it out

export const typeDefs = gql`
    type NamedEntity {

    }
    
    type Definition {

    }

    # data from both sentence_word and word
    type SentenceWord {
        wordHanzi: String!
        lemma: String!
        partOfSpeech: String!
        univeralPartOfSpeech: String!
        definitions: [Definition]! # possible that some words lack definition
    }
    
    type Sentence {
        words: [SentenceWord!]!
    }
    
    type Document {
        sentences: [Sentence!]!
    }
`;
