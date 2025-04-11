import { Stack, useLocalSearchParams } from 'expo-router';

export default function InventoryLayout() {
  const {nameproduct} = useLocalSearchParams()
  return <Stack>
    <Stack.Screen name='(tabs)' options={{title:"Inventario"}}/>
    <Stack.Screen name='[nameproduct]' options={{title:"Producto de Inventario"+nameproduct}}/>
  </Stack>;
}