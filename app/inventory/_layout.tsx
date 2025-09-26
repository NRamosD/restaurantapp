import { Colors } from '@/constants/Colors';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function InventoryLayout() {
  const {productname} = useLocalSearchParams()
  const dProductName = productname?.toString()?.replace(/:/g, '')
  const color = useColorScheme()
  return <Stack>
    {/* <Stack.Screen name='(tabs)' options={{title:"Inventario"}}/> */}
    <Stack.Screen name='[productname]' options={{headerShadowVisible:false, headerTitle:"Regresar", 
      headerStyle:{backgroundColor:Colors[color ?? 'light'].tint,},
      headerTitleStyle:{color:Colors[color ?? 'light'].text},
    }}/>
    <Stack.Screen name='create-product' options={{headerShown:false}}/>
    <Stack.Screen name='top-sellers' options={{ headerShown:false }}/>
  </Stack>;
}