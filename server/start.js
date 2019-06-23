import { Connection } from 'tiesdb-client';
import express from 'express';

import DB from './database';

// GraphQL
import createServer from './graphql';

// Get all configs to process.env
require('dotenv').config();

const app = express();
const server = createServer(app);

// wss://alpha.tiesdb.com/websocket

app.listen(process.env.SERVER_PORT, async error => {
  if (error) {
    throw new Error(error);
  }

  const connection = new Connection();
  await connection.connect('wss://beta.tiesdb.com/websocket');

  DB.connect();

  // eslint-disable-next-line
  console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`);
});

// var Client = require('tiesdb-client');

// var Connection = Client.Connection;

// let record = new Record('client-dev.test', 'all_types');
//     let uuid = uuidv4();
//     record.putFields({
//         Id: uuid,
//         fBinary: new Buffer("e0a61e5ad74f", 'hex'),
//         fBoolean: false,
//         fDecimal: new bigdecimal.BigDecimal("-1.235e-8"),
//         fDouble: 158.234e200,
//         fDuration: 20*86400,
//         fFloat: -42803.234e-8,
//         fInteger: 423424432,
// //        fLong: -278374928374,
//         fString: "This is UTF-8 строка",
// //        fTime: new Date()
//     }, types);

//     //0xe0a61e5ad74fc154927e8412c7f03528134f755e7eb45554eb7a99c2744ac34e
//     //0xAe65bAf610Bad3F0d71Aa3C3a8110c2d62cbEb19

//     let c = new Connection();
//     await c.connect('ws://127.0.0.1:8081/websocket');

// let response = await c.modify([record], Buffer.from('e0a61e5ad74fc154927e8412c7f03528134f755e7eb45554eb7a99c2744ac34e', 'hex'));

//     // let records = await c.recollect(
//     //     `SELECT
//     //         -- *
//     //         Id,
//     //         fLong
//     //         -- Id,
//     //          -- CAST(fDuration as duration),
//     //         -- CAST(writeTime(/*fsdf*/fTime) as date)::time as wtime,
//     //         --CAST(writeTime(fTime) AS date)

//     //         -- bigIntAsBlob(toUnixTimestamp(CAST(writeTime(fTime) AS date))) AS WriteTime,
//     //         -- intAsBlob(0x309) AS TestValue
//     //     FROM "client-dev.test"."all_types"
//     //     WHERE
//     //         Id IN (${uuid.toString()})`
//     // );

//     records[0].putValue("fLong", "123", types.fLong);

//     response = await c.modify(records, Buffer.from('e0a61e5ad74fc154927e8412c7f03528134f755e7eb45554eb7a99c2744ac34e', 'hex'));

//     console.log(util.inspect(response, {showHidden: false, depth: null}));
