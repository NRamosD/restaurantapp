import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

type Props = {}

const App = ({
    
}: Props) => {
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