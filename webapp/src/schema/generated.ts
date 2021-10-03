import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BrowseStudentWord = {
  __typename?: 'BrowseStudentWord';
  studentWord?: Maybe<StudentWord>;
  studentWordState: StudentWordState;
};

export type CcceDefinition = {
  __typename?: 'CCCEDefinition';
  id: Scalars['String'];
  simplified: Scalars['String'];
  traditional: Scalars['String'];
  pinyin: Scalars['String'];
  definitions: Array<Scalars['String']>;
};

export type Document = {
  __typename?: 'Document';
  id: Scalars['String'];
  sentences: Array<Sentence>;
  english?: Maybe<Scalars['String']>;
  chinese: Scalars['String'];
};

export type DocumentStudyPayload = {
  documentId: Scalars['String'];
  forgottenWordsHanzi: Array<Scalars['String']>;
};

export type DocumentStudyResponse = MutationResponse & {
  __typename?: 'DocumentStudyResponse';
  success: Scalars['Boolean'];
};

export type Due = {
  __typename?: 'Due';
  documents: Array<Document>;
  orphans: Array<Word>;
};

export enum LearningState {
  NotYetLearned = 'not_yet_learned',
  Meaning = 'meaning',
  Pronunciation = 'pronunciation',
  Reading = 'reading',
  Learned = 'learned'
}

export type Mutation = {
  __typename?: 'Mutation';
  toggleStudentWordLock?: Maybe<ToggleStudentWordLockResponse>;
  newWordStudy: NewWordStudyResponse;
  documentStudy: DocumentStudyResponse;
};


export type MutationToggleStudentWordLockArgs = {
  hanzi: Scalars['String'];
};


export type MutationNewWordStudyArgs = {
  hanzi: Scalars['String'];
  newDue: Scalars['String'];
  newLearning: LearningState;
};


export type MutationDocumentStudyArgs = {
  studyType: StudyType;
  payload: DocumentStudyPayload;
};

export type MutationResponse = {
  success: Scalars['Boolean'];
};

export type NamedEntity = {
  __typename?: 'NamedEntity';
  chinese: Scalars['String'];
  entityType: Scalars['String'];
  start: Scalars['Int'];
  end: Scalars['Int'];
};

export type NewWordStudyResponse = MutationResponse & {
  __typename?: 'NewWordStudyResponse';
  success: Scalars['Boolean'];
  studentWord: StudentWord;
};

export type NewWordsResponse = {
  __typename?: 'NewWordsResponse';
  words: Array<StudentWord>;
  wordsLearnedToday: Scalars['Int'];
  haveEnoughUnlockedWords: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  browseWord: BrowseStudentWord;
  concordanceDocs: Array<Document>;
  dailyNewWordsGoal: Scalars['Int'];
  document: Document;
  due: Due;
  knownWords: Array<Scalars['String']>;
  moreNewWords: NewWordsResponse;
  newWords: NewWordsResponse;
  sentenceWord?: Maybe<SentenceWord>;
  studentWord: StudentWord;
  todaysDueWords: Array<Scalars['String']>;
  words: Array<Word>;
};


export type QueryBrowseWordArgs = {
  word: Scalars['String'];
};


export type QueryConcordanceDocsArgs = {
  word: Scalars['String'];
};


export type QueryDocumentArgs = {
  id: Scalars['String'];
};


export type QueryDueArgs = {
  studyType: StudyType;
};


export type QueryMoreNewWordsArgs = {
  dayStartUTC: Scalars['String'];
  count: Scalars['Int'];
};


export type QueryNewWordsArgs = {
  dayStartUTC: Scalars['String'];
};


export type QuerySentenceWordArgs = {
  sentenceId: Scalars['String'];
  stanzaId: Scalars['Int'];
};


export type QueryStudentWordArgs = {
  hanzi: Scalars['String'];
};


export type QueryTodaysDueWordsArgs = {
  dayStartUTC: Scalars['String'];
};


export type QueryWordsArgs = {
  words: Array<Scalars['String']>;
};

export type Sentence = {
  __typename?: 'Sentence';
  id: Scalars['String'];
  words: Array<SentenceWord>;
  chinese: Scalars['String'];
};

