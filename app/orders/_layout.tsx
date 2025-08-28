import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return <Stack>
    <Stack.Screen name='create-order' options={{
      animation:"fade_from_bottom",
      headerShown:false
    }}/>
    <Stack.Screen name='checkout' options={{
      animation:"slide_from_right",
      headerShown:false
    }}/>
  </Stack>;
}