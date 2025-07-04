import { Product } from '@/interfaces'
import React from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
    singleProduct: Product
    touchAction?: (product:Product)=>void
}

const ItemOrderOptionSquare = ({
    singleProduct,
    touchAction
}: Props) => {
  return (
    <TouchableOpacity key={`item-${singleProduct.uuid}`} onPress={() => touchAction && touchAction(singleProduct)}>
        <CView style={styles.item}>
            <CText style={styles.text}>{singleProduct.nombre}</CText>
        </CView>
    </TouchableOpacity>
  )
}

export default ItemOrderOptionSquare

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ff8c00',
    padding: 20,
    marginRight: 10,
    borderRadius: 10,
    width: 140,
    height:"90%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
})