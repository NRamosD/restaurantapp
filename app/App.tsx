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
  )
}

export default App