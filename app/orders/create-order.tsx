import { CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import { ItemOrderSelected } from '@/components/orders'
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import ItemOrderOptionSquare from '@/components/orders/ItemOrderOptionSquare'
import useOrderStore from '@/hooks/useOrderStore'
import { useOrdenService, useProductoService } from '@/modules'
import { ProductoDisponible } from '@/modules/producto/producto.service'

type Props = {}
type dataType = {id:string, name:string}
type OrderType = 'LOCAL' | 'LLEVAR' | 'DELIVERY'

const CreateOrder = ({
  
}: Props) => {
  const {id_orden} = useLocalSearchParams<{ id_orden: string }>()

  //state
  const [dataProducts, setDataProducts] = useState<ProductoDisponible[]>([]);
  const [productsList, setProductsList] = useState<ProductoDisponible[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");
  const [orderType, setOrderType] = useState<OrderType>('LOCAL');
  
  //store
  const {
    items,
    addItem,
    removeItem,
    clearOrder,
    getTotal,
  } = useOrderStore();

  //hooks
  const { obtenerProductosDisponibles } = useProductoService()
  const { crearOrden, agregarProductoAOrden, obtenerOrdenPorUuid } = useOrdenService()
  

  const addProductToOrder = (product:ProductoDisponible) => {
    const newItem = {
      ...product,
      cantidad: 1,
    }
    console.log(" newItem", newItem)
    addItem(newItem)
    setTextSearchedItem("")
  }

  const decideHowToProccess = async () => {
    if(!!id_orden){
      items.forEach(item => {
        if(!item.uuid) return;




        agregarProductoAOrden({
          ordenUuid: id_orden,
          productoUuid: item.uuid,
          cantidad: item.cantidad,
        })
      })
    }else{
      await crearOrden({
        usuarioUuid: "usuario-uuid",
        clienteUuid: undefined,
        tipo: orderType,
        observaciones: undefined,
      })
    }
  }



  useEffect(() => {
    
    (async () => {
      const products = await obtenerProductosDisponibles()
      setDataProducts(products)
      setProductsList(products)
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
        <CText type="subtitle" style={{flex:1, textAlign:"left", color:"white", paddingHorizontal:10, fontSize:20}}>{id_orden ? "Editar" : "Nuevo"} Pedido</CText>
        <CText type="subtitle" style={{flex:1, textAlign:"right", color:"white", paddingHorizontal:10, fontSize:16}}>Total: ${getTotal().toFixed(2)}</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<any>
          data={items || []}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={(productoUuid)=>removeItem(productoUuid)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex: items?.length==productsList?.length ? 1 : 5, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <FlatList<ProductoDisponible>
            data={productsList.filter(x=>!items.find(y=>y.uuid==x.uuid))}
            horizontal={true}
            keyExtractor={item => item.uuid}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ItemOrderOptionSquare singleProduct={item} touchAction={(product)=>addProductToOrder(product)}/>}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
          />
      </CView>
      <CView style={{flex:1}}>
        <SegmentedButtons
          value={orderType}
          onValueChange={(value) => setOrderType(value as OrderType)}
          buttons={[
            { value: 'LOCAL', label: 'Local' },
            { value: 'LLEVAR', label: 'Llevar' },
            { value: 'DELIVERY', label: 'Delivery' },
          ]}
        />
      </CView>
      <CView style={{flex:2, paddingHorizontal:10, paddingVertical:0, justifyContent:"center" }}>
        <CInputText label={"Ingresa el producto a buscar..."} value={textSearchedItem} 
          onChangeText={(val)=>setTextSearchedItem(val)} style={{flex:1, marginVertical:0}} />
      </CView>
      <CView style={{flex:2, flexDirection:"row", gap:10,
        justifyContent:"space-between", paddingHorizontal:10, alignItems:"center" }}>
          <TouchableOpacity style={styles.orderButton} onPress={()=>{
            clearOrder()
            router.dismissTo({pathname:"/"})
          }}>
            <CText type="subtitle">Inicio</CText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={async()=>{
            if(items.length==0){
              ToastAndroid.show("No se añadieron productos", ToastAndroid.SHORT)
              return
            }
            await decideHowToProccess()
            clearOrder()
            router.dismissTo({pathname:"/"})
          }}>
            <CText type="subtitle">Guardar</CText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} 
            onPress={async()=>{
              if(items.length==0){
                ToastAndroid.show("No hay productos", ToastAndroid.SHORT)
                return
              }
              router.push({pathname:"/orders/checkout", params:{id_orden:id_orden??""}})
            }}
          >
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

