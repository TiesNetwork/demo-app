import { ApolloServer } from 'apollo-server-express';
import Express from 'express';

// GraphQL
// import createContext from './context';
// import schemaDirectives, { typeDefs as schemaDirectivesTypeDefs } from './directives';
// import middleware from './middleware';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const createServer: Function = (app: Express): ApolloServer => {
  const server = new ApolloServer({
    resolvers, typeDefs,
    introspection: true,
    playground: true,
  });

  // Concat express app and other middlewares
  server.applyMiddleware({ app });

  return server;
};

export default createServer;
