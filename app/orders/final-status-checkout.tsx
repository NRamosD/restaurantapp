
import { CButton, CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import FloatingButton from '@/components/FloatingButton'
import { ItemOrderSelected } from '@/components/orders'
import { Ionicons } from '@expo/vector-icons'
import { router } from "expo-router";
import {useNavigation} from '@react-navigation/native';
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

const FinalStatusCheckout = (props: Props) => {

  const navigation = useNavigation();

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
    <CContainerView style={{flex:1, justifyContent:"center"}}>

      <CView style={{flex:6, gap:15, justifyContent:"center", paddingHorizontal:5, alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <CText type="title" style={{color:"white", textAlign:"center"}}>La orden ha sido facturada!</CText>
      </CView>
      <CView style={{flex:1, justifyContent:"center", paddingHorizontal:10}}>
        <CButton containerStyles={styles.touchableCreate} onPress={()=>router.dismissTo("/")} title={"Volver al inicio"}/>
      </CView>
      


    </CContainerView>
  )
}

export default FinalStatusCheckout

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