export type SentenceWord = {
  __typename?: 'SentenceWord';
  due: Scalars['Boolean'];
  forgotLISTEN?: Maybe<Scalars['Boolean']>;
  forgotREAD?: Maybe<Scalars['Boolean']>;
  lastClicked: Scalars['Int'];
  lemma: Scalars['String'];
  namedEntity?: Maybe<NamedEntity>;
  partOfSpeech: Scalars['String'];
  sentenceId: Scalars['String'];
  stanzaId: Scalars['Int'];
  universalPartOfSpeech: Scalars['String'];
  word: Word;
  wordHanzi: Scalars['String'];
};

export type StudentWord = {
  __typename?: 'StudentWord';
  hanzi: Scalars['String'];
  locked: Scalars['Boolean'];
  dateLastUnlocked?: Maybe<Scalars['String']>;
  dateLearned?: Maybe<Scalars['String']>;
  learning: LearningState;
  position: Scalars['Int'];
  tags: Array<Scalars['String']>;
  word: Word;
  due?: Maybe<Scalars['String']>;
};

export enum StudentWordState {
  AlreadyExists = 'already_exists',
  DoesntExistYet = 'doesnt_exist_yet',
  NoSuchWord = 'no_such_word'
}

export type StudyState = {
  __typename?: 'StudyState';
  hanzi: Scalars['String'];
  f1: Scalars['Int'];
  f2: Scalars['Int'];
  due: Scalars['String'];
  previous: Scalars['String'];
  understood: Array<Scalars['Boolean']>;
  understoodCount: Scalars['Int'];
  underStoodDistinct: Scalars['Int'];
  word: Word;
  studyType: StudyType;
};

export enum StudyType {
  Read = 'READ',
  Listen = 'LISTEN'
}

export type ToggleStudentWordLockResponse = MutationResponse & {
  __typename?: 'ToggleStudentWordLockResponse';
  success: Scalars['Boolean'];
  studentWord: StudentWord;
};

export type Word = {
  __typename?: 'Word';
  ccceDefinitions: Array<CcceDefinition>;
  forgotLISTEN?: Maybe<Scalars['Boolean']>;
  forgotREAD?: Maybe<Scalars['Boolean']>;
  hanzi: Scalars['String'];
  hskChar2010: Scalars['Int'];
  hskWord2010: Scalars['Int'];
};

export type ForgottenWordsQueryVariables = Exact<{
  documentId: Scalars['String'];
  includeListen?: Maybe<Scalars['Boolean']>;
  includeRead?: Maybe<Scalars['Boolean']>;
}>;


export type ForgottenWordsQuery = (
  { __typename?: 'Query' }
  & { document: (
    { __typename?: 'Document' }
    & { sentences: Array<(
      { __typename?: 'Sentence' }
      & { words: Array<(
        { __typename?: 'SentenceWord' }
        & MakeOptional<Pick<SentenceWord, 'forgotLISTEN' | 'forgotREAD' | 'wordHanzi'>, 'forgotLISTEN' | 'forgotREAD'>
      )> }
    )> }
  ) }
);

export type ForgotSentenceWordQueryVariables = Exact<{
  sentenceId: Scalars['String'];
  stanzaId: Scalars['Int'];
  includeRead?: Maybe<Scalars['Boolean']>;
  includeListen?: Maybe<Scalars['Boolean']>;
}>;


export type ForgotSentenceWordQuery = (
  { __typename?: 'Query' }
  & { sentenceWord?: Maybe<(
    { __typename?: 'SentenceWord' }
    & MakeOptional<Pick<SentenceWord, 'stanzaId' | 'sentenceId' | 'forgotLISTEN' | 'forgotREAD'>, 'forgotLISTEN' | 'forgotREAD'>
  )> }
);

export type StudentWordQueryVariables = Exact<{
  hanzi: Scalars['String'];
}>;


export type StudentWordQuery = (
  { __typename?: 'Query' }
  & { studentWord: (
    { __typename?: 'StudentWord' }
    & Pick<StudentWord, 'hanzi' | 'learning' | 'due'>
  ) }
);

export type StudentWordForLearningQueryVariables = Exact<{
  hanzi: Scalars['String'];
}>;


