import React, { useState } from 'react'
import { CView } from '../CView'
import { TouchableOpacity } from 'react-native'
import { IconSymbol } from './IconSymbol'
import { CText } from '../CText'
import useOrderStore from '@/hooks/useOrderStore'
import { Product } from '@/interfaces'

type Props = {
    item: Product
}

const AddReduceButton = ({
    item
}: Props) => {
    const {
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearOrder,
        getTotal,
        getItemCount,
        getQuantity
    } = useOrderStore();
    
    return (
        <CView style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>{
                getQuantity(item.uuid)>=2?
                updateQuantity(item.uuid, getQuantity(item.uuid)-1)
                :null
            }}>
                <IconSymbol size={30} name="minus" color={"#8c8c8c"}/>
            </TouchableOpacity>
            <CText style={{marginHorizontal:5, marginTop:5, fontSize:25}}>
                {getQuantity(item.uuid)}
            </CText>
            <TouchableOpacity onPress={()=>{
                updateQuantity(item.uuid, getQuantity(item.uuid)+1)
            }}>
                <IconSymbol size={30} name="plus" color={"black"}/>
            </TouchableOpacity>
        </CView>
    )
}

export default AddReduceButton