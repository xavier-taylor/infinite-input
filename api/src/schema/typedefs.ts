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

  # this represents student_word_listen and student_word_read TODO better name - we are using the word 'studyState elsewhere for something else...
  # we aren't currently using this... should probably delete it.
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
    # Number of words already learned today, not including the words in this response
    # will be used for message like 'you already learned 10 words today, do you want to unlock more?' etc
    wordsLearnedToday: Int!
    # whether there there enouggh unlocked words eitehr for count, or for the balance
    # of 'words to learn' that were remaining (for the newWords query)
    haveEnoughUnlockedWords: Boolean!
  }

  type Query {
    # returns the set of new words to learn today.
    newWords(
      # currently hardcoded to 10.
      # the start of the users local day, converted into a UTC time in ISO format
      # used to calculate how many words they already learned today, if any
      dayStartUTC: String!
    ): NewWordsResponse!
    moreNewWords(dayStartUTC: String!, count: Int!): NewWordsResponse!
    dailyNewWordsGoal: Int!
    words(words: [String!]!): [Word!]! # the param words is the hanzi strins
    #word: Word
    #document: Document
    due(studyType: StudyType!): Due!
    document(id: String!): Document!
    concordanceDocs(word: String!): [Document!]!
    studentWord(hanzi: String!): StudentWord!
  }

  interface MutationResponse {
    success: Boolean!
    # message: String! TODO implement these
    # code: String!
  }

  # TODO enrich this as required for cache updating or error handling
  type DocumentStudyResponse implements MutationResponse {
    success: Boolean!
  }

  type NewWordStudyResponse implements MutationResponse {
    success: Boolean!
    studentWord: StudentWord!
  }

  input DocumentStudyPayload {
    documentId: String!
    forgottenWordsHanzi: [String!]! # TODO add remembered words hanzi
  }

  type Mutation {
    newWordStudy(
      hanzi: String! # The hanzi from the StudentWord
      # UTC timezoned ISO string for when now due
      # Note that when newLearning is 'Learned', the newDue will get applied to the read/write cards
      newDue: String!
      newLearning: LearningState! # the new learning state to set - note it can be the same as it was before.
    ): NewWordStudyResponse!
    documentStudy(
      studyType: StudyType!
      payload: DocumentStudyPayload!
    ): DocumentStudyResponse!
  }
`;
