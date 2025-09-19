import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { StartDatabase } from '@/database/index';
import App from './App';
import { Text } from 'react-native';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      console.log("Deleting database...");
      await SQLite.deleteDatabaseAsync("rest-app.db");
    })();
  }, []);

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
      <Suspense fallback={<Text>Loading...</Text>}>
        <SQLiteProvider databaseName="rest-app.db" onInit={StartDatabase} useSuspense={true}>
          <App/>
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}

