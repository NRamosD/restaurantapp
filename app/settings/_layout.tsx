import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return <Stack>
    <Stack.Screen name='index' options={{
      animation:"slide_from_right",
      headerShown:false
    }}/>
    <Stack.Screen name='checkout' options={{
      animation:"slide_from_right",
      headerShown:false
    }}/>
    <Stack.Screen name='final-status-checkout' options={{
      animation:"slide_from_bottom",
      headerShown:false
    }}/>
  </Stack>;
}