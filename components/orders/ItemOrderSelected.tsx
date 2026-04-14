import { CView } from '../CView'
import { CText } from '../CText'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AddReduceButton from '../ui/AddReduceButton'
import useOrderStore, { type OrderItem } from '@/hooks/useOrderStore'
import GenericModal from '../ui/GenericModal'
import { useState } from 'react'
import CInputText from '../CInputText'
import { useColorScheme } from '@/hooks/useColorScheme'
import { OrdenProductoDetails } from '@/modules/orden/orden.service'

type Props = {
    singleProduct: OrdenProductoDetails,
    removeItem?: (productoUuid: string)=>void,
    justShow?: boolean
}

const ItemOrderSelected = ({
    singleProduct,
    removeItem,
    justShow = false
}: Props) => {
  
  const { getQuantity, updateNotes, getItem } = useOrderStore();
  const theme = useColorScheme()
  
  const [openModal, setopenModal] = useState(false)
  const [detailProduct, setDetailProduct] = useState("")
  
  const currentItem = getItem(singleProduct?.productoUuid || "")
  const quantity = getQuantity(singleProduct?.productoUuid || "") || singleProduct.cantidad || 0
  const unitPrice = singleProduct?.precioUnitario ?? 0
  const notes = singleProduct.notas ?? ""
  const subtotal = unitPrice * quantity

  return (
    <>
      <TouchableOpacity onLongPress={()=>{
        setDetailProduct(notes)
        setopenModal(true)
      }}>
        <CView key={`singleProduct-selected-${singleProduct.productoUuid}`}
        style={style.container}>
            <CView style={{flex:8}}>
              <CText style={style.nameProduct}>
              {currentItem ? currentItem?.producto?.nombre : singleProduct?.producto?.nombre}
              </CText>
              {
                notes ?
                <CView style={{flex:1, paddingVertical:10}}>
                  <TouchableOpacity style={{flexDirection:"row", gap:5, alignItems:"center"}} 
                  onPress={()=>{
                    setDetailProduct(notes)
                    setopenModal(true)
                  }}>
                    <Ionicons name={"eye"} size={20} color={theme === "dark" ? "white" : "black"}/>
                    <CText style={{fontSize:17}}>{notes.substring(0, 30)}{notes.length>30 && "..."}</CText>
                  </TouchableOpacity>
                </CView>
                :
                <CView style={{flex:1, paddingVertical:10}}>
                  {justShow ? null : 
                  <TouchableOpacity style={{flexDirection:"row", gap:5, alignItems:"center"}} 
                  onPress={()=>{
                    setDetailProduct("")
                    setopenModal(true)
                  }}>
                    <Ionicons name={"add"} size={20} color={theme === "dark" ? "white" : "black"}/>
                    <CText style={{fontSize:17}}>Añadir nota</CText>
                  </TouchableOpacity>
                  }
                </CView>
              }
              <CView style={{flex:1}}>
                <CText>Por unidad: <CText style={{fontWeight:900, fontSize:17}}>${unitPrice.toFixed(2)}</CText></CText>
                <CText style={{textAlign:"left"}}>Cantidad: <CText style={{fontWeight:900, fontSize:17}}>{quantity}</CText></CText>
                <CText style={{textAlign:"left"}}>Subtotal: <CText style={{fontWeight:900, fontSize:17}}>${subtotal.toFixed(2)}</CText></CText>
              </CView>
            </CView>
            <CView style={{flex:3}}>
              {justShow ? null : <TouchableOpacity style={{flex:1, alignItems:"flex-end"}} onPress={()=>{removeItem && removeItem(singleProduct?.productoUuid || "")}}>
                  <Ionicons name={"trash"} size={30} color={"red"} />
              </TouchableOpacity>}
              {justShow ? null : <CView style={{flex:1}}>
                <AddReduceButton item={{ uuid: singleProduct?.productoUuid || "", ilimitado: !!singleProduct?.producto?.ilimitado, stock: singleProduct?.producto?.stock ?? 0 }} />
              </CView>}
            </CView>
        </CView>
      </TouchableOpacity>

      <GenericModal
        title={singleProduct.producto?.nombre || ""}
        showModal={openModal}
        setShowModal={setopenModal}
        showConfirmButton={!justShow}
        textConfirmButton={'Guardar'}
        onCancel={()=>{
          setDetailProduct("")
          setopenModal(false)
        }}
        onConfirm={()=>{
          updateNotes(singleProduct.uuid || "", detailProduct)
          setDetailProduct("")
          setopenModal(false)
        }}
        nodeContent={<>
          <CView style={{flex:2, width:"100%", gap:10, padding:10}}>
            <CView style={{flex:1}}>
              <CText>Ingrese los detalles del producto</CText>
            </CView>
            <CView>
              <CInputText label="Detalle" 
              fontSize={20}
              value={detailProduct}
              onChangeText={(text)=>setDetailProduct(text)}
              multiline={true} numberOfLines={6}
              height={40} 
              disabled={justShow}/>
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
  nameProduct: {flex:1,  fontSize:25, paddingVertical:3},


})
