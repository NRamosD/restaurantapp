import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";
import { InitializeDatabase } from "./database.connection";


let db: SQLite.SQLiteDatabase | null = null;

export async function getDbConnection(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("rest-app.db");
  }
  return db;
}


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
  const resultInitializeDatabase = await InitializeDatabase(db)
  console.log(resultInitializeDatabase)
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
  
