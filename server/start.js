import 'babel-polyfill';
import { Connection } from 'tiesdb-client';
import express from 'express';

import DB from './database';

// GraphQL
import createServer from './graphql';

// Get all configs to process.env
require('dotenv').config();

const app = express();
const server = createServer(app);

app.listen(3001, async error => {
  if (error) {
    throw new Error(error);
  }

  const connection = new Connection();
  await connection.connect('wss://beta.tiesdb.com/websocket');

  DB.connect();

  // eslint-disable-next-line
  console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`);
});
