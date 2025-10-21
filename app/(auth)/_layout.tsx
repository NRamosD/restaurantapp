import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown:false }}>
        <Stack.Screen name='login' options={{ headerShown:false }}/>
        <Stack.Screen name='profile' options={{ headerShown:false }}/>
        <Stack.Screen name='register' options={{ headerShown:false }}/>
      </Stack>
    </SafeAreaProvider>
  );
}