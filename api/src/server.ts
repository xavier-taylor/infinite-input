import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typedefs';
import { resolvers } from './resolvers';

const message = 'Hello world';
console.log(message);
console.log(process.env.TEST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
