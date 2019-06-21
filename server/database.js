class Database {
  constructor() {
    this.connection = null;
  }

  async modify(records: Array, pk: string) {
    const result = await this.connection.modify(records, pk);
    return result;
  }

  async recollect(query: string) {
    const records = await this.connection.recollect(query);
    return records;
  }

  setConnection(connection) {
    this.connection = connection;
  }
}

export default new Database();
