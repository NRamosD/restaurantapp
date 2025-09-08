import { SQLiteDatabase } from "expo-sqlite";
import { CreateAllTablesTable } from "./database.connection";

export async function StartDatabase(db:SQLiteDatabase) {
  await CreateAllTablesTable(db)
  // const DATABASE_VERSION = 1;
  // let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
  //   'PRAGMA user_version'
  // );
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   return;
  // }
  // if (currentDbVersion === 0) {
  //   await db.execAsync(`
  //     PRAGMA journal_mode = 'wal';
  //     CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
  //   `);
  //   await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
  //   await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
  //   currentDbVersion = 1;
  // }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  // await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
  