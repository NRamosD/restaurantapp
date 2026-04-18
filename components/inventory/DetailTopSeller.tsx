import React, { useState } from 'react'
import { CView } from '../CView'
import { CText } from '../CText'
import { Product } from '../../interfaces/'
import { StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import CImage from '../CImage'
import { mostSellsProduct } from '@/app/inventory/top-sellers'

type Props = {
    producto:mostSellsProduct;
    position:number;
}

const DetailTopSeller = ({
    producto,
    position
}: Props) => {
  return (
    <CView style={style.container}>
        <CView style={style.rankContainer}>
          <CView style={style.rankBadge}>
            <CText style={style.rankText}>{position+1}</CText>
          </CView>
        </CView>
        <CView style={style.imageContainer}>
            <CImage style={style.imgProduct} 
              src={producto.imagen_url}
            />
        </CView>
        <CView style={style.containerDataProduct}>
            <CView style={style.headerContainer}>
                <CText style={style.productName}>{producto.nombre || "Nombre del producto"}</CText>
                <CView style={style.revenueBadge}>
                  <CText style={style.revenueText}>${producto.ingreso_total.toFixed(2)}</CText>
                </CView>
            </CView>
            <CText style={style.subtitle}>Ingresos generados</CText>
            <Divider style={style.divider}/>
            <CView style={style.containerStockSold}>
                <CView style={style.metricCard}>
                    <CText style={style.metricValue}>{producto.cantidad_total}</CText>
                    <CText style={style.metricLabel}>Cantidad Vendida</CText>
                </CView>
                <CView style={style.metricCard}>
                    <CText style={style.metricValue}>{producto.veces_vendido}</CText>
                    <CText style={style.metricLabel}>Órdenes</CText>
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
    padding:10,
    gap:10,
    borderWidth:1,
    borderColor:"#d9d9d9",
    borderRadius:14,
    marginVertical:4,
    alignItems:"center",
    backgroundColor:"#ffffff",
  },
  rankContainer:{
    width:42,
    justifyContent:"center",
    alignItems:"center",
  },
  rankBadge:{
    width:42,
    height:42,
    borderRadius:21,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#1c1c1c",
  },
  rankText:{
    fontSize:20,
    fontWeight:"900",
    fontStyle:"italic",
    color:"#ffffff",
  },
  imageContainer:{
    width:90,
    height:90,
    borderRadius:12,
    overflow:"hidden",
  },
  imgProduct:{
    width:"100%",
    height:"100%",
    objectFit:"cover",
    borderRadius:12,
  },
  containerDataProduct:{
    flex:1,
    gap:6,
  },
  headerContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"flex-start",
    gap:8,
  },
  productName:{
    flex:1,
    fontWeight:"bold",
    fontSize:16,
  },
  revenueBadge:{
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:999,
    backgroundColor:"#1c1c1c",
  },
  revenueText:{
    fontWeight:"900",
    fontSize:15,
    color:"#ffffff",
  },
  subtitle:{
    fontSize:12,
    opacity:0.7,
  },
  divider:{
    marginVertical:2,
  },
  containerStockSold:{
    flexDirection:"row",
    justifyContent:"space-between",
    gap:8,
  },
  metricCard:{
    flex:1,
    paddingVertical:8,
    paddingHorizontal:10,
    borderRadius:10,
    backgroundColor:"#f5f5f5",
  },
  metricValue:{
    fontWeight:"bold",
    fontSize:18,
  },
  metricLabel:{
    fontSize:12,
    opacity:0.75,
  }
})