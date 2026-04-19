import { getColors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function InventoryLayout() {
  const color = useColorScheme()
  return <Stack>
    <Stack.Screen name='[uuidProducto]' 
      options={{
        headerShown: false,
      }}
      // options={{headerShadowVisible:false, headerTitle:"Regresar", 
      //   headerStyle:{backgroundColor:getColors(color).tint,},
      //   headerTitleStyle:{color:getColors(color).text},
      // }}
    />
    <Stack.Screen name='create-product' options={{headerShown:false}}/>
    <Stack.Screen name='top-sellers' options={{ headerShown:false }}/>
  </Stack>;
}