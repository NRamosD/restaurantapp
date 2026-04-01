import 'react-native-get-random-values';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider, deleteDatabaseAsync } from 'expo-sqlite';
import { DrizzleProvider } from '@/db/DrizzleProvider';
import { KeyboardAvoidingView, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAuthStore } from '@/hooks/useAuthStore';
import AuthLayout from './(auth)/_layout';
import App from './App';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { PaperProvider } from 'react-native-paper';

dayjs.extend(utc);
SplashScreen.preventAutoHideAsync();

const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME ?? 'restaurant';
const IS_DEV = process.env.EXPO_PUBLIC_ENVIRONMENT === 'dev';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function resetDatabaseIfDev() {
  if (IS_DEV) {
    console.log('[DEV MODE] Eliminando base de datos para reiniciar migraciones...');
    try {
      await deleteDatabaseAsync(`${DATABASE_NAME}.db`);
      console.log('[DEV MODE] Base de datos eliminada exitosamente');
    } catch (error) {
      console.log('[DEV MODE] No se pudo eliminar la base de datos:', error);
    }
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const token = useAuthStore((s) => s.token);
  const [dbReady, setDbReady] = useState(!IS_DEV);

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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SQLiteProvider
          databaseName={`${DATABASE_NAME}.db`}
          useSuspense
        >
          <Suspense fallback={<ActivityIndicator />}>
            <DrizzleProvider>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
              >
                <SafeAreaProvider>
                  <MenuProvider>
                    <PaperProvider>
                      {token ? <App /> : <AuthLayout />}
                    </PaperProvider>
                  </MenuProvider>
                </SafeAreaProvider>
              </KeyboardAvoidingView>
            </DrizzleProvider>
          </Suspense>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}