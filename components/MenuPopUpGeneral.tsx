import React from 'react'
import { Text, View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import { IconSymbol } from './ui/IconSymbol'
import { Ionicons } from '@expo/vector-icons'

type Props = {}

const MenuPopUpGeneral = (props: Props) => {
  return (
    <MenuProvider style={{width:"100%"}}>
        <Menu >
        <MenuTrigger style={{ zIndex:100}}>
            <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </MenuTrigger>
        <MenuOptions >
            <MenuOption onSelect={() => alert(`Save`)} text='Save' />
            <MenuOption onSelect={() => alert(`Delete`)} >
                <Text style={{color: 'red'}}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
        </MenuOptions>
        </Menu>
    </MenuProvider>
  )
}

export default MenuPopUpGeneral