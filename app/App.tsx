import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'
import { router, Stack, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useSQLiteContext } from 'expo-sqlite'
import { getAllProfiles } from '@/database/profile.operations'
import { Perfil } from '@/interfaces'

type Props = {}

const App = ({
    
}: Props) => {
  // const db = useSQLiteContext();
  // const segments = useSegments();

  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       const configData = await db.getAllAsync('SELECT * FROM app_config_data;') as any;
  //       const users = await getAllProfiles(db);
  //       if(configData.length === 0 ||  users.length === 0){
  //         router.dismissTo('/(auth)/login');
  //         return;
  //       }
  //       const userExists = users.find((profile: Perfil) => profile.auth === configData[0]?.current_user);

  //       // Si no hay usuario y no estamos ya en (auth), redirige
  //       console.log(segments[0]);
  //       // const inAuthGroup = segments[0] === '(auth)';

  //       if (!userExists) {
  //         router.dismissTo('/(auth)/login');
  //       } else if (userExists) {
  //         router.dismissTo('/(tabs)');
  //       }
  //     } catch (error) {
  //       console.error('Error verificando usuario:', error);
  //     }
  //   };

  //   checkUser();
  // }, [segments]);


  return (
    <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"  />
        <Stack.Screen name="inventory"  />
        <Stack.Screen name="orders"  />
        <Stack.Screen name="settings"  />
        <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </PaperProvider>
  )
}

export default App