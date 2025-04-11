import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Button, Pressable, Text, TextInput, View } from 'react-native'

export default function HomeInventoryScreen() {
  const [nameProduct, setNameProduct] = useState<string>("");
  return (
    <View>
        <Text>Inventory home</Text>
        <View style={{padding:10, display:"flex", gap:15}}>
          <TextInput
          onChangeText={(text)=>setNameProduct(text)} 
          style={{ borderStyle:"solid", borderWidth:5, borderColor:"red", borderRadius:10}} />
          <Button title='aquiii' onPress={()=>{
            router.navigate(`inventory/:${nameProduct}`)
          }}/>
        </View>
        <Link href={"/inventory/:tomate"} asChild>
          <Pressable>
            <Text>
              Veamos el tomate
            </Text>
          </Pressable>
        </Link>
    </View>
  )
}