export type StudentWordForLearningQuery = (
  { __typename?: 'Query' }
  & { studentWord: (
    { __typename?: 'StudentWord' }
    & Pick<StudentWord, 'hanzi' | 'learning' | 'due'>
    & { word: (
      { __typename?: 'Word' }
      & Pick<Word, 'hanzi'>
      & { ccceDefinitions: Array<(
        { __typename?: 'CCCEDefinition' }
        & Pick<CcceDefinition, 'id' | 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
      )> }
    ) }
  ) }
);

export type StudentWordForLearningFragment = (
  { __typename?: 'StudentWord' }
  & Pick<StudentWord, 'hanzi' | 'learning' | 'due'>
  & { word: (
    { __typename?: 'Word' }
    & Pick<Word, 'hanzi'>
    & { ccceDefinitions: Array<(
      { __typename?: 'CCCEDefinition' }
      & Pick<CcceDefinition, 'id' | 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
    )> }
  ) }
);

export type StudentWordForBrowsingFragment = (
  { __typename?: 'StudentWord' }
  & Pick<StudentWord, 'hanzi' | 'learning' | 'due' | 'position' | 'locked'>
  & { word: (
    { __typename?: 'Word' }
    & Pick<Word, 'hanzi'>
    & { ccceDefinitions: Array<(
      { __typename?: 'CCCEDefinition' }
      & Pick<CcceDefinition, 'id' | 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
    )> }
  ) }
);

export type EntireDocumentFragment = (
  { __typename?: 'Document' }
  & Pick<Document, 'id' | 'english' | 'chinese'>
  & { sentences: Array<(
    { __typename?: 'Sentence' }
    & Pick<Sentence, 'id' | 'chinese'>
    & { words: Array<(
      { __typename?: 'SentenceWord' }
      & Pick<SentenceWord, 'sentenceId' | 'stanzaId' | 'lastClicked' | 'forgotLISTEN' | 'forgotREAD' | 'wordHanzi' | 'lemma' | 'partOfSpeech' | 'universalPartOfSpeech' | 'due'>
      & { namedEntity?: Maybe<(
        { __typename?: 'NamedEntity' }
        & Pick<NamedEntity, 'chinese' | 'entityType' | 'start' | 'end'>
      )>, word: (
        { __typename?: 'Word' }
        & Pick<Word, 'hanzi' | 'hskWord2010' | 'hskChar2010'>
        & { ccceDefinitions: Array<(
          { __typename?: 'CCCEDefinition' }
          & Pick<CcceDefinition, 'id' | 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
        )> }
      ) }
    )> }
  )> }
);

export type DocumentStudyMutationVariables = Exact<{
  studyType: StudyType;
  payload: DocumentStudyPayload;
}>;


export type DocumentStudyMutation = (
  { __typename?: 'Mutation' }
  & { documentStudy: (
    { __typename?: 'DocumentStudyResponse' }
    & Pick<DocumentStudyResponse, 'success'>
  ) }
);

export type NewWordStudyMutationVariables = Exact<{
  hanzi: Scalars['String'];
  newDue: Scalars['String'];
  newLearning: LearningState;
}>;


export type NewWordStudyMutation = (
  { __typename?: 'Mutation' }
  & { newWordStudy: (
    { __typename?: 'NewWordStudyResponse' }
    & Pick<NewWordStudyResponse, 'success'>
    & { studentWord: (
      { __typename?: 'StudentWord' }
      & StudentWordForLearningFragment
    ) }
  ) }
);

export type ToggleSwLockMutationVariables = Exact<{
  hanzi: Scalars['String'];
}>;


export type ToggleSwLockMutation = (
  { __typename?: 'Mutation' }
  & { toggleStudentWordLock?: Maybe<(
    { __typename?: 'ToggleStudentWordLockResponse' }
    & Pick<ToggleStudentWordLockResponse, 'success'>
    & { studentWord: (
      { __typename?: 'StudentWord' }
      & StudentWordForBrowsingFragment
    ) }
  )> }
);

export type NewWordsQueryVariables = Exact<{
  dayStartUTC: Scalars['String'];
}>;


export type NewWordsQuery = (
  { __typename?: 'Query' }
  & { newWords: (
    { __typename?: 'NewWordsResponse' }
    & Pick<NewWordsResponse, 'wordsLearnedToday' | 'haveEnoughUnlockedWords'>
    & { words: Array<(
      { __typename?: 'StudentWord' }
      & StudentWordForLearningFragment
    )> }
  ) }
);

