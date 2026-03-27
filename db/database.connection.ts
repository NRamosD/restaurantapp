import * as SQLite from "expo-sqlite";
import { isTestEnvironment } from "./index";
import { SQL_SCHEMA } from "./app.sql";

export const InitializeDatabase = async (dbConnection: SQLite.SQLiteDatabase) => {
  console.log("Initializing database...");
  
  try {
    const tables = await dbConnection.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );

    const isTest = isTestEnvironment();
    
    if (tables.length === 0) {
      console.log("No tables found. Creating schema...");
      await executeSqlScript(dbConnection, SQL_SCHEMA);
    } else if (isTest) {
      console.log("TEST MODE: Recreating all tables...");
      await dropAllTables(dbConnection);
      await executeSqlScript(dbConnection, SQL_SCHEMA);
    } else {
      console.log("PRODUCTION MODE: Tables already exist, skipping creation.");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

async function executeSqlScript(db: SQLite.SQLiteDatabase, sqlScript: string): Promise<void> {
  const statements = sqlScript
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

  for (const statement of statements) {
    try {
      await db.execSync(statement);
    } catch (error) {
      console.error("Error executing SQL:", statement.substring(0, 100), error);
    }
  }
}

async function dropAllTables(db: SQLite.SQLiteDatabase): Promise<void> {
  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  );

  await db.execSync("PRAGMA foreign_keys = OFF;");
  
  for (const table of tables) {
    await db.execSync(`DROP TABLE IF EXISTS ${table.name};`);
  }
  
  await db.execSync("PRAGMA foreign_keys = ON;");
}