import { Product } from '@/interfaces'
import React from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
    singleProduct: Product
    removeItem?: (product:Product)=>void
}

const ItemOrderSelected = ({
    singleProduct,
    removeItem
}: Props) => {
  return (
    <CView key={`singleProduct-selected-${singleProduct.id}`}
    style={{flex:1, flexDirection:"row", backgroundColor:"blue", padding:5, margin:5 }}>
        <CText style={{ flex:8, color:"white"}}>
        {singleProduct.nombre}
        </CText>
        <TouchableOpacity style={{flex:1}} onPress={()=>{removeItem && removeItem(singleProduct)}}>
            <Ionicons name={"trash"} size={25} color={"white"} />
        </TouchableOpacity>
    </CView>
  )
}

export default ItemOrderSelected