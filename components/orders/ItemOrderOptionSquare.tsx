import { Product } from '@/interfaces'
import React from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'

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
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            style={styles.imageBackground}
          >
            <CView style={styles.overlay} />
            <CText style={styles.text}>{singleProduct.nombre}</CText>
          </ImageBackground>
        </CView>
    </TouchableOpacity>
  )
}

export default ItemOrderOptionSquare

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 5,
    marginRight: 10,
    borderRadius: 10,
    width: 140,
    height:"90%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    zIndex:1,
    fontWeight:"700"
  },
  imageBackground: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Llena todo el contenedor
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Opacidad del 40%
    borderRadius: 10,
  },
})