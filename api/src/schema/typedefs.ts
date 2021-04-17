import { gql } from 'apollo-server';
// If/as this file grows, break it out

export const typeDefs = gql`
    type SentenceWord {

    }
    
    type Sentence {
        words: [SentenceWord]
    }
    
    type Document {
        sentences: [Sentence]
    }
`;
