
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

const CreateOrder = (props: Props) => {
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
        <CText type="title" style={{ textAlign:"center", color:"white"}}>Nuevo Pedido</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<Product>
          data={dataSelected}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={()=>deleteItemSelected(item)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex:5, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <FlatList<Product>
            data={dataTest.filter(x=>!dataSelected.find(y=>y.id==x.id))}
            horizontal={true}
            keyExtractor={item => item.uuid}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ItemOrderOptionSquare singleProduct={item} touchAction={()=>addProductToOrder(item)}/>}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
          />

      </CView>

      <CView style={{flex:3, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center" }}>

        <CView style={{width:"80%", paddingHorizontal:5}}>
          <CInputText label={""} value={textSearchedItem} 
          onChangeText={(val)=>setTextSearchedItem(val)} style={{}}/>
          {/* <CButton title='Agregar' onPress={()=>{
            addProductToOrder()
          }} containerStyles={{backgroundColor:"orange", borderRadius:40 }}/> */}
        </CView>

        <FloatingButton onPress={()=>router.push({pathname:"/orders/checkout"})} nameIcon="arrow-forward" 
        floatProps={{position:"relative", backgroundColor:"#8c8c8c", width:40,height:40}}/>
        
      </CView>
      


    </CContainerView>
  )
}

export default CreateOrder

