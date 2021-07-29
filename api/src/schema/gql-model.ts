import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { document, sentence, sentence_word, word, cc_cedict } from '../repository/sql-model';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  documentsDue: Array<Document>;
  document: Document;
  concordanceDocs: Array<Document>;
};


export type QueryWordsArgs = {
  words: Array<Scalars['String']>;
};


export type QueryDocumentsDueArgs = {
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
  Listen = 'LISTEN',
  ListenHuman = 'LISTEN_HUMAN'
}


export type Word = {
  __typename?: 'Word';
  hanzi: Scalars['String'];
  hskWord2010: Scalars['Int'];
  hskChar2010: Scalars['Int'];
  ccceDefinitions: Array<CcceDefinition>;
  readStudy?: Maybe<StudyState>;
  listenStudy?: Maybe<StudyState>;
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
  CacheControlScope: CacheControlScope;
  Document: ResolverTypeWrapper<document>;
  NamedEntity: ResolverTypeWrapper<NamedEntity>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  Sentence: ResolverTypeWrapper<sentence>;
  SentenceWord: ResolverTypeWrapper<sentence_word>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  StudyState: ResolverTypeWrapper<StudyState>;
  StudyType: StudyType;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Word: ResolverTypeWrapper<word>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CCCEDefinition: cc_cedict;
  String: Scalars['String'];
  Document: document;
  NamedEntity: NamedEntity;
  Int: Scalars['Int'];
  Query: {};
  Sentence: sentence;
  SentenceWord: sentence_word;
  Boolean: Scalars['Boolean'];
  StudyState: StudyState;
  Upload: Scalars['Upload'];
  Word: word;
};

export type CacheControlDirectiveArgs = {   maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>; };

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

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

export type NamedEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NamedEntity'] = ResolversParentTypes['NamedEntity']> = {
  chinese?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  words?: Resolver<Array<ResolversTypes['Word']>, ParentType, ContextType, RequireFields<QueryWordsArgs, 'words'>>;
  documentsDue?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryDocumentsDueArgs, 'studyType'>>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  concordanceDocs?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryConcordanceDocsArgs, 'word'>>;
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

export type StudyStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudyState'] = ResolversParentTypes['StudyState']> = {
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  learningIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  f1?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  f2?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  due?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previous?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  understood?: Resolver<Array<ResolversTypes['Boolean']>, ParentType, ContextType>;
  understoodCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  underStoodDistinct?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type WordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']> = {
  hanzi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hskWord2010?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hskChar2010?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ccceDefinitions?: Resolver<Array<ResolversTypes['CCCEDefinition']>, ParentType, ContextType>;
  readStudy?: Resolver<Maybe<ResolversTypes['StudyState']>, ParentType, ContextType>;
  listenStudy?: Resolver<Maybe<ResolversTypes['StudyState']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CCCEDefinition?: CcceDefinitionResolvers<ContextType>;
  Document?: DocumentResolvers<ContextType>;
  NamedEntity?: NamedEntityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Sentence?: SentenceResolvers<ContextType>;
  SentenceWord?: SentenceWordResolvers<ContextType>;
  StudyState?: StudyStateResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  Word?: WordResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;