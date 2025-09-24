import React from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import { IconSymbol } from './ui/IconSymbol'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {}

const MenuPopUpGeneral = (props: Props) => {
  const colorScheme = useColorScheme();
  return (
    <Menu>
      <MenuTrigger style={{ alignItems:"flex-end"}} >
          <Ionicons name="ellipsis-vertical" size={25} color={colorScheme === 'dark' ? "white" : "black"} />
      </MenuTrigger>
      <MenuOptions customStyles={{
        optionsContainer: {
          marginTop: 30,
          padding: 5,
          borderRadius: 8,
          backgroundColor: "#fff",
          elevation: 30
        },
        optionWrapper: {
          padding: 10,
          borderRadius: 6
        },
        optionTouchable: {
          underlayColor: "#eee", // 📌 color al presionar
          activeOpacity: 70      // nivel de opacidad
        }
      }} >
          <MenuOption onSelect={() => alert(`Save`)}>
            <Text style={{fontSize:18}}>
              Cambiar Rol
            </Text>
          </MenuOption>
          <MenuOption onSelect={() => router.push("/settings")}>
            <Text style={{fontSize:18}}>
              Ajustes
            </Text>
          </MenuOption>
          <MenuOption onSelect={() => alert(`Save 1`)}>
            <Text style={{fontSize:18}}>
              Cerrar Sesión
            </Text>
          </MenuOption>
          {/* <MenuOption onSelect={() => alert(`Delete`)} >
              <Text style={{color: 'red'}}>Delete</Text>
          </MenuOption>
          <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' /> */}
      </MenuOptions>
    </Menu>
  )
}

export default MenuPopUpGeneral