import React, { useState } from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { Product } from '../../interfaces/'
import { Image, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import CImage from '../CImage'
import { mostSellsProduct } from '@/app/inventory/top-sellers'

type Props = {
    product:mostSellsProduct;
    position:number;
}

const DetailTopSeller = ({
    product,
    position
}: Props) => {

  const [errorImage, setErrorImage] = useState(false);

  return (
    <CView style={style.container}>
        <CView style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <CText style={{fontSize:30, fontWeight:900, fontStyle:"italic"}}>{position+1}</CText>
        </CView>
        <CView style={{flex:4}}>
            <CImage style={style.imgProduct} 
              src={product.imagen_url}
            />
        </CView>
        <CView style={style.containerDataProduct}>
            <CView>
                <CText style={{fontWeight:"bold"}}>{product.nombre || "Nombre del producto"}</CText>
                <CText style={{fontWeight:900, fontSize:20, paddingVertical:5}}>${product.ingreso_total.toFixed(2) || "Ingresos"}</CText>
            </CView>
            <Divider/>
            <CView style={style.containerStockSold}>
                <CView style={style.containerStockSoldItem1}>
                    <CText style={{fontWeight:"bold"}}>{product.cantidad_total || "28"}</CText>
                    <CText style={{fontSize:12}}>Cantidad Vendida</CText>
                </CView>
                <CView style={style.containerStockSoldItem2}>
                    <CText style={{fontWeight:"bold"}}>{product.veces_vendido || "28"}</CText>
                    <CText style={{fontSize:12}}>Órdenes</CText>
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
    flex:8,
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