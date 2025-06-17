import React from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import { IconSymbol } from './ui/IconSymbol'
import { Ionicons } from '@expo/vector-icons'

type Props = {}

const MenuPopUpGeneral = (props: Props) => {
  const colorScheme = useColorScheme();
  return (
        <Menu>
          <MenuTrigger style={{ alignItems:"flex-end"}} >
              <Ionicons name="ellipsis-vertical" size={25} color={colorScheme === 'dark' ? "white" : "black"} />
          </MenuTrigger>
          <MenuOptions >
              <MenuOption onSelect={() => alert(`Save`)}>
                <Text style={{fontSize:20}}>
                  New Registry
                </Text>
              </MenuOption>
              <MenuOption onSelect={() => alert(`Delete`)} >
                  <Text style={{color: 'red'}}>Delete</Text>
              </MenuOption>
              <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
          </MenuOptions>
        </Menu>
  )
}

export default MenuPopUpGeneral