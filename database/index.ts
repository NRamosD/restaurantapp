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


export async function StartDatabase(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  
  try {
    // Get current database version
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = result?.user_version ?? 0;
    
    console.log(`Current DB version: ${currentDbVersion}, Target version: ${DATABASE_VERSION}`);
    
    // Only initialize if needed
    if (currentDbVersion <= DATABASE_VERSION) {
      console.log('Initializing database...');
      await InitializeDatabase(db);
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
      console.log('Database initialized successfully');
    } else {
      console.log('Database is up to date');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Re-throw to be caught by Suspense boundary
  }
}
