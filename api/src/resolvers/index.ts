import { IContextType } from '../server';
import { Resolvers } from '../schema/gql-model';

export const resolvers: Resolvers<IContextType> = {
  Query: {
    documents: (_parent, _args, context, _info) => context.repo.getDocuments(),
  },
};
