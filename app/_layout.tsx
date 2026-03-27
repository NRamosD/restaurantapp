import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect } from 'react';
// import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { DrizzleProvider } from '@/db/DrizzleProvider';
import { KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const token = useAuthStore((s) => s.token);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* ✅ SQLiteProvider inicializa SQLite de forma segura antes que cualquier hijo */}
      <SQLiteProvider
        databaseName={`${DATABASE_NAME}.db`}
        useSuspense
      >
        {/* ✅ DrizzleProvider puede usar useSQLiteContext de forma segura aquí */}
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
  );
}