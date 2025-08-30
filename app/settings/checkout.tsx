
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



type Props = {}
type dataType = {id:string, name:string}
const data:Product[] = Array.from({ length: 20 }, (_, i) => ({ 
  id: i.toString(), 
  uuid:uuidv4(),//"Producto #"+(i/2),
  nombre:"Producto #"+i,
  precio:(Math.random()*100)+ parseFloat(Math.random().toFixed(3)),
  activo:true,
  fechaCreacion:new Date(),
}) as Product );

const CheckoutOrder = (props: Props) => {
  const [dataTest, setdataTest] = useState<Product[]>(data||[]);
  const [dataSelected, setDataSelected] = useState<Product[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");
  

  const addProductToOrder = (item:Product) => {
    setDataSelected([...dataSelected,item])
    setTextSearchedItem("")
  }

  const deleteItemSelected = (item:Product) => {
    const auxFiltered = dataSelected.filter(x=>x.id!==item.id)
    setDataSelected(auxFiltered)
  }

  useEffect(() => {
    if(data){
      setdataTest(data)
    }
  }, [data]);

  useEffect(() => {
    if(!!textSearchedItem){

      const filteredSearched = data?.filter(x=>{
        if(x.nombre.includes(textSearchedItem)){
          return x
        }
      })
      setdataTest(filteredSearched)
    }else{
      setdataTest(data)
    }
  }, [textSearchedItem]);


  return (
    <CContainerView style={{flex:1}}>
      <CView style={{flex:1.5, backgroundColor:"#acacac", justifyContent:"center", height:20 }}>
        <CText type="title" style={{ textAlign:"center", color:"white"}}>Resumen de la Orden</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<Product>
          data={dataSelected}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={()=>deleteItemSelected(item)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <CText type="title" style={{color:"white"}}>Total</CText>
          <CText type="title" style={{color:"white"}}>$55.25</CText>

      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", paddingHorizontal:10 }}>
          <CButton onPress={()=>router.push({pathname:"/orders/final-status-checkout"})} title={"FACTURAR"} containerStyles={styles.touchableCreate}/>
        
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