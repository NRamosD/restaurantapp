// db/DrizzleProvider.tsx
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { DrizzleContext } from './drizzleContext';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as schema from '@/db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { seedDatabaseIfNeeded } from '@/db/runtimeSeed';

export function DrizzleProvider({ children }: { children: React.ReactNode }) {
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite, { schema });
  const [seedReady, setSeedReady] = useState(false);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    console.log('[DRIZZLE] Estado de migraciones', {
      success,
      hasError: Boolean(error),
      errorMessage: error?.message,
    });
  }, [error, success]);

  useEffect(() => {
    let isMounted = true;

    const runSeed = async () => {
      if (!success || error) return;

      try {
        await seedDatabaseIfNeeded(db);
        if (isMounted) setSeedReady(true);
      } catch (seedError) {
        console.log('[DRIZZLE] Error en seed runtime', seedError);
      }
    };

    runSeed();

    return () => {
      isMounted = false;
    };
  }, [db, error, success]);

  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>Error en migración: {error.message}</Text></View>;
  if (!success) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Cargando...</Text></View>;
  if (!seedReady) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Preparando datos iniciales...</Text></View>;

  console.log('[DRIZZLE] Migraciones aplicadas correctamente');

  return (
    <DrizzleContext.Provider value={db}>
      {children}
    </DrizzleContext.Provider>
  );
}