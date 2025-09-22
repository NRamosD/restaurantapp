
import { CButton, CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import FloatingButton from '@/components/FloatingButton'
import { ItemOrderSelected } from '@/components/orders'
import { Ionicons } from '@expo/vector-icons'
import { router } from "expo-router";
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Product } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid';
import ItemOrderOptionSquare from '@/components/orders/ItemOrderOptionSquare'
import useOrderStore from '@/hooks/useOrderStore'



type Props = {}
type dataType = {id:string, name:string}

const CheckoutOrder = ({
  
}: Props) => {

  const {
    items,
    getTotal,
    removeItem,
    clearOrder,
  } = useOrderStore();
  

  




  return (
    <CContainerView style={{flex:1}}>
      <CView style={{flex:1.5, backgroundColor:"#acacac", justifyContent:"center", height:20 }}>
        <CText type="title" style={{ textAlign:"center", color:"white"}}>Resumen de la Orden</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<Product>
          data={items}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={()=>removeItem(item.uuid)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <CText type="title" style={{color:"white"}}>Total</CText>
          <CText type="title" style={{color:"white"}}>${getTotal().toFixed(2)}</CText>

      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", paddingHorizontal:10 }}>
          <CButton onPress={()=>{
            clearOrder()
            router.push({pathname:"/orders/final-status-checkout"})
          }} title={"Facturar"} containerStyles={styles.touchableCreate}/>
          <CButton onPress={()=>{
            clearOrder()
            router.push({pathname:"/orders"})
          }} title={"Regresar"} containerStyles={styles.touchableCreate}/>
        
      </CView>
      


    </CContainerView>
  )
}

export default CheckoutOrder

const styles = StyleSheet.create({
  touchableCreate:{
    backgroundColor:"#dedede",
    padding:10,
    textAlign:"center",
    justifyContent:"center",
    borderRadius:10,
    height:60,
    borderWidth:5,
    borderColor:"#cecece"
  },
})