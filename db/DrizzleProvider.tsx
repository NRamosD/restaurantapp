// db/DrizzleProvider.tsx
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { DrizzleContext } from './drizzleContext';
import { Text } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export function DrizzleProvider({ children }: { children: React.ReactNode }) {
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite);

  const { success, error } = useMigrations(db, migrations);

  if (error) return <Text>Error en migración: {error.message}</Text>;
  if (!success) return <Text>Cargando...</Text>;

  return (
    <DrizzleContext.Provider value={db}>
      {children}
    </DrizzleContext.Provider>
  );
}