
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
import { useLocalSearchParams } from 'expo-router'
import useOrderOperations from '@/hooks/useOrderOperations'
import GenericModal from '@/components/ui/GenericModal'



type Props = {}
type dataType = {id:string, name:string}

const CheckoutOrder = ({
  
}: Props) => {
  const {id_orden} = useLocalSearchParams<{ id_orden: string }>()

  const [opendModalTextualOrder, setOpendedModalTextualOrder] = useState(false)

  const {
    items,
    getTotal,
    removeItem,
    clearOrder,
  } = useOrderStore();

  const {
    createOrderProcess,
    updateOrderProcess
  } = useOrderOperations({})
  
  const decideHowToProccess = async () => {
    if(!!id_orden){
      await updateOrderProcess({
        id_orden: Number(id_orden),
        total:getTotal(),
        estado:"pagado"
      })
    }else{
      await createOrderProcess({
        total:getTotal(),
        estado:"pagado"
      })
    }
  }

  




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
        justifyContent:"center", alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <CText type="title" style={{color:"white"}}>Total</CText>
          <CText type="title" style={{color:"white"}}>${getTotal().toFixed(2)}</CText>

      </CView>

      <CView style={{flex:3, gap:10, alignContent:"center", backgroundColor:"#1c1c1c",
        justifyContent:"flex-start", alignItems:"center", paddingHorizontal:10 }}>
          <CButton onPress={async()=>{
            await decideHowToProccess()
            clearOrder()
            router.push({pathname:"/orders/final-status-checkout"})
          }} title={"Facturar"} containerStyles={styles.touchableCreate}/>
          <CView style={{flex:1, flexDirection:"row", gap:10, backgroundColor:"#1c1c1c"}}>
            <CButton onPress={()=>{
              // clearOrder()
              router.back()
            }} title={"Regresar"} textStyles={{fontSize:20}} containerStyles={[styles.touchableCreate, {width:"49%"}]} />
            <CButton onPress={()=>{
              setOpendedModalTextualOrder(true)
            }} title={"Orden Textual"} textStyles={{fontSize:20}} containerStyles={[styles.touchableCreate, {width:"49%"}]} />
          </CView>
      </CView>
      <GenericModal
        showModal={opendModalTextualOrder}
        setShowModal={setOpendedModalTextualOrder}
        title="Orden Textual"
        nodeContent={<CText>Contenido del modal</CText>}
        withButton={false}
      />


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