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
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAuthStore } from '@/hooks/useAuthStore';
import AuthLayout from './(auth)/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { PaperProvider } from 'react-native-paper';

dayjs.extend(utc);


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const token = useAuthStore((s) => s.token);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Habilitar cuando se añadan nuevos cambios en BD
  // useEffect(() => {
  //   (async () => {
      // console.log("Deleting database...");
      // await SQLite.deleteDatabaseAsync("rest-app.db");
  //   })();
  // }, []);

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
          <KeyboardAvoidingView style={{flex:1}} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            <SafeAreaProvider>
            <MenuProvider>
            <PaperProvider>
            {token ? <App/> : 
              <AuthLayout/>
              // <LoginScreen/>
            }
            </PaperProvider>
            </MenuProvider>
            </SafeAreaProvider>
          </KeyboardAvoidingView>
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}

