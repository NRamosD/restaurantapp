import 'react-native-get-random-values';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, deleteDatabaseAsync } from 'expo-sqlite';
import { DrizzleProvider } from '@/db/DrizzleProvider';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { PaperProvider } from 'react-native-paper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getNavigationTheme, getPaperTheme } from '@/theme';

dayjs.extend(utc);
SplashScreen.preventAutoHideAsync();

const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME ?? 'restaurant';
const IS_DEV = process.env.EXPO_PUBLIC_ENVIRONMENT === 'dev';

const styles = StyleSheet.create({
  container: { flex: 1 },
});

async function resetDatabaseIfDev() {
  if (IS_DEV) {
    console.log('[DEV MODE] Eliminando base de datos...');
    try {
      await deleteDatabaseAsync(`${DATABASE_NAME}.db`);
    } catch (error) {
      console.log('[DEV MODE] Error al eliminar DB:', error);
    }
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbReady, setDbReady] = useState(!IS_DEV);
  const navigationTheme = getNavigationTheme(colorScheme);
  const paperTheme = getPaperTheme(colorScheme);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const init = async () => {
      await resetDatabaseIfDev();
      setDbReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded || !dbReady) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={navigationTheme}>
        <SQLiteProvider databaseName={`${DATABASE_NAME}.db`} useSuspense>
          <Suspense fallback={<ActivityIndicator />}>
            <DrizzleProvider>
              <SafeAreaProvider>
                <MenuProvider>
                  <PaperProvider theme={paperTheme}>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="orders" />
                      <Stack.Screen name="inventory" />
                      <Stack.Screen name="settings" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  </PaperProvider>
                </MenuProvider>
              </SafeAreaProvider>
            </DrizzleProvider>
          </Suspense>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
