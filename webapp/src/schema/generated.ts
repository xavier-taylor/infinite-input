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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type CcceDefinition = {
  __typename?: 'CCCEDefinition';
  id: Scalars['String'];
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
  words: Array<Word>;
  documents: Array<Document>;
  concordanceDocs: Array<Document>;
};


export type QueryWordsArgs = {
  words: Array<Scalars['String']>;
};


export type QueryConcordanceDocsArgs = {
  word: Scalars['String'];
};

export type Sentence = {
  __typename?: 'Sentence';
  id: Scalars['String'];
  words: Array<SentenceWord>;
  chinese: Scalars['String'];
};

export type SentenceWord = {
  __typename?: 'SentenceWord';
  sentenceId: Scalars['String'];
  index: Scalars['Int'];
  id: Scalars['String'];
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
  ccceDefinitions: Array<CcceDefinition>;
};

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
        & Pick<SentenceWord, 'id' | 'sentenceId' | 'index' | 'wordHanzi' | 'partOfSpeech' | 'universalPartOfSpeech'>
      )> }
    )> }
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
        & Pick<SentenceWord, 'id' | 'sentenceId' | 'index' | 'wordHanzi' | 'lemma' | 'partOfSpeech' | 'universalPartOfSpeech' | 'due'>
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
  )> }
);


export const ConcordanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Concordance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concordanceDocs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}}]}}]}}]}}]}}]}: DocumentNode<ConcordanceQuery, ConcordanceQueryVariables>;
export const DocumentsAllDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"lemma"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"namedEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"hskWord2010"}},{"kind":"Field","name":{"kind":"Name","value":"hskChar2010"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]}}]}}]}: DocumentNode<DocumentsAllQuery, DocumentsAllQueryVariables>;
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
export type NamedEntityKeySpecifier = ('chinese' | 'entityType' | 'start' | 'end' | NamedEntityKeySpecifier)[];
export type NamedEntityFieldPolicy = {
	chinese?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('words' | 'documents' | 'concordanceDocs' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	words?: FieldPolicy<any> | FieldReadFunction<any>,
	documents?: FieldPolicy<any> | FieldReadFunction<any>,
	concordanceDocs?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SentenceKeySpecifier = ('id' | 'words' | 'chinese' | SentenceKeySpecifier)[];
export type SentenceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	words?: FieldPolicy<any> | FieldReadFunction<any>,
	chinese?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SentenceWordKeySpecifier = ('sentenceId' | 'index' | 'id' | 'wordHanzi' | 'lemma' | 'partOfSpeech' | 'universalPartOfSpeech' | 'namedEntity' | 'word' | 'due' | SentenceWordKeySpecifier)[];
export type SentenceWordFieldPolicy = {
	sentenceId?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	wordHanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	lemma?: FieldPolicy<any> | FieldReadFunction<any>,
	partOfSpeech?: FieldPolicy<any> | FieldReadFunction<any>,
	universalPartOfSpeech?: FieldPolicy<any> | FieldReadFunction<any>,
	namedEntity?: FieldPolicy<any> | FieldReadFunction<any>,
	word?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WordKeySpecifier = ('hanzi' | 'hskWord2010' | 'hskChar2010' | 'ccceDefinitions' | WordKeySpecifier)[];
export type WordFieldPolicy = {
	hanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	hskWord2010?: FieldPolicy<any> | FieldReadFunction<any>,
	hskChar2010?: FieldPolicy<any> | FieldReadFunction<any>,
	ccceDefinitions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	CCCEDefinition?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CCCEDefinitionKeySpecifier | (() => undefined | CCCEDefinitionKeySpecifier),
		fields?: CCCEDefinitionFieldPolicy,
	},
	Document?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DocumentKeySpecifier | (() => undefined | DocumentKeySpecifier),
		fields?: DocumentFieldPolicy,
	},
	NamedEntity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NamedEntityKeySpecifier | (() => undefined | NamedEntityKeySpecifier),
		fields?: NamedEntityFieldPolicy,
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
	Word?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WordKeySpecifier | (() => undefined | WordKeySpecifier),
		fields?: WordFieldPolicy,
	}
};