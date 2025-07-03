
import { CButton, CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import FloatingButton from '@/components/FloatingButton'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

type Props = {}
type dataType = {id:string, name:string}
const data:dataType[] = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), name: `Producto ${i + 1}` }) as dataType );

const CreateOrder = (props: Props) => {
  const [dataTest, setdataTest] = useState<dataType[]>(data||[]);
  const [dataSelected, setDataSelected] = useState<dataType[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");
  

  const addProductToOrder = (item:dataType) => {
    setDataSelected([...dataSelected,item])
    setTextSearchedItem("")
  }

  const deleteItemSelected = (item:dataType) => {
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
        if(x.name.includes(textSearchedItem)){
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
      <CView style={{flex:1.5, backgroundColor:"green", justifyContent:"center", height:20 }}>
        <CText type="title" style={{ textAlign:"center"}}>Nuevo Pedido</CText>
      </CView>
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<dataType>
          data={dataSelected}
          renderItem={({item}) => <CView key={`item-selected-${item.id}`}
            style={{flex:1, flexDirection:"row", backgroundColor:"blue", padding:5, margin:5 }}>
              <CText style={{ flex:8, color:"white"}}>
                {item.name}
              </CText>
              <TouchableOpacity style={{flex:1}} onPress={()=>deleteItemSelected(item)}>
                <Ionicons name={"trash"} size={25} color={"white"} />
              </TouchableOpacity>
          </CView> }
          keyExtractor={item => item.id}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex:4, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", backgroundColor:"blue"}}>
          <FlatList<dataType>
            data={dataTest.filter(x=>!dataSelected.find(y=>y.id==x.id))}
            horizontal={true}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity key={`item-${item.id}`} onPress={() => addProductToOrder(item)}>
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
          <CInputText value={textSearchedItem} onChangeText={(val)=>setTextSearchedItem(val)}/>
          {/* <CButton title='Agregar' onPress={()=>{
            addProductToOrder()
          }} containerStyles={{backgroundColor:"orange", borderRadius:40 }}/> */}
        </CView>

        <FloatingButton onPress={()=>alert("pressed float")} nameIcon="mic" 
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
    height:"90%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
})