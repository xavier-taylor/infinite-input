import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type CcceDefinition = {
  __typename?: 'CCCEDefinition';
  simplified: Scalars['String'];
  traditional: Scalars['String'];
  pinyin: Scalars['String'];
  definitions: Array<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Document = {
  __typename?: 'Document';
  id: Scalars['String'];
  sentences: Array<Sentence>;
  english?: Maybe<Scalars['String']>;
  chinese: Scalars['String'];
};

export type NamedEntity = {
  __typename?: 'NamedEntity';
  chinese: Scalars['String'];
  entityType: Scalars['String'];
  start: Scalars['Int'];
  end: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  documents: Array<Document>;
};

export type Sentence = {
  __typename?: 'Sentence';
  id: Scalars['String'];
  words: Array<SentenceWord>;
  chinese: Scalars['String'];
};

export type SentenceWord = {
  __typename?: 'SentenceWord';
  wordHanzi: Scalars['String'];
  lemma: Scalars['String'];
  partOfSpeech: Scalars['String'];
  universalPartOfSpeech: Scalars['String'];
  namedEntity?: Maybe<NamedEntity>;
  word: Word;
  due: Scalars['Boolean'];
};


export type Word = {
  __typename?: 'Word';
  hanzi: Scalars['String'];
  hskWord2010: Scalars['Int'];
  hskChar2010: Scalars['Int'];
  ccceDefinitions: Array<Maybe<CcceDefinition>>;
};

export type DocumentsEnglishOnlyQueryVariables = Exact<{ [key: string]: never; }>;


export type DocumentsEnglishOnlyQuery = (
  { __typename?: 'Query' }
  & { documents: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'english'>
  )> }
);

export type DocumentsChineseOnlyQueryVariables = Exact<{ [key: string]: never; }>;


export type DocumentsChineseOnlyQuery = (
  { __typename?: 'Query' }
  & { documents: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'chinese'>
  )> }
);

export type DocumentsAllQueryVariables = Exact<{ [key: string]: never; }>;


export type DocumentsAllQuery = (
  { __typename?: 'Query' }
  & { documents: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'id' | 'english' | 'chinese'>
    & { sentences: Array<(
      { __typename?: 'Sentence' }
      & Pick<Sentence, 'id' | 'chinese'>
      & { words: Array<(
        { __typename?: 'SentenceWord' }
        & Pick<SentenceWord, 'wordHanzi' | 'lemma' | 'partOfSpeech' | 'universalPartOfSpeech' | 'due'>
        & { namedEntity?: Maybe<(
          { __typename?: 'NamedEntity' }
          & Pick<NamedEntity, 'chinese' | 'entityType' | 'start' | 'end'>
        )>, word: (
          { __typename?: 'Word' }
          & Pick<Word, 'hanzi' | 'hskWord2010' | 'hskChar2010'>
          & { ccceDefinitions: Array<Maybe<(
            { __typename?: 'CCCEDefinition' }
            & Pick<CcceDefinition, 'simplified' | 'traditional' | 'pinyin' | 'definitions'>
          )>> }
        ) }
      )> }
    )> }
  )> }
);


export const DocumentsEnglishOnlyDocument: DocumentNode<DocumentsEnglishOnlyQuery, DocumentsEnglishOnlyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsEnglishOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"}}]}}]}}]};
export const DocumentsChineseOnlyDocument: DocumentNode<DocumentsChineseOnlyQuery, DocumentsChineseOnlyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsChineseOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}}]}}]}}]};
export const DocumentsAllDocument: DocumentNode<DocumentsAllQuery, DocumentsAllQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"lemma"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"namedEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"hskWord2010"}},{"kind":"Field","name":{"kind":"Name","value":"hskChar2010"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]}}]}}]};