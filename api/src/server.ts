import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';
import { PostgresqlRepo, ILanguageRepository } from './repository';

const message = 'Hello world';
console.log(message);
console.log(process.env.TEST);

export interface IContextType {
  repo: ILanguageRepository;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (): Promise<IContextType> => {
    const repo = new PostgresqlRepo();
    return {
      repo,
    };
  },
});
// note context can be async so can connect to db etc
// context: async ({req}) => ({
//   db: await client.connect(),
//   authScope: getScope(req.headers.authorization),
// })
// see also https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
