import { get } from 'lodash';
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
    const isConnected = get(this, 'connection.connection.connected');

    !isConnected && (await this.connect());

    const result = await this.connection.modify(records, pk);
    return result;
  }

  async recollect(query: string) {
    const isConnected = get(this, 'connection.connection.connected');

    !isConnected && (await this.connect());

    const records = await this.connection.recollect(query);
    return records;
  }

  setConnection(connection) {
    this.connection = connection;
  }
}

export default new Database();
