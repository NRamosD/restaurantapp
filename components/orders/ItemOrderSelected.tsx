import { Product } from '@/interfaces'
import { CView } from '../CView'
import { CText } from '../CText'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AddReduceButton from '../ui/AddReduceButton'
import useOrderStore from '@/hooks/useOrderStore'

type Props = {
    singleProduct: Product
    removeItem?: (product:Product)=>void
}

const ItemOrderSelected = ({
    singleProduct,
    removeItem
}: Props) => {
  const {getQuantity} = useOrderStore();
  // console.log({singleProduct})

  return (
    <CView key={`singleProduct-selected-${singleProduct.uuid}`}
    style={style.container}>
        <CView style={{flex:8}}>
          <CText style={style.nameProduct}>
          {singleProduct.nombre}
          </CText>
          <CView style={{flex:1}}>
            <CText>Por unidad: ${singleProduct.precio}</CText>
            <CText style={{textAlign:"center"}}>Total: ${(singleProduct.precio*getQuantity(singleProduct.uuid)).toFixed(2)}</CText>
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
    height:110,
    boxShadow: "2px 3px 2px gray",
    borderWidth:2,
    borderColor:"gray",
    borderRadius: 10
  },
  nameProduct: {flex:1,  color:"black", fontSize:20},


})