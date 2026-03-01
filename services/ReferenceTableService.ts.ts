import { db } from './database';

export const ReferenceTableService = {

  async createTables() {
    console.log("Table Creation called!")
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS parking_type (
        id INTEGER PRIMARY KEY,
        code TEXT,
        name TEXT NOT NULL,
        updatedAt INTEGER
      );

      CREATE TABLE IF NOT EXISTS vehicle_type (
        id INTEGER PRIMARY KEY,
        code TEXT,
        name TEXT NOT NULL,
        updatedAt INTEGER
      );

      CREATE TABLE IF NOT EXISTS gender (
        id INTEGER PRIMARY KEY,
        code TEXT,
        name TEXT NOT NULL,
        updatedAt INTEGER
      );
    `);
  }

};
