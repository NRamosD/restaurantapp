import React, { useState } from 'react'
import { CView } from '../CView'
import { TouchableOpacity } from 'react-native'
import { IconSymbol } from './IconSymbol'
import { CText } from '../CText'

type Props = {}

const AddReduceButton = (props: Props) => {
    const [numberProducts, setnumberProducts] = useState(1);
    return (
        <CView style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>numberProducts>=2?setnumberProducts(numberProducts-1):null}>
                <IconSymbol size={30} name="minus" color={"#8c8c8c"}/>
            </TouchableOpacity>
            <CText style={{marginHorizontal:5, marginTop:5, fontSize:25}}>
                {numberProducts}
            </CText>
            <TouchableOpacity onPress={()=>setnumberProducts(numberProducts+1)}>
                <IconSymbol size={30} name="plus" color={"black"}/>
            </TouchableOpacity>
        </CView>
    )
}

export default AddReduceButton