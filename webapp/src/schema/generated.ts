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

export type DocumentStudyResponse = {
  __typename?: 'DocumentStudyResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type Due = {
  __typename?: 'Due';
  documents: Array<Document>;
  orphans: Array<Word>;
};

export type Mutation = {
  __typename?: 'Mutation';
  documentStudy: DocumentStudyResponse;
};


export type MutationDocumentStudyArgs = {
  studyType: StudyType;
  payload: DocumentStudyPayload;
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
  due: Due;
  document: Document;
  concordanceDocs: Array<Document>;
};


export type QueryWordsArgs = {
  words: Array<Scalars['String']>;
};


export type QueryDueArgs = {
  studyType: StudyType;
};


export type QueryDocumentArgs = {
  id: Scalars['String'];
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

export type StudyState = {
  __typename?: 'StudyState';
  locked: Scalars['Boolean'];
  learningIndex: Scalars['Int'];
  f1: Scalars['Int'];
  f2: Scalars['Int'];
  due: Scalars['String'];
  previous: Scalars['String'];
  understood: Array<Scalars['Boolean']>;
  understoodCount: Scalars['Int'];
  underStoodDistinct: Scalars['Int'];
};

export enum StudyType {
  Read = 'READ',
  Listen = 'LISTEN'
}

export type Word = {
  __typename?: 'Word';
  ccceDefinitions: Array<CcceDefinition>;
  forgotLISTEN?: Maybe<Scalars['Boolean']>;
  forgotREAD?: Maybe<Scalars['Boolean']>;
  hanzi: Scalars['String'];
  hskChar2010: Scalars['Int'];
  hskWord2010: Scalars['Int'];
  listenStudy?: Maybe<StudyState>;
  readStudy?: Maybe<StudyState>;
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

export const EntireDocumentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EntireDocument"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"stanzaId"}},{"kind":"Field","name":{"kind":"Name","value":"lastClicked"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"forgotLISTEN"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"forgotREAD"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"lemma"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"namedEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chinese"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}},{"kind":"Field","name":{"kind":"Name","value":"hskWord2010"}},{"kind":"Field","name":{"kind":"Name","value":"hskChar2010"}},{"kind":"Field","name":{"kind":"Name","value":"ccceDefinitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"simplified"}},{"kind":"Field","name":{"kind":"Name","value":"traditional"}},{"kind":"Field","name":{"kind":"Name","value":"pinyin"}},{"kind":"Field","name":{"kind":"Name","value":"definitions"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<EntireDocumentFragment, unknown>;
export const ConcordanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Concordance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concordanceDocs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"english"}},{"kind":"Field","name":{"kind":"Name","value":"sentences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastClicked"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"sentenceId"}},{"kind":"Field","name":{"kind":"Name","value":"stanzaId"}},{"kind":"Field","name":{"kind":"Name","value":"wordHanzi"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"universalPartOfSpeech"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConcordanceQuery, ConcordanceQueryVariables>;
export const DueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Due"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudyType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"due"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studyType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studyType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EntireDocument"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orphans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hanzi"}}]}}]}}]}},...EntireDocumentFragmentDoc.definitions]} as unknown as DocumentNode<DueQuery, DueQueryVariables>;
export const DocumentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EntireDocument"}}]}}]}},...EntireDocumentFragmentDoc.definitions]} as unknown as DocumentNode<DocumentByIdQuery, DocumentByIdQueryVariables>;
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
export type MutationKeySpecifier = ('documentStudy' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	documentStudy?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NamedEntityKeySpecifier = ('chinese' | 'entityType' | 'start' | 'end' | NamedEntityKeySpecifier)[];
export type NamedEntityFieldPolicy = {
	chinese?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('words' | 'due' | 'document' | 'concordanceDocs' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	words?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>,
	document?: FieldPolicy<any> | FieldReadFunction<any>,
	concordanceDocs?: FieldPolicy<any> | FieldReadFunction<any>
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
export type StudyStateKeySpecifier = ('locked' | 'learningIndex' | 'f1' | 'f2' | 'due' | 'previous' | 'understood' | 'understoodCount' | 'underStoodDistinct' | StudyStateKeySpecifier)[];
export type StudyStateFieldPolicy = {
	locked?: FieldPolicy<any> | FieldReadFunction<any>,
	learningIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	f1?: FieldPolicy<any> | FieldReadFunction<any>,
	f2?: FieldPolicy<any> | FieldReadFunction<any>,
	due?: FieldPolicy<any> | FieldReadFunction<any>,
	previous?: FieldPolicy<any> | FieldReadFunction<any>,
	understood?: FieldPolicy<any> | FieldReadFunction<any>,
	understoodCount?: FieldPolicy<any> | FieldReadFunction<any>,
	underStoodDistinct?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WordKeySpecifier = ('ccceDefinitions' | 'forgotLISTEN' | 'forgotREAD' | 'hanzi' | 'hskChar2010' | 'hskWord2010' | 'listenStudy' | 'readStudy' | WordKeySpecifier)[];
export type WordFieldPolicy = {
	ccceDefinitions?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotLISTEN?: FieldPolicy<any> | FieldReadFunction<any>,
	forgotREAD?: FieldPolicy<any> | FieldReadFunction<any>,
	hanzi?: FieldPolicy<any> | FieldReadFunction<any>,
	hskChar2010?: FieldPolicy<any> | FieldReadFunction<any>,
	hskWord2010?: FieldPolicy<any> | FieldReadFunction<any>,
	listenStudy?: FieldPolicy<any> | FieldReadFunction<any>,
	readStudy?: FieldPolicy<any> | FieldReadFunction<any>
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
	StudyState?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StudyStateKeySpecifier | (() => undefined | StudyStateKeySpecifier),
		fields?: StudyStateFieldPolicy,
	},
	Word?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WordKeySpecifier | (() => undefined | WordKeySpecifier),
		fields?: WordFieldPolicy,
	}
};