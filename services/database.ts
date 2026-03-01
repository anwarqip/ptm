import * as SQLite from 'expo-sqlite';

export const db: SQLite.SQLiteDatabase = SQLite.openDatabaseSync('ptm_main.db');
