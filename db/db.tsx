import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from './schema';

export { schema };

export type DrizzleDb = ExpoSQLiteDatabase<typeof schema>;

export function useDrizzle(): DrizzleDb {
  const sqliteDb = useSQLiteContext();
  return drizzle(sqliteDb, { schema });
}
