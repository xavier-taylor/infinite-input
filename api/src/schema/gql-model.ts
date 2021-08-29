import { GraphQLResolveInfo } from 'graphql';
import { document, sentence, sentence_word, word, cc_cedict } from '../repository/sql-model';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  Recognition = 'recognition',
  Reading = 'reading',
  Learned = 'learned'
}

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
  concordanceDocs: Array<Document>;
  document: Document;
  due: Due;
  sentenceWord?: Maybe<SentenceWord>;
  words: Array<Word>;
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


export type QuerySentenceWordArgs = {
  sentenceId: Scalars['String'];
  stanzaId: Scalars['Int'];
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
};

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

export type Word = {
  __typename?: 'Word';
  ccceDefinitions: Array<CcceDefinition>;
  forgotLISTEN?: Maybe<Scalars['Boolean']>;
  forgotREAD?: Maybe<Scalars['Boolean']>;
  hanzi: Scalars['String'];
  hskChar2010: Scalars['Int'];
  hskWord2010: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CCCEDefinition: ResolverTypeWrapper<cc_cedict>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Document: ResolverTypeWrapper<document>;
  DocumentStudyPayload: DocumentStudyPayload;
  DocumentStudyResponse: ResolverTypeWrapper<DocumentStudyResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Due: ResolverTypeWrapper<Omit<Due, 'documents' | 'orphans'> & { documents: Array<ResolversTypes['Document']>, orphans: Array<ResolversTypes['Word']> }>;
  LearningState: LearningState;
  Mutation: ResolverTypeWrapper<{}>;
  NamedEntity: ResolverTypeWrapper<NamedEntity>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  Sentence: ResolverTypeWrapper<sentence>;
  SentenceWord: ResolverTypeWrapper<sentence_word>;
  StudentWord: ResolverTypeWrapper<Omit<StudentWord, 'word'> & { word: ResolversTypes['Word'] }>;
  StudyState: ResolverTypeWrapper<Omit<StudyState, 'word'> & { word: ResolversTypes['Word'] }>;
  StudyType: StudyType;
  Word: ResolverTypeWrapper<word>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CCCEDefinition: cc_cedict;
  String: Scalars['String'];
  Document: document;
  DocumentStudyPayload: DocumentStudyPayload;
  DocumentStudyResponse: DocumentStudyResponse;
  Boolean: Scalars['Boolean'];
  Due: Omit<Due, 'documents' | 'orphans'> & { documents: Array<ResolversParentTypes['Document']>, orphans: Array<ResolversParentTypes['Word']> };
  Mutation: {};
  NamedEntity: NamedEntity;
  Int: Scalars['Int'];
  Query: {};
  Sentence: sentence;
  SentenceWord: sentence_word;
  StudentWord: Omit<StudentWord, 'word'> & { word: ResolversParentTypes['Word'] };
  StudyState: Omit<StudyState, 'word'> & { word: ResolversParentTypes['Word'] };
  Word: word;
};

export type CcceDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CCCEDefinition'] = ResolversParentTypes['CCCEDefinition']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  simplified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traditional?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pinyin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  definitions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sentences?: Resolver<Array<ResolversTypes['Sentence']>, ParentType, ContextType>;
  english?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chinese?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentStudyResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentStudyResponse'] = ResolversParentTypes['DocumentStudyResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DueResolvers<ContextType = any, ParentType extends ResolversParentTypes['Due'] = ResolversParentTypes['Due']> = {
  documents?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  orphans?: Resolver<Array<ResolversTypes['Word']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  documentStudy?: Resolver<ResolversTypes['DocumentStudyResponse'], ParentType, ContextType, RequireFields<MutationDocumentStudyArgs, 'studyType' | 'payload'>>;
};

export type NamedEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NamedEntity'] = ResolversParentTypes['NamedEntity']> = {
  chinese?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  concordanceDocs?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryConcordanceDocsArgs, 'word'>>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  due?: Resolver<ResolversTypes['Due'], ParentType, ContextType, RequireFields<QueryDueArgs, 'studyType'>>;
  sentenceWord?: Resolver<Maybe<ResolversTypes['SentenceWord']>, ParentType, ContextType, RequireFields<QuerySentenceWordArgs, 'sentenceId' | 'stanzaId'>>;
  words?: Resolver<Array<ResolversTypes['Word']>, ParentType, ContextType, RequireFields<QueryWordsArgs, 'words'>>;
};

export type SentenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sentence'] = ResolversParentTypes['Sentence']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  words?: Resolver<Array<ResolversTypes['SentenceWord']>, ParentType, ContextType>;
  chinese?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SentenceWordResolvers<ContextType = any, ParentType extends ResolversParentTypes['SentenceWord'] = ResolversParentTypes['SentenceWord']> = {
  due?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  forgotLISTEN?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  forgotREAD?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastClicked?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lemma?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namedEntity?: Resolver<Maybe<ResolversTypes['NamedEntity']>, ParentType, ContextType>;
  partOfSpeech?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sentenceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stanzaId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  universalPartOfSpeech?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  word?: Resolver<ResolversTypes['Word'], ParentType, ContextType>;
  wordHanzi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StudentWordResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentWord'] = ResolversParentTypes['StudentWord']> = {
  hanzi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  dateLastUnlocked?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateLearned?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  learning?: Resolver<ResolversTypes['LearningState'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  word?: Resolver<ResolversTypes['Word'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StudyStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudyState'] = ResolversParentTypes['StudyState']> = {
  hanzi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  f1?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  f2?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  due?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previous?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  understood?: Resolver<Array<ResolversTypes['Boolean']>, ParentType, ContextType>;
  understoodCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  underStoodDistinct?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  word?: Resolver<ResolversTypes['Word'], ParentType, ContextType>;
  studyType?: Resolver<ResolversTypes['StudyType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']> = {
  ccceDefinitions?: Resolver<Array<ResolversTypes['CCCEDefinition']>, ParentType, ContextType>;
  forgotLISTEN?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  forgotREAD?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hanzi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hskChar2010?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hskWord2010?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CCCEDefinition?: CcceDefinitionResolvers<ContextType>;
  Document?: DocumentResolvers<ContextType>;
  DocumentStudyResponse?: DocumentStudyResponseResolvers<ContextType>;
  Due?: DueResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NamedEntity?: NamedEntityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Sentence?: SentenceResolvers<ContextType>;
  SentenceWord?: SentenceWordResolvers<ContextType>;
  StudentWord?: StudentWordResolvers<ContextType>;
  StudyState?: StudyStateResolvers<ContextType>;
  Word?: WordResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
