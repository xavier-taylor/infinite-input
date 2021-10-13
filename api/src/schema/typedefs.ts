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
  type StudentWordStudy {
    hanzi: String!
    due: String! # this should be UTC due timestamp
    word: Word!
    studyType: StudyType!
  }

  enum StudentWordState {
    already_exists
    doesnt_exist_yet
    no_such_word
  }

  type BrowseStudentWord {
    studentWord: StudentWord
    studentWordState: StudentWordState!
  }

  enum LearningState {
    not_yet_learned
    meaning
    pronunciation
    reading
    learned
  }

  # this type represents student_word
  # we can sometimes return a 'fake' one of these that doesnt represent in the db yet, but will *if* the student writes it
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
    ccceDefinitions: [CCCEDefinition!]!
    # possible that some words lack definition - in that case, we just get an empty array here.
    # actually, for now, if a word lacks a ccceDefinition, we will not allow the student to study it.
    # hence, we will only ever have 'Words' floating around that have non empty cceDefinitions arrays
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
    orphans: [StudentWordStudy!]!
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
    # currently hardcoded to 10.
    newWords(
      # the start of the users local day, converted into a UTC time in ISO format
      # used to calculate how many words they already learned today, if any
      dayStartUTC: String!
    ): NewWordsResponse!
    moreNewWords(dayStartUTC: String!, count: Int!): NewWordsResponse!
    dailyNewWordsGoal: Int!
    words(words: [String!]!): [Word!]! # the param words is the hanzi strins
    #word: Word
    #document: Document
    due(studyType: StudyType!, dayStartUTC: String!): Due!
    document(id: String!): Document!
    concordanceDocs(word: String!): [Document!]!
    studentWord(hanzi: String!): StudentWord!
    knownWords: [String!]!
    todaysDueWords(dayStartUTC: String!): [String!]!

    browseWord(word: String!): BrowseStudentWord!
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

  type ToggleStudentWordLockResponse implements MutationResponse {
    success: Boolean!
    studentWord: StudentWord!
  }

  input DocumentStudyPayload {
    documentId: String!
    forgottenWordsHanzi: [String!]! # TODO add remembered words hanzi
  }

  type Mutation {
    # For now, we will automatically put newly unlocked words at position 0.
    # more advanced positioning control and logic is a post mvp todo
    toggleStudentWordLock(hanzi: String!): ToggleStudentWordLockResponse
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
