import { IContextType } from '../server';
import { Resolvers } from '../schema/gql-model';

export const resolvers: Resolvers<IContextType> = {
  /*
  

  */
  Document: {
    chinese: (p, a, c, i) => p.chinese,
  },
  Query: {
    // TODO - the query from the front end does *not* pass in the user id!
    // that would be abusable. instead, here at the backend we have some kind of auth thingo whichi gives
    // use the user id
    documents: (_parent, _args, context, _info) => context.repo.getDocuments(),
  },
};
