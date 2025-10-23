
import * as SQLite from 'expo-sqlite';

export async function initDB() {
  return await SQLite.openDatabaseAsync('rest-app.db');
}
