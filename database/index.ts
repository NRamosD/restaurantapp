import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";
import { InitializeDatabase } from "./database.connection";

export const DB_NAME = "rest-app.db";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDbConnection(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("rest-app.db");
  }
  return db;
}

export async function closeDbConnection(): Promise<void> {
  const db = await getDbConnection();
  if (db) {
    await db.closeAsync();
    // db = null;
    console.log("Database connection closed");
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    await closeDbConnection(); // asegúrate de cerrar antes
    await SQLite.deleteDatabaseAsync(DB_NAME);
    console.log("Database deleted successfully");
  } catch (error) {
    console.error("Error deleting database:", error);
  }
}

export async function StartDatabase(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  
  try {
    // await closeDbConnection();
    // await resetDatabase();

    // await InitializeDatabase(db);


  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Re-throw to be caught by Suspense boundary
  }
}
