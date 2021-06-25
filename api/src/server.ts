import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';
import { PostgresqlRepo } from './repository/repo';
import Knex from 'knex';
import DataLoader from 'dataloader';
import { cc_cedict } from './repository/sql-model';

// CONTINUE HERE
// for some reason, the dataloader batching isnt working - even when I passed it in from here.
// weak hypothesis - if I get rid of the datasource stuff it will start working.

const batch = async (
  hanzis: Readonly<string[]>,
  knex: Knex
): Promise<Array<cc_cedict[]>> => {
  // because each chineseword can have multiple cc_cedict entrys, the return value is an array of arrays
  // can either have the sequel query return a flat list of cc_cedict boiz, and map them myself?
  // or could have the sql query return it in [[cc_cedict]]. even better if it could return
  // a map?

  // this is the most naive approach and requires some logic here in the code
  // TODO improve this so that more of that logic takes place in sql?

  const defs = await knex
    .select<cc_cedict[]>('*')
    .from('cc_cedict')
    .whereIn('simplified', hanzis);
  const map: Record<string, cc_cedict[]> = defs.reduce((acc, cur) => {
    if (acc[cur.simplified]) {
      acc[cur.simplified].push(cur);
    } else {
      acc[cur.simplified] = [cur];
    }
    return acc;
  }, {} as Record<string, cc_cedict[]>);
  return hanzis.map((h) => map[h] ?? []);
};

export interface IContextType {
  test: string;

  db: Knex;
  dataLoaders: {
    ccceLoader: DataLoader<string, cc_cedict[]>;
  };
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
    const db = Knex(knexConfig); // TODO work out if need to delete/close etc this instance
    return {
      test: 'TEST',
      db,
      dataLoaders: {
        ccceLoader: new DataLoader((
          keys: Readonly<string[]> // TODO obviously move the dataloader stuff somewhere
        ) => batch(keys, db)),
      },
    };
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
