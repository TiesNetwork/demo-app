import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import Express from 'express';
import { applyMiddleware } from 'graphql-middleware';

// GraphQL
// import createContext from './context';
// import schemaDirectives, { typeDefs as schemaDirectivesTypeDefs } from './directives';
import { validationMiddleware } from './middlewares';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const createServer: Function = (app: Express): ApolloServer => {
  // Create schema
  const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
  });

  // Apply schema with middleware
  const schemaWithMiddleware = applyMiddleware(schema, validationMiddleware);

  // Create Apollo Server 2.0
  const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema: schemaWithMiddleware,
  });

  // Concat express app and other middlewares
  server.applyMiddleware({ app });

  return server;
};

export default createServer;