export type MoreNewWordsQueryVariables = Exact<{
  dayStartUTC: Scalars['String'];
  count: Scalars['Int'];
}>;


export type MoreNewWordsQuery = (
  { __typename?: 'Query' }
  & { moreNewWords: (
    { __typename?: 'NewWordsResponse' }
    & Pick<NewWordsResponse, 'wordsLearnedToday' | 'haveEnoughUnlockedWords'>
    & { words: Array<(
      { __typename?: 'StudentWord' }
      & Pick<StudentWord, 'hanzi' | 'learning' | 'due'>
      & { word: (
        { __typename?: 'Word' }
        & Pick<Word, 'hanzi'>
        & { ccceDefinitions: Array<(
          { __typename?: 'CCCEDefinition' }
          & Pick<CcceDefinition, 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
        )> }
      ) }
    )> }
  ) }
);

export type ConcordanceQueryVariables = Exact<{
  word: Scalars['String'];
}>;


export type ConcordanceQuery = (
  { __typename?: 'Query' }
  & { concordanceDocs: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'id' | 'english'>
    & { sentences: Array<(
      { __typename?: 'Sentence' }
      & { words: Array<(
        { __typename?: 'SentenceWord' }
        & Pick<SentenceWord, 'lastClicked' | 'sentenceId' | 'stanzaId' | 'wordHanzi' | 'partOfSpeech' | 'universalPartOfSpeech'>
      )> }
    )> }
  )> }
);

export type DueQueryVariables = Exact<{
  studyType: StudyType;
}>;


export type DueQuery = (
  { __typename?: 'Query' }
  & { due: (
    { __typename?: 'Due' }
    & { documents: Array<(
      { __typename?: 'Document' }
      & EntireDocumentFragment
    )>, orphans: Array<(
      { __typename?: 'Word' }
      & Pick<Word, 'hanzi'>
    )> }
  ) }
);

export type DocumentByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type DocumentByIdQuery = (
  { __typename?: 'Query' }
  & { document: (
    { __typename?: 'Document' }
    & EntireDocumentFragment
  ) }
);

export type DueWordsQueryVariables = Exact<{
  dayStartUTC: Scalars['String'];
}>;


export type DueWordsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'todaysDueWords'>
);

export type KnownWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type KnownWordsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'knownWords'>
);

export type BrowseWordQueryVariables = Exact<{
  word: Scalars['String'];
}>;


export type BrowseWordQuery = (
  { __typename?: 'Query' }
  & { browseWord: (
    { __typename?: 'BrowseStudentWord' }
    & Pick<BrowseStudentWord, 'studentWordState'>
    & { studentWord?: Maybe<(
      { __typename?: 'StudentWord' }
      & StudentWordForBrowsingFragment
    )> }
  ) }
);

