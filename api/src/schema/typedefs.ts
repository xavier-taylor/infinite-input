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

  # this represents student_word_listen and student_word_read
  type StudyState {
    hanzi: String!
    f1: Int!
    f2: Int!
    due: String! # TODO is there a date type I can easily use that wont break my tooling?
    previous: String!
    understood: [Boolean!]!
    understoodCount: Int!
    underStoodDistinct: Int!
    word: Word!
    studyType: StudyType!
  }

  enum LearningState {
    not_yet_learned
    meaning
    pronunciation
    recognition
    reading
    learned
  }

  # this type represents student_word
  type StudentWord {
    hanzi: String!
    locked: Boolean!
    dateLastUnlocked: String
    dateLearned: String
    learning: LearningState!
    position: Int!
    tags: [String!]!
    word: Word!
    due: String # This can be null when learning = not yet learned or learned
  }

  type Word {
    hanzi: String!
    hskWord2010: Int!
    hskChar2010: Int!
    ccceDefinitions: [CCCEDefinition!]! # possible that some words lack definition - in that case, we just get an empty array here.
  }

  type SentenceWord {
    sentenceId: String!
    stanzaId: Int! # this is the (1 based) index of the word in this sentence
    wordHanzi: String!
    lemma: String!
    partOfSpeech: String!
    universalPartOfSpeech: String!
    namedEntity: NamedEntity
    word: Word!
    due: Boolean! # whether this is a word we are reviewing, ie a word that was due today (or soon)
    # TODO put something here like 'understood' boolean?
    # how to handle read vs listened?
    # how to handle document with same word more than once?
    # how to handle same word in several documents in one session - understand some, forget in others?
    # should I have a seperate type for the mutation/update?
    # that type would more correspond to student_word_read????
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

  # A container type for due documents and
  # orphan words (ie, the words that were due today
  # for which we didn't have documetns for)
  # not sure yet if this needs to return
  # its own study type or if that is just known by the caller
  # TODO return this from documentsDue
  type Due {
    documents: [Document!]!
    orphans: [Word!]!
  }

  enum StudyType {
    READ
    LISTEN
  }

  type NewWordsResponse {
    words: [StudentWord!]!
    wordsLearnedToday: Int!
    # True only if there were enough unlocked words to satisfyy f(count, force, words per day)
    haveEnoughUnlockedWords: Boolean!
  }

  type Query {
    # Count is the number of new words you are after. Cannot override the 'words per day' unless force is set to true
    # Force means 'give me new words even if I have already studied new words today!
    # (The backend will have a 'words per day' hardcoded at 10. Could make it user configureable)
    newWords(count: Int!, force: Boolean!): NewWordsResponse!
    words(words: [String!]!): [Word!]! # the param words is the hanzi strins
    #word: Word
    #document: Document
    due(studyType: StudyType!): Due!
    document(id: String!): Document!
    concordanceDocs(word: String!): [Document!]!
    studentWord(hanzi: String!): StudentWord!
  }

  # TODO enrich this as required for cache updating or error handling
  type DocumentStudyResponse {
    success: Boolean!
  }

  input DocumentStudyPayload {
    documentId: String!
    forgottenWordsHanzi: [String!]!
  }

  type Mutation {
    documentStudy(
      studyType: StudyType!
      payload: DocumentStudyPayload!
    ): DocumentStudyResponse!
  }
`;
