
import { CButton, CContainerView, CText, CView } from '@/components'
import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

type Props = {}

const CreateOrder = (props: Props) => {
  const dataTest = [1,2,3]
  return (
    <CContainerView style={{flex:1}}>
      <CView style={{flex:1, backgroundColor:"green", justifyContent:"center"}}>
        <CText type="title" style={{ textAlign:"center"}}>Nuevo Pedido</CText>
      </CView>
      <CView style={{flex:10, flexDirection:"row"}}>
        <FlatList<any>
          data={dataTest}
          renderItem={({item}) => <CText 
            style={{backgroundColor:"blue", padding:5, margin:5, color:"white"}}>
            qweqweqw</CText> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>
      <CButton title='añadir elemento' onPress={()=>{
        dataTest.push(1)
        alert("se envia un valor: "+ dataTest)
      }} style={{backgroundColor:"orange"}}/>
      


    </CContainerView>
  )
}

export default CreateOrder

const styles = StyleSheet.create({

})