export const StudentWordForLearningFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentWordForLearning"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudentWord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"learning"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]} as unknown as DocumentNode<StudentWordForLearningFragment, unknown>;
export const StudentWordForBrowsingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentWordForBrowsing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StudentWord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"learning"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]} as unknown as DocumentNode<StudentWordForBrowsingFragment, unknown>;
export const EntireDocumentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EntireDocument"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"stanzaId"}},{"kind":"Field","name":{"kind":"Name","value":"lastClicked"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"forgotLISTEN"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"forgotREAD"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"lemma"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"namedEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"hskWord2010"}},{"kind":"Field","name":{"kind":"Name","value":"hskChar2010"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<EntireDocumentFragment, unknown>;
export const ForgottenWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ForgottenWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeListen"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeRead"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotLISTEN"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeListen"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"forgotREAD"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeRead"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ForgottenWordsQuery, ForgottenWordsQueryVariables>;
export const ForgotSentenceWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ForgotSentenceWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentenceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stanzaId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeRead"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeListen"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentenceWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sentenceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentenceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stanzaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stanzaId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stanzaId"}},{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"forgotLISTEN"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeListen"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"forgotREAD"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeRead"}}}]}]}]}}]}}]} as unknown as DocumentNode<ForgotSentenceWordQuery, ForgotSentenceWordQueryVariables>;
export const StudentWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hanzi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"learning"}},{"kind":"Field","name":{"kind":"Name","value":"due"}}]}}]}}]} as unknown as DocumentNode<StudentWordQuery, StudentWordQueryVariables>;
export const StudentWordForLearningDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentWordForLearning"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hanzi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"learning"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StudentWordForLearningQuery, StudentWordForLearningQueryVariables>;
export const DocumentStudyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DocumentStudy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStudyPayload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentStudy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}}},{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DocumentStudyMutation, DocumentStudyMutationVariables>;
export const NewWordStudyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewWordStudy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newDue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newLearning"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LearningState"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newWordStudy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hanzi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}}},{"kind":"Argument","name":{"kind":"Name","value":"newDue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newDue"}}},{"kind":"Argument","name":{"kind":"Name","value":"newLearning"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newLearning"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"studentWord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentWordForLearning"}}]}}]}}]}},...StudentWordForLearningFragmentDoc.definitions]} as unknown as DocumentNode<NewWordStudyMutation, NewWordStudyMutationVariables>;
export const ToggleSwLockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleSWLock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleStudentWordLock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hanzi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hanzi"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"studentWord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentWordForBrowsing"}}]}}]}}]}},...StudentWordForBrowsingFragmentDoc.definitions]} as unknown as DocumentNode<ToggleSwLockMutation, ToggleSwLockMutationVariables>;
export const NewWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dayStartUTC"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordsLearnedToday"}},{"kind":"Field","name":{"kind":"Name","value":"haveEnoughUnlockedWords"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentWordForLearning"}}]}}]}}]}},...StudentWordForLearningFragmentDoc.definitions]} as unknown as DocumentNode<NewWordsQuery, NewWordsQueryVariables>;
export const MoreNewWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoreNewWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moreNewWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dayStartUTC"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordsLearnedToday"}},{"kind":"Field","name":{"kind":"Name","value":"haveEnoughUnlockedWords"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"learning"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoreNewWordsQuery, MoreNewWordsQueryVariables>;
export const ConcordanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Concordance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concordanceDocs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastClicked"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"stanzaId"}},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConcordanceQuery, ConcordanceQueryVariables>;
export const DueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Due"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"due"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EntireDocument"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orphans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}}]}}]}}]}},...EntireDocumentFragmentDoc.definitions]} as unknown as DocumentNode<DueQuery, DueQueryVariables>;
export const DocumentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EntireDocument"}}]}}]}},...EntireDocumentFragmentDoc.definitions]} as unknown as DocumentNode<DocumentByIdQuery, DocumentByIdQueryVariables>;
export const DueWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DueWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todaysDueWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dayStartUTC"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dayStartUTC"}}}]}]}}]} as unknown as DocumentNode<DueWordsQuery, DueWordsQueryVariables>;
export const KnownWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"KnownWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"knownWords"}}]}}]} as unknown as DocumentNode<KnownWordsQuery, KnownWordsQueryVariables>;
export const BrowseWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BrowseWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"browseWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentWordState"}},{"kind":"Field","name":{"kind":"Name","value":"studentWord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentWordForBrowsing"}}]}}]}}]}},...StudentWordForBrowsingFragmentDoc.definitions]} as unknown as DocumentNode<BrowseWordQuery, BrowseWordQueryVariables>;
export type BrowseStudentWordKeySpecifier = ('studentWord' | 'studentWordState' | BrowseStudentWordKeySpecifier)[];
export type BrowseStudentWordFieldPolicy = {
	studentWord?: FieldPolicy<any> | FieldReadFunction<any>,
	studentWordState?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CCCEDefinitionKeySpecifier = ('id' | 'simplified' | 'traditional' | 'pinyin' | 'definitions' | CCCEDefinitionKeySpecifier)[];
export type CCCEDefinitionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	simplified?: FieldPolicy<any> | FieldReadFunction<any>,
	traditional?: FieldPolicy<any> | FieldReadFunction<any>,
	pinyin?: FieldPolicy<any> | FieldReadFunction<any>,
	definitions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DocumentKeySpecifier = ('id' | 'sentences' | 'english' | 'chinese' | DocumentKeySpecifier)[];
export type DocumentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sentences?: FieldPolicy<any> | FieldReadFunction<any>,
	english?: FieldPolicy<any> | FieldReadFunction<any>,
	chinese?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DocumentStudyResponseKeySpecifier = ('success' | DocumentStudyResponseKeySpecifier)[];
export type DocumentStudyResponseFieldPolicy = {
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DueKeySpecifier = ('documents' | 'orphans' | DueKeySpecifier)[];
export type DueFieldPolicy = {
	documents?: FieldPolicy<any> | FieldReadFunction<any>,
	orphans?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('toggleStudentWordLock' | 'newWordStudy' | 'documentStudy' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	toggleStudentWordLock?: FieldPolicy<any> | FieldReadFunction<any>,
	newWordStudy?: FieldPolicy<any> | FieldReadFunction<any>,
	documentStudy?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationResponseKeySpecifier = ('success' | MutationResponseKeySpecifier)[];
export type MutationResponseFieldPolicy = {
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NamedEntityKeySpecifier = ('chinese' | 'entityType' | 'start' | 'end' | NamedEntityKeySpecifier)[];
export type NamedEntityFieldPolicy = {
	chinese?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NewWordStudyResponseKeySpecifier = ('success' | 'studentWord' | NewWordStudyResponseKeySpecifier)[];
export type NewWordStudyResponseFieldPolicy = {
	success?: FieldPolicy<any> | FieldReadFunction<any>,
	studentWord?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NewWordsResponseKeySpecifier = ('words' | 'wordsLearnedToday' | 'haveEnoughUnlockedWords' | NewWordsResponseKeySpecifier)[];
export type NewWordsResponseFieldPolicy = {
	words?: FieldPolicy<any> | FieldReadFunction<any>,
	wordsLearnedToday?: FieldPolicy<any> | FieldReadFunction<any>,
	haveEnoughUnlockedWords?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('browseWord' | 'concordanceDocs' | 'dailyNewWordsGoal' | 'document' | 'due' | 'knownWords' | 'moreNewWords' | 'newWords' | 'sentenceWord' | 'studentWord' | 'todaysDueWords' | 'words' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	browseWord?: FieldPolicy<any> | FieldReadFunction<any>,
	concordanceDocs?: FieldPolicy<any> | FieldReadFunction<any>,
	dailyNewWordsGoal?: FieldPolicy<any> | FieldReadFunction<any>,
	document?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>,
	knownWords?: FieldPolicy<any> | FieldReadFunction<any>,
	moreNewWords?: FieldPolicy<any> | FieldReadFunction<any>,
	newWords?: FieldPolicy<any> | FieldReadFunction<any>,
	sentenceWord?: FieldPolicy<any> | FieldReadFunction<any>,
	studentWord?: FieldPolicy<any> | FieldReadFunction<any>,
	todaysDueWords?: FieldPolicy<any> | FieldReadFunction<any>,
	words?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SentenceKeySpecifier = ('id' | 'words' | 'chinese' | SentenceKeySpecifier)[];
export type SentenceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	words?: FieldPolicy<any> | FieldReadFunction<any>,
	chinese?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SentenceWordKeySpecifier = ('due' | 'forgotLISTEN' | 'forgotREAD' | 'lastClicked' | 'lemma' | 'namedEntity' | 'partOfSpeech' | 'sentenceId' | 'stanzaId' | 'universalPartOfSpeech' | 'word' | 'wordHanzi' | SentenceWordKeySpecifier)[];
export type SentenceWordFieldPolicy = {
	due?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotLISTEN?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotREAD?: FieldPolicy<any> | FieldReadFunction<any>,
	lastClicked?: FieldPolicy<any> | FieldReadFunction<any>,
	lemma?: FieldPolicy<any> | FieldReadFunction<any>,
	namedEntity?: FieldPolicy<any> | FieldReadFunction<any>,
	partOfSpeech?: FieldPolicy<any> | FieldReadFunction<any>,
	sentenceId?: FieldPolicy<any> | FieldReadFunction<any>,
	stanzaId?: FieldPolicy<any> | FieldReadFunction<any>,
	universalPartOfSpeech?: FieldPolicy<any> | FieldReadFunction<any>,
	word?: FieldPolicy<any> | FieldReadFunction<any>,
	wordHanzi?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StudentWordKeySpecifier = ('hanzi' | 'locked' | 'dateLastUnlocked' | 'dateLearned' | 'learning' | 'position' | 'tags' | 'word' | 'due' | StudentWordKeySpecifier)[];
export type StudentWordFieldPolicy = {
	hanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	locked?: FieldPolicy<any> | FieldReadFunction<any>,
	dateLastUnlocked?: FieldPolicy<any> | FieldReadFunction<any>,
	dateLearned?: FieldPolicy<any> | FieldReadFunction<any>,
	learning?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	word?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StudyStateKeySpecifier = ('hanzi' | 'f1' | 'f2' | 'due' | 'previous' | 'understood' | 'understoodCount' | 'underStoodDistinct' | 'word' | 'studyType' | StudyStateKeySpecifier)[];
export type StudyStateFieldPolicy = {
	hanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	f1?: FieldPolicy<any> | FieldReadFunction<any>,
	f2?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>,
	previous?: FieldPolicy<any> | FieldReadFunction<any>,
	understood?: FieldPolicy<any> | FieldReadFunction<any>,
	understoodCount?: FieldPolicy<any> | FieldReadFunction<any>,
	underStoodDistinct?: FieldPolicy<any> | FieldReadFunction<any>,
	word?: FieldPolicy<any> | FieldReadFunction<any>,
	studyType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ToggleStudentWordLockResponseKeySpecifier = ('success' | 'studentWord' | ToggleStudentWordLockResponseKeySpecifier)[];
export type ToggleStudentWordLockResponseFieldPolicy = {
	success?: FieldPolicy<any> | FieldReadFunction<any>,
	studentWord?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WordKeySpecifier = ('ccceDefinitions' | 'forgotLISTEN' | 'forgotREAD' | 'hanzi' | 'hskChar2010' | 'hskWord2010' | WordKeySpecifier)[];
export type WordFieldPolicy = {
	ccceDefinitions?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotLISTEN?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotREAD?: FieldPolicy<any> | FieldReadFunction<any>,
	hanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	hskChar2010?: FieldPolicy<any> | FieldReadFunction<any>,
	hskWord2010?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	BrowseStudentWord?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BrowseStudentWordKeySpecifier | (() => undefined | BrowseStudentWordKeySpecifier),
		fields?: BrowseStudentWordFieldPolicy,
	},
	CCCEDefinition?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CCCEDefinitionKeySpecifier | (() => undefined | CCCEDefinitionKeySpecifier),
		fields?: CCCEDefinitionFieldPolicy,
	},
	Document?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DocumentKeySpecifier | (() => undefined | DocumentKeySpecifier),
		fields?: DocumentFieldPolicy,
	},
	DocumentStudyResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DocumentStudyResponseKeySpecifier | (() => undefined | DocumentStudyResponseKeySpecifier),
		fields?: DocumentStudyResponseFieldPolicy,
	},
	Due?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DueKeySpecifier | (() => undefined | DueKeySpecifier),
		fields?: DueFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	MutationResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationResponseKeySpecifier | (() => undefined | MutationResponseKeySpecifier),
		fields?: MutationResponseFieldPolicy,
	},
	NamedEntity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NamedEntityKeySpecifier | (() => undefined | NamedEntityKeySpecifier),
		fields?: NamedEntityFieldPolicy,
	},
	NewWordStudyResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NewWordStudyResponseKeySpecifier | (() => undefined | NewWordStudyResponseKeySpecifier),
		fields?: NewWordStudyResponseFieldPolicy,
	},
	NewWordsResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NewWordsResponseKeySpecifier | (() => undefined | NewWordsResponseKeySpecifier),
		fields?: NewWordsResponseFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Sentence?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SentenceKeySpecifier | (() => undefined | SentenceKeySpecifier),
		fields?: SentenceFieldPolicy,
	},
	SentenceWord?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SentenceWordKeySpecifier | (() => undefined | SentenceWordKeySpecifier),
		fields?: SentenceWordFieldPolicy,
	},
	StudentWord?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StudentWordKeySpecifier | (() => undefined | StudentWordKeySpecifier),
		fields?: StudentWordFieldPolicy,
	},
	StudyState?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StudyStateKeySpecifier | (() => undefined | StudyStateKeySpecifier),
		fields?: StudyStateFieldPolicy,
	},
	ToggleStudentWordLockResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ToggleStudentWordLockResponseKeySpecifier | (() => undefined | ToggleStudentWordLockResponseKeySpecifier),
		fields?: ToggleStudentWordLockResponseFieldPolicy,
	},
	Word?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WordKeySpecifier | (() => undefined | WordKeySpecifier),
		fields?: WordFieldPolicy,
	}
};