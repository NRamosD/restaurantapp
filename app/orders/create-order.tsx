
import { CButton, CContainerView, CText, CView } from '@/components'
import FloatingButton from '@/components/FloatingButton'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

type Props = {}

const data = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), name: `Producto ${i + 1}` }));

const CreateOrder = (props: Props) => {
  const [dataTest, setdataTest] = useState<string[]>([]);
  

  const addProductToOrder = () => {
    setdataTest([...dataTest, "holaaaaa"])
    alert("se envia un valor: "+ dataTest)
  } 


  return (
    <CContainerView style={{flex:1}}>
      <CView style={{flex:1, backgroundColor:"green", justifyContent:"center"}}>
        <CText type="title" style={{ textAlign:"center"}}>Nuevo Pedido</CText>
      </CView>
      <CView style={{flex:8, flexDirection:"row"}}>
        <FlatList<any>
          data={dataTest}
          renderItem={({item}) => <CText 
            style={{backgroundColor:"blue", padding:5, margin:5, color:"white"}}>
            qweqweqw</CText> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"blue"}}>
          <FlatList
            data={data}
            horizontal={true}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={addProductToOrder}>
                <CView style={styles.item}>
                  <CText style={styles.text}>{item.name}</CText>
                </CView>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
          />

      </CView>

      <CView style={{flex:2, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"red"}}>

        <CView style={{width:"80%", padding:5}}>
          <CButton title='Agregar' onPress={()=>{
            addProductToOrder()
          }} containerStyles={{backgroundColor:"orange", borderRadius:40 }}/>
        </CView>

        <FloatingButton onPress={()=>alert("pressed float")} nameIcon="add" 
        floatProps={{position:"relative", backgroundColor:"black", width:50,height:50}}/>
        
      </CView>
      


    </CContainerView>
  )
}

export default CreateOrder

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ff8c00',
    padding: 20,
    marginRight: 10,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
})