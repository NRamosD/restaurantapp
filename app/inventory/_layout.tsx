import { Stack, useLocalSearchParams } from 'expo-router';

export default function InventoryLayout() {
  const {productname} = useLocalSearchParams()
  const dProductName = productname?.toString()?.replace(/:/g, '')
  return <Stack>
    {/* <Stack.Screen name='(tabs)' options={{title:"Inventario"}}/> */}
    <Stack.Screen name='[productname]' options={{title:`${dProductName}`}}/>
    <Stack.Screen name='create-product' options={{headerShown:false}}/>
    <Stack.Screen name='top-sellers' options={{ headerShown:false }}/>
  </Stack>;
}