import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='create-order' options={{
      animation:"slide_from_right",
    }}/>
    <Stack.Screen name='checkout' options={{
      animation:"slide_from_right",
    }}/>
    <Stack.Screen name='final-status-checkout' options={{
      animation:"slide_from_bottom",
    }}/>
  </Stack>;
}