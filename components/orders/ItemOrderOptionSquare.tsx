import React from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'

type ItemOrderOptionSquareProduct = {
    uuid: string;
    nombre: string;
    imagenUrl?: string | null;
}

type Props = {
    singleProduct: ItemOrderOptionSquareProduct
    touchAction?: (producto:ItemOrderOptionSquareProduct)=>void
}

const ItemOrderOptionSquare = ({
    singleProduct,
    touchAction
}: Props) => {
  return (
    <TouchableOpacity key={`item-${singleProduct.uuid}`} onPress={() => touchAction && touchAction(singleProduct)}>
        <CView style={styles.item}>
          <ImageBackground
            source={{ uri: singleProduct.imagenUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            style={styles.imageBackground}
            imageStyle={styles.image}
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
    borderRadius: 15,
    width: 140,
    height:"90%",
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:"center"
  },

  text: {
    color: '#fff',
    zIndex:1,
    fontWeight:"700",
    textAlign:"center",
  },
  imageBackground: { 
    width: "100%", 
    height: "100%", 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    textAlign:"center"
  },
  image: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 15,
  },
})