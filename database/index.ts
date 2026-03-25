import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";
import { InitializeDatabase } from "./database.connection";

export const DB_NAME = "rest-app.db";

export type AppEnvironment = "PRUEBAS" | "PRODUCCION";

let db: SQLite.SQLiteDatabase | null = null;

export function getAppEnvironment(): AppEnvironment {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT as AppEnvironment;
  return env === "PRODUCCION" ? "PRODUCCION" : "PRUEBAS";
}

export function isTestEnvironment(): boolean {
  return getAppEnvironment() === "PRUEBAS";
}

export async function getDbConnection(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
}

export async function closeDbConnection(): Promise<void> {
  const database = await getDbConnection();
  if (database) {
    await database.closeAsync();
    console.log("Database connection closed");
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    if (db) {
      await db.closeAsync();
      db = null;
    }
    await SQLite.deleteDatabaseAsync(DB_NAME);
    console.log("Database deleted successfully");
  } catch (error) {
    console.error("Error deleting database:", error);
  }
}

export async function StartDatabase(database: SQLiteDatabase) {
  const ENVIRONMENT = getAppEnvironment();
  console.log(`Starting database in environment: ${ENVIRONMENT}`);
  
  try {
    if (ENVIRONMENT === "PRUEBAS") {
      console.log("TEST MODE: Dropping and recreating all tables...");
      await resetDatabase();
      const freshDb = await SQLite.openDatabaseAsync(DB_NAME);
      await InitializeDatabase(freshDb);
    } else {
      console.log("PRODUCTION MODE: Preserving existing data...");
      await InitializeDatabase(database);
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
}
