import { Connection } from 'tiesdb-client';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    const connection = new Connection();
    await connection.connect('wss://beta.tiesdb.com/websocket');

    this.connection = connection;
  }

  async modify(records: Array, pk: string) {
    console.log(123, this.connection.connection.connected);
    const result = await this.connection.modify(records, pk);
    return result;
  }

  async recollect(query: string) {
    console.log(456, this.connection.connection.connected);
    const records = await this.connection.recollect(query);
    return records;
  }

  setConnection(connection) {
    this.connection = connection;
  }
}

export default new Database();
