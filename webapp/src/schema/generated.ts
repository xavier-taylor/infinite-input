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
  meanings: Array<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Document = {
  __typename?: 'Document';
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
  words: Array<SentenceWord>;
  chinese: Scalars['String'];
};

export type SentenceWord = {
  __typename?: 'SentenceWord';
  wordHanzi: Scalars['String'];
  lemma: Scalars['String'];
  partOfSpeech: Scalars['String'];
  univeralPartOfSpeech: Scalars['String'];
  namedEntity?: Maybe<NamedEntity>;
  word: Word;
};


export type Word = {
  __typename?: 'Word';
  hanzi: Scalars['String'];
  hskWord2010: Scalars['Int'];
  hskChar2010: Scalars['Int'];
  definitions: Array<Maybe<CcceDefinition>>;
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


export const DocumentsEnglishOnlyDocument: DocumentNode<DocumentsEnglishOnlyQuery, DocumentsEnglishOnlyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsEnglishOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"english"}}]}}]}}]};
export const DocumentsChineseOnlyDocument: DocumentNode<DocumentsChineseOnlyQuery, DocumentsChineseOnlyQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsChineseOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}}]}}]}}]};