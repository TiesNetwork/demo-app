import express from 'express';

// GraphQL
import createServer from './graphql';

// Get all configs to process.env
require('dotenv').config();

const app = express();
const server = createServer(app);

app.listen(process.env.SERVER_PORT, error => {
  if (error) {
    throw new Error(error);
  }

  // eslint-disable-next-line
  console.log(`🚀 Server ready at http://localhost${server.graphqlPath}`);
});
