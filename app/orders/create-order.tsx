
import { CButton, CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import FloatingButton from '@/components/FloatingButton'
import { ItemOrderSelected } from '@/components/orders'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Product } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid';
import ItemOrderOptionSquare from '@/components/orders/ItemOrderOptionSquare'
import { useSQLiteContext } from 'expo-sqlite'
import { getAllProducts } from '@/database/product.operations'
import useOrderStore from '@/hooks/useOrderStore'
import useOrderOperations from '@/hooks/useOrderOperations'



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
  const {id_orden} = useLocalSearchParams<{ id_orden: string }>()
  const dbConnection = useSQLiteContext()

  const [dataProducts, setDataProducts] = useState<Product[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");

  const {
    items,
    addItem,
    removeItem,
    clearOrder,
    getTotal,
  } = useOrderStore();

  const {
    createOrderProcess,
    updateOrderProcess
  } = useOrderOperations({})
  

  const addProductToOrder = (item:Product & {
    quantity?:number
  }) => {
    addItem(item)
    setTextSearchedItem("")
  }

  const deleteItemSelected = (item:Product) => {
    removeItem(item.uuid)
  }

  useEffect(() => {
    
    (async () => {
      const result = await getAllProducts(dbConnection)
      setDataProducts(result)
      setProductsList(result)
    })()


    console.log({items})
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
      <CView style={{flex:1.5, flexDirection:"row", backgroundColor:"#000000", justifyContent:"center", alignItems:"center", height:20 }}>
        <CText type="subtitle" style={{flex:1, textAlign:"left", color:"white", paddingHorizontal:10}}>{id_orden ? "Editar" : "Nuevo"} Pedido</CText>
        <CText type="subtitle" style={{flex:1, textAlign:"right", color:"white", paddingHorizontal:10}}>Total: ${getTotal().toFixed(2)}</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<Product>
          data={items}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={()=>deleteItemSelected(item)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex: items?.length==productsList?.length ? 1 : 5, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <FlatList<Product>
            data={productsList.filter(x=>!items.find(y=>y.uuid==x.uuid))}
            horizontal={true}
            keyExtractor={item => item.uuid}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ItemOrderOptionSquare singleProduct={item} touchAction={()=>addProductToOrder(item)}/>}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
          />

      </CView>
      <CView style={{flex:2, paddingHorizontal:10, paddingVertical:5}}>
        <CInputText label={""} value={textSearchedItem} 
          onChangeText={(val)=>setTextSearchedItem(val)} style={{}} />
      </CView>

      <CView style={{flex:1, flexDirection:"row", gap:10,
        justifyContent:"space-between", paddingHorizontal:10, alignItems:"center" }}>
          <TouchableOpacity style={styles.orderButton} onPress={()=>{
            clearOrder()
            router.dismissTo({pathname:"/"})
          }}>
            <CText type="subtitle">Cancelar</CText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={async()=>{
            if(id_orden){
              await updateOrderProcess({
                id_orden: Number(id_orden),
                total:getTotal(),
              })
            }else{
              await createOrderProcess({
                total:getTotal(),
              })
            }
            clearOrder()
            router.dismissTo({pathname:"/"})
          }}>
            <CText type="subtitle">Guardar</CText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={()=>router.push({pathname:"/orders/checkout"})}>
            <CText type="subtitle">Ir a Pagar</CText>
          </TouchableOpacity>
      </CView>
      


    </CContainerView>
  )
}

export default CreateOrder


const styles = StyleSheet.create({
  orderButton:{
    flex:1,
    borderRadius:5,
    height:40,
    borderWidth:1,
    borderColor:"#8c8c8c",
    alignItems:"center",
    justifyContent:"center"
  }
})

