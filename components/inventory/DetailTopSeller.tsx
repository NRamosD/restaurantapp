import React, { useState } from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { Product } from '../../interfaces/'
import { Image, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import CImage from '../CImage'

type Props = {
    product:Product;
}

const DetailTopSeller = ({
    product
}: Props) => {

  const [errorImage, setErrorImage] = useState(false);

  return (
    <CView style={style.container}>
        <CView style={{flex:2}}>
            <CImage style={style.imgProduct} 
              src={product.imagen_url}
            />
        </CView>
        <CView style={style.containerDataProduct}>
            <CView>
                <CText style={{fontWeight:"bold"}}>{product.nombre || "Nombre del producto"}</CText>
                <CText>${product.precio || "Precio del producto"}</CText>
            </CView>
            <Divider/>
            <CView style={style.containerStockSold}>
                <CView style={style.containerStockSoldItem1}>
                    <CText style={{fontWeight:"bold"}}>{product.stock || "28"}</CText>
                    <CText style={{fontSize:12}}>En Stock</CText>
                </CView>
                <CView style={style.containerStockSoldItem2}>
                    <CText style={{fontWeight:"bold"}}>{28}</CText>
                    <CText style={{fontSize:12}}>Vendido</CText>
                </CView>
            </CView>
            
        </CView>

    </CView>
  )
}

export default DetailTopSeller

const style = StyleSheet.create({
  container:{
    flexDirection:"row",
    padding:2,
    gap:10,
    borderWidth:2,
    borderColor:"#cecece",
    borderRadius:5,
    marginVertical:2,
    
  },
  imgProduct:{
    width:"100%",
    height:130,
    objectFit:"cover",
  },
  containerDataProduct:{
    flex:4,
  },
  containerStockSold:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    padding:5
  },
  containerStockSoldItem1:{
    flex:1,
    justifyContent:"flex-end",
    alignItems:"flex-start",
    paddingHorizontal:5
  },
  containerStockSoldItem2:{
    flex:1,
    justifyContent:"flex-end",
    alignItems:"flex-end",
    paddingHorizontal:5
  }
})