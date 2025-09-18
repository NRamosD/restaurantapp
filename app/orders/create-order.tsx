
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
import { useSQLiteContext } from 'expo-sqlite'
import { getAllProducts } from '@/database/product.operations'



type Props = {}
type dataType = {id:string, name:string}
// const data:Product[] = Array.from({ length: 20 }, (_, i) => ({ 
//   id: i.toString(), 
//   uuid:uuidv4(),//"Producto #"+(i/2),
//   nombre:"Producto #"+i,
//   precio:(Math.random()*100)+ parseFloat(Math.random().toFixed(3)),
//   activo:true,
//   fechaCreacion:new Date(),
// }) as Product );

const CreateOrder = ({
  
}: Props) => {
  const dbConnection = useSQLiteContext()

  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [dataSelected, setDataSelected] = useState<Product[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");
  

  const addProductToOrder = (item:Product) => {
    setDataSelected([...dataSelected,item])
    setTextSearchedItem("")
  }

  const deleteItemSelected = (item:Product) => {
    const auxFiltered = dataSelected.filter(x=>x.uuid!==item.uuid)
    setDataSelected(auxFiltered)
  }

  useEffect(() => {
    (async () => {
      const result = await getAllProducts(dbConnection)
      setDataProducts(result)
      setProductsList(result)
    })()
  }, []);

  useEffect(() => {
    if(!!textSearchedItem){

      const filteredSearched = dataProducts?.filter(x=>{
        if(x.nombre.toLowerCase().includes(textSearchedItem.toLowerCase())){
          return x
        }
      })
      setProductsList(filteredSearched)
    }else{
      setProductsList(dataProducts)
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

      <CView style={{flex: dataSelected?.length==productsList?.length ? 1 : 5, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <FlatList<Product>
            data={productsList.filter(x=>!dataSelected.find(y=>y.uuid==x.uuid))}
            horizontal={true}
            keyExtractor={item => item.uuid}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ItemOrderOptionSquare singleProduct={item} touchAction={()=>addProductToOrder(item)}/>}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
          />

      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:2,
        justifyContent:"flex-start", alignItems:"center" }}>
        <CView style={{flex:1, paddingHorizontal:5, justifyContent:"center", alignItems:"center"}}>
          <FloatingButton onPress={()=>router.dismissTo({pathname:"/"})} nameIcon="save" 
          floatProps={{backgroundColor:"#8c8c8c", padding:7, width:"auto", height:"auto"}}/>
        </CView>

        <CView style={{flex:6, paddingHorizontal:0}}>
          <CInputText label={""} value={textSearchedItem} 
          onChangeText={(val)=>setTextSearchedItem(val)} style={{}} />
        </CView>
        <CView style={{flex:1, paddingHorizontal:5, justifyContent:"center", alignItems:"center"}}>
          <FloatingButton onPress={()=>router.push({pathname:"/orders/checkout"})} nameIcon="arrow-forward" 
          floatProps={{backgroundColor:"#8c8c8c", padding:7, width:"auto", height:"auto"}}/>
        </CView>

        
      </CView>
      


    </CContainerView>
  )
}

export default CreateOrder

