import { Product } from '@/interfaces'
import { CView } from '../CView'
import { CText } from '../CText'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AddReduceButton from '../ui/AddReduceButton'
import useOrderStore from '@/hooks/useOrderStore'
import GenericModal from '../ui/GenericModal'
import { useState } from 'react'
import CInputText from '../CInputText'

type Props = {
    singleProduct: Product
    removeItem?: (product:Product)=>void
}

const ItemOrderSelected = ({
    singleProduct,
    removeItem
}: Props) => {
  const {getQuantity} = useOrderStore();
  
  const [openModal, setopenModal] = useState(false)
  const [detailProduct, setDetailProduct] = useState("")
  
  const {
    updateNotes,
    getItem
  } = useOrderStore()
  let notes = getItem(singleProduct.uuid)?.notes
  // console.log({singleProduct})

  return (
    <>
      <TouchableOpacity onLongPress={()=>{setopenModal(true)}}>
        <CView key={`singleProduct-selected-${singleProduct.uuid}`}
        style={style.container}>
            <CView style={{flex:8}}>
              <CText style={style.nameProduct}>
              {singleProduct.nombre}
              </CText>
              {
                getItem(singleProduct.uuid)?.notes ?
                <CView style={{flex:1, paddingVertical:10}}>
                  <TouchableOpacity style={{flexDirection:"row", gap:5, alignItems:"center"}} 
                  onPress={()=>{
                    setDetailProduct(getItem(singleProduct.uuid)?.notes||"")
                    setopenModal(true)
                  }}>
                    <Ionicons name={"eye"} size={20} />
                    <CText style={{fontSize:17}}>{notes?.substring(0, 30)}{((notes && notes?.length>30)) && "..."}</CText>
                  </TouchableOpacity>
                </CView>
                :
                <CView style={{flex:1, paddingVertical:10}}>
                  <TouchableOpacity style={{flexDirection:"row", gap:5, alignItems:"center"}} 
                  onPress={()=>{
                    setDetailProduct("")
                    setopenModal(true)
                  }}>
                    <Ionicons name={"add"} size={20} />
                    <CText style={{fontSize:17}}>Añadir nota</CText>
                  </TouchableOpacity>
                </CView>
              }
              <CView style={{flex:1}}>
                <CText>Por unidad: <CText style={{fontWeight:900, fontSize:17}}>${singleProduct.precio?.toFixed(2)}</CText></CText>
                <CText style={{textAlign:"left"}}>Subtotal: <CText style={{fontWeight:900, fontSize:17}}>${(singleProduct.precio*getQuantity(singleProduct.uuid)).toFixed(2)}</CText></CText>
              </CView>
            </CView>
            <CView style={{flex:3}}>
              <TouchableOpacity style={{flex:1, alignItems:"flex-end"}} onPress={()=>{removeItem && removeItem(singleProduct)}}>
                  <Ionicons name={"trash"} size={30} color={"red"} />
              </TouchableOpacity>
              <CView style={{flex:1}}>
                <AddReduceButton item={singleProduct}/>
              </CView>
            </CView>
        </CView>
      </TouchableOpacity>

      <GenericModal
        title={singleProduct.nombre}
        showModal={openModal}
        setShowModal={setopenModal}
        textConfirmButton={'Guardar'}
        onCancel={()=>{
          setDetailProduct("")
          setopenModal(false)
        }}
        onConfirm={()=>{
          updateNotes(singleProduct.uuid, detailProduct)
          setDetailProduct("")
          setopenModal(false)
        }}
        nodeContent={<>
          <CView style={{flex:2, width:"100%", gap:10}}>
            <CView style={{flex:1}}>
              <CText>Ingrese los detalles del producto</CText>
            </CView>
            <CView>
              <CInputText label="Detalle" 
              fontSize={20}
              value={detailProduct}
              onChangeText={(text)=>setDetailProduct(text)}
              multiline={true} numberOfLines={6} />
            </CView>
          </CView>
        </>
        }
      />
      
    </>
  )
}

export default ItemOrderSelected

const style = StyleSheet.create({
  container: {
    flex:1, 
    flexDirection:"row", 
    // backgroundColor:"blue", 
    padding:10, 
    margin:5,
    // height:110,
    boxShadow: "2px 3px 2px gray",
    borderWidth:2,
    borderColor:"gray",
    borderRadius: 10
  },
  nameProduct: {flex:1,  color:"black", fontSize:25},


})
