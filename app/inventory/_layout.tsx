import { Stack, useLocalSearchParams } from 'expo-router';

export default function InventoryLayout() {
  const {productname} = useLocalSearchParams()
  return <Stack>
    {/* <Stack.Screen name='(tabs)' options={{title:"Inventario"}}/> */}
    <Stack.Screen name='[productname]' options={{title:"Producto de Inventario"+productname}}/>
  </Stack>;
}