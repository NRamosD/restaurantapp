import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { CreateDishesTable } from '@/database/database.connection';
import { PaperProvider } from 'react-native-paper';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
        {/* <Stack/> */}
        <SafeAreaProvider>
          <MenuProvider>
            <PaperProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="inventory" options={{ headerShown: false }} />
                <Stack.Screen name="orders" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </PaperProvider>
          </MenuProvider>

        </SafeAreaProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}







async function migrateDbIfNeeded(db:SQLiteDatabase) {
  await CreateDishesTable(db)
  // const DATABASE_VERSION = 1;
  // let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
  //   'PRAGMA user_version'
  // );
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   return;
  // }
  // if (currentDbVersion === 0) {
  //   await db.execAsync(`
  //     PRAGMA journal_mode = 'wal';
  //     CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
  //   `);
  //   await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
  //   await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
  //   currentDbVersion = 1;
  // }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  // await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
