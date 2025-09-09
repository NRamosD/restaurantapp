import { SQLiteDatabase } from "expo-sqlite";
import { CreateAllTablesTable } from "./database.connection";

export async function StartDatabase(db:SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    currentDbVersion = 1;
  }
  await CreateAllTablesTable(db)
    // await db.execAsync(`
    //   PRAGMA journal_mode = 'wal';
      
    // `);
    // await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
    // await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
  