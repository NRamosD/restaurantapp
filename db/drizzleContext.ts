import { createContext, useContext } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';

type DrizzleDB = ReturnType<typeof drizzle>;

export const DrizzleContext = createContext<DrizzleDB | null>(null);

export function useDrizzle() {
    const db = useContext(DrizzleContext);
    if (!db) throw new Error('useDrizzle debe usarse dentro de DrizzleProvider');
    return db;
}