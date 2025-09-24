import React, { useState } from 'react'
import { CView } from '../CView'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { IconSymbol } from './IconSymbol'
import { CText } from '../CText'
import useOrderStore from '@/hooks/useOrderStore'
import { Product } from '@/interfaces'
import { useColorScheme } from '@/hooks/useColorScheme'

type Props = {
    item: Product
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
        <CView style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>{
                getQuantity(item.uuid)>=2?
                updateQuantity(item.uuid, getQuantity(item.uuid)-1)
                :null
            }}>
                <IconSymbol size={30} name="minus"  color={ theme === "dark" ? "white" : "#8c8c8c"}/>
            </TouchableOpacity>
            <CText style={{marginHorizontal:5, marginTop:5, fontSize:25}}>
                {getQuantity(item.uuid)}
            </CText>
            <TouchableOpacity onPress={()=>{
                const currentQuantity = getQuantity(item.uuid)+1
                if(!item.ilimitado && currentQuantity>item.stock){
                    ToastAndroid.show("No hay suficiente stock", ToastAndroid.LONG)
                    return
                }
                updateQuantity(item.uuid, currentQuantity)
            }}>
                <IconSymbol size={30} name="plus" color={ theme === "dark" ? "white" : "black"}/>
            </TouchableOpacity>
        </CView>
    )
}

export default AddReduceButton