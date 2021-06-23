import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';
import { PostgresqlRepo } from './repository/repo';
import { ConnectionConfig, Pool } from 'pg';

const message = 'Hello world';
console.log(message);
console.log(process.env.TEST);

export interface IContextType {
  test: string;
  dataSources: {
    db: PostgresqlRepo;
  };
}

const connection = {
  host: 'localhost',
  user: 'xavier',
  password: 'localdb-4301',
  database: 'infinite_input',
};

const knexConfig = {
  client: 'pg',
  connection,
  searchPath: ['mandarin'],
};

// the plan is to just use pool.query, which apparently automatically handlers
// releasing the connection etc. spend time to understand these docs better!
const pool = new Pool();
// TODO run pool.end() at appropriate time?

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
  // this argument is called for each request!
  context: async (): Promise<Omit<IContextType, 'dataSources'>> => {
    return { test: 'TEST' };
  },
  dataSources: () => ({ db: new PostgresqlRepo(knexConfig) }),
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
