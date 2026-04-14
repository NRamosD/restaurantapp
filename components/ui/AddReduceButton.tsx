import React, { useState } from 'react'
import { CView } from '../CView'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { IconSymbol } from './IconSymbol'
import { CText } from '../CText'
import useOrderStore from '@/hooks/useOrderStore'
import { useColorScheme } from '@/hooks/useColorScheme'

type AddReduceItem = {
    uuid: string;
    ilimitado?: boolean;
    stock: number;
}

type Props = {
    item: AddReduceItem
}

const AddReduceButton = ({
    item
}: Props) => {
    const theme = useColorScheme()
    const {
        updateQuantity,
        getQuantity
    } = useOrderStore();
    
    return (
        <CView style={{flex:1}}>
            <CView style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                <CText style={{fontSize:35}}>
                    {getQuantity(item.uuid)}
                </CText>
            </CView>
            <CView style={{flex:1, flexDirection:"row"}}>
                <TouchableOpacity
                    style={{flex:1, alignItems:"center", justifyContent:"center"}}
                    onPress={()=>{
                        getQuantity(item.uuid)>=2?
                        updateQuantity(item.uuid, getQuantity(item.uuid)-1)
                        :null
                    }}>
                    <IconSymbol size={50} name="minus"  color={ theme === "dark" ? "white" : "#8c8c8c"}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flex:1, alignItems:"center", justifyContent:"center"}}
                    onPress={()=>{
                        const currentQuantity = getQuantity(item.uuid)+1
                        if(!item.ilimitado && currentQuantity>item.stock){
                            ToastAndroid.show("No hay suficiente stock", ToastAndroid.LONG)
                            return
                        }
                        updateQuantity(item.uuid, currentQuantity)
                    }}>
                    <IconSymbol size={50} name="plus" color={ theme === "dark" ? "white" : "black"}/>
                </TouchableOpacity>
            </CView>
        </CView>
    )
}

export default AddReduceButton