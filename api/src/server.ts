import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';
import { PostgresqlRepo } from './repository/repo';
import Knex from 'knex';

export interface IContextType {
  test: string;
  repo: PostgresqlRepo;
}

const connection = {
  host: 'localhost',
  user: 'xavier',
  password: 'localdb-4301',
  database: 'infinite_input',
};

const knexConfig: Knex.Config = {
  client: 'pg',
  connection,
  searchPath: ['mandarin'],
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
  // this argument is called for each request!
  context: async (): Promise<Omit<IContextType, 'dataSources'>> => {
    const knex = Knex(knexConfig); // TODO work out if need to delete/close etc this instance
    return {
      test: 'TEST',
      repo: new PostgresqlRepo(knex),
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
