import { CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import { ItemOrderSelected } from '@/components/orders'
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react'
import { BackHandler, FlatList, Keyboard, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import ItemOrderOptionSquare from '@/components/orders/ItemOrderOptionSquare'
import useOrderStore from '@/hooks/useOrderStore'
import { useOrdenService, useProductoService } from '@/modules'
import { Producto } from '@/interfaces/general.interface';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import GenericModal from '@/components/ui/GenericModal';
import useOrderOperations from '@/hooks/useOrderOperations';
import { OrdenTipo } from '@/modules/orden/orden.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Producto } from '@/modules/producto/producto.service'

type Props = {}
type dataType = {id:string, name:string}
type OrderType = 'LOCAL' | 'LLEVAR' | 'DELIVERY'
type OrderStatus = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'COMPLETADO' | 'CANCELADO'

const orderTypeOptions = [
  { value: 'LOCAL', label: 'Local' },
  { value: 'LLEVAR', label: 'Llevar' },
  { value: 'DELIVERY', label: 'Delivery' },
];

const orderStatusOptions = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_PREPARACION', label: 'En preparación' },
  { value: 'LISTO', label: 'Listo' },
  { value: 'ENTREGADO', label: 'Entregado' }
];

const CreateOrder = ({
  
}: Props) => {
  const {id_orden} = useLocalSearchParams<{ id_orden: string }>()
    const theme = useAppTheme()
    const colorTheme = theme.components.button["primary"]
  const insets = useSafeAreaInsets();

  //state
  const [ indexView, setIndexView ] = useState(0)
  const [dataProducts, setDataProducts] = useState<Producto[]>([]);
  const [productsList, setProductsList] = useState<Producto[]>([]);
  const [textSearchedItem, setTextSearchedItem] = useState<string>("");
  const [debouncedTexto, setDebouncedTexto] = useState(textSearchedItem);
  const [orderType, setOrderType] = useState<OrdenTipo>('LOCAL');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('PENDIENTE');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [openModalObservaciones, setOpenModalObservaciones] = useState<boolean>(false);
  const [observacionOrden, setObservacionOrden] = useState<string>("");
  
  //store
  const {
    orderDetails,
    items,
    addItem,
    removeItem,
    clearOrder,
    getTotal,
  } = useOrderStore();

  //hooks
  const { obtenerProductosDisponibles } = useProductoService()
  const { crearOrden, agregarProductoAOrden, sincronizarProductosDeOrden, cambiarEstadoOrden } = useOrdenService()
  const { loadOrderData } = useOrderOperations({})
  const { user } = useAuthStore()
  

  const addProductToOrder = (product:Producto) => {
    addItem(product)
    setTextSearchedItem("")
  }

  const handleBlurSearch = () => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
  };

  const decideHowToProccess = async () => {
    if(!!id_orden){
      await sincronizarProductosDeOrden(id_orden, items.map((item) => ({
        uuid: item.uuid,
        productoUuid: item.productoUuid || item.producto?.uuid || '',
        cantidad: item.cantidad ?? 1,
        notas: item.notas ?? undefined,
      })), observacionOrden || undefined, orderType)

      await cambiarEstadoOrden(id_orden, orderStatus)
    }else{
      const createdOrder = await crearOrden({
        usuarioUuid: user?.uuid || "5fe15cbe-08a5-4832-862d-720655cc0403",
        clienteUuid: undefined,
        tipo: orderType,
        observaciones: observacionOrden || undefined,
      })

      if (orderStatus !== 'PENDIENTE') {
        await cambiarEstadoOrden(createdOrder.uuid, orderStatus)
      }

      for (const item of items) {
        const productoUuid = item.productoUuid || item.producto?.uuid;
        if(!productoUuid) continue;
        await agregarProductoAOrden({
          ordenUuid: createdOrder.uuid,
          productoUuid,
          cantidad: item.cantidad ?? 1,
          notas: item.notas ?? undefined,
        })
      }
    }
  }



  useEffect(() => {
    (async () => {
      const products = await obtenerProductosDisponibles()
      setDataProducts(products)
      setProductsList(products)

      if (id_orden) {
        await loadOrderData(id_orden)
      }
    })()

  }, [id_orden]);

  useEffect(() => {
    if (!orderDetails?.orden) return;

    if (orderDetails.orden.tipo) {
      setOrderType(orderDetails.orden.tipo as OrderType);
    }

    if (orderDetails.orden.estado) {
      setOrderStatus(orderDetails.orden.estado as OrderStatus);
    }

    setObservacionOrden(orderDetails.orden.observaciones || "");
  }, [orderDetails?.orden]);

  // useEffect(() => {
  //   if(!!textSearchedItem){

  //     const filteredSearched = dataProducts?.filter(x=>{
  //       if(x.nombre.toLowerCase().includes(textSearchedItem.toLowerCase())){
  //         return x
  //       }
  //     })
  //     console.log("filteredSearched", filteredSearched)
  //     setProductsList(filteredSearched)
  //   }else{
  //     setProductsList(dataProducts)
  //   }
  // }, [textSearchedItem]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTexto(textSearchedItem);
    }, 500);

    return () => clearTimeout(timeout);
  }, [textSearchedItem]);

  useEffect(() => {
    if (debouncedTexto) {
      if(!!textSearchedItem){
        const filteredSearched = dataProducts?.filter(x=>{
          if(x.nombre.toLowerCase().includes(textSearchedItem.toLowerCase())){
            return x
          }
        })
        console.log("filteredSearched", filteredSearched)
        setProductsList(filteredSearched)
      }else{
        setProductsList(dataProducts)
      }
    }else{
      setProductsList(dataProducts)
    }
  }, [debouncedTexto]);



  return (
    <CContainerView key={indexView} style={{flex:1}} avoidKeyboard={true}>
      {!isSearchFocused && (
      <CView style={{flex:2, flexDirection:"row", backgroundColor:"#000000", justifyContent:"center", alignItems:"center", height:20 }}>
        <CText type="subtitle" style={{flex:1, textAlign:"left", color:"white", paddingHorizontal:10, fontSize:20}}>{id_orden ? "Editar" : "Nuevo"} Pedido</CText>
        <CText type="subtitle" style={{flex:1, textAlign:"right", color:"white", paddingHorizontal:10, fontSize:16}}>Total: ${getTotal().toFixed(2)}</CText>
      </CView>
      )}
      <CView style={{flex:12, flexDirection:"row", zIndex:0, overflow:'hidden'}}>
        <FlatList<any> 
          data={items || []}
          renderItem={({item}) => <ItemOrderSelected singleProduct={item} removeItem={(productoUuid)=>removeItem(productoUuid)} /> }
          keyExtractor={item => item.uuid}
          style={{height:"100%", width:"100%"}}
        />
      </CView>

      <CView style={{flex: 5, flexDirection:"row", gap:15,
        justifyContent:"flex-start", alignItems:"center", borderWidth:1, borderColor:"#cecece"}}>
          <FlatList<Producto>
            keyboardShouldPersistTaps="handled" 
            data={productsList.filter(x=>!items.find(y=>y.productoUuid==x.uuid))}
            horizontal={true}
            keyExtractor={item => item.uuid}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ItemOrderOptionSquare singleProduct={item} touchAction={()=>{
              addProductToOrder(item)
              setTextSearchedItem("")
              setDebouncedTexto("")
            }}/>}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
      </CView>
      {!isSearchFocused && (
        <CView style={{flex:1.5, flexDirection:"row", justifyContent:"center", paddingHorizontal:10, gap:8}}>
          <CView style={{flex:1}}>
            <CView style={styles.pickerWrapper}>
              <Picker
                  selectedValue={orderType}
                  onValueChange={(value) => setOrderType(value as OrderType)}
                  style={styles.picker}
                >
                {orderTypeOptions.map((option) => (
                  <Picker.Item style={{backgroundColor: theme.colors.surface.background, color:theme.colors.text.primary}} key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </CView>
          </CView>
          <CView style={{flex:1}}>
            {/* <CText type="defaultSemiBold">Estado de la orden</CText> */}
            <CView style={styles.pickerWrapper}>
              <Picker
                selectedValue={orderStatus}
                onValueChange={(value) => setOrderStatus(value as OrderStatus)}
                style={styles.picker}
              >
                {orderStatusOptions.map((option) => (
                  <Picker.Item style={{backgroundColor: theme.colors.surface.background, color:theme.colors.text.primary}} key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </CView>
          </CView>
        </CView>
      )}
      <CView style={{flex:isSearchFocused?3:2, paddingHorizontal:10, justifyContent:"center", flexDirection:"row" }}>
        <CView style={{flex:7}}>
          <CInputText label={"Ingresa el producto a buscar..."} value={textSearchedItem} 
            onFocus={()=>setIsSearchFocused(true)}
            onBlur={()=>setTimeout(() => {
              setIsSearchFocused(false);
              setIndexView(prev=>prev+1);
              Keyboard.dismiss();
            }, 150)}
            // onPress={()=>setIsSearchFocused(true)}
            onChangeText={(val)=>setTextSearchedItem(val)} style={{flex:1}} />
        </CView>
        <CView style={{flex:1, justifyContent:"center", alignItems:"center"}}>
          <TouchableOpacity onPress={()=>setOpenModalObservaciones(true)}>
            <Ionicons name="eye" size={28} color={colorTheme.backgroundColor} />
          </TouchableOpacity>
        </CView>
      </CView>
      {/* {!isSearchFocused && ( */}
      <CView
        style={{
          flex: 2,
          flexDirection: "row",
          gap: 10,
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingTop: 6,
        }}
      >
      
          <TouchableOpacity style={styles.orderButton} onPress={()=>{
            clearOrder()
            router.dismissTo({pathname:"/"})
          }}>
            <CText type="subtitle">Inicio</CText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={async()=>{
            if(items.length==0){
              ToastAndroid.show("No se añadieron productos", ToastAndroid.LONG)
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
              await decideHowToProccess()
              router.push({pathname:"/orders/checkout", params:{id_orden:id_orden??"", review_order:"0"}})
            }}
          >
            <CText type="subtitle">Ir a Pagar</CText>
          </TouchableOpacity>
      </CView>
      {/* )} */}



      <GenericModal
        title={"Observaciones sobre el Pedido"}
        showModal={openModalObservaciones}
        setShowModal={setOpenModalObservaciones}
        // showConfirmButton={!justShow}
        textConfirmButton={'Guardar'}
        onCancel={()=>{
          setOpenModalObservaciones(false)
        }}
        onConfirm={()=>{
          // updateNotes(singleProduct.uuid || "", detailProduct)
          // setDetailProduct("")
          setOpenModalObservaciones(false)
        }}
        nodeContent={<>
          <CView style={{flex:2, width:"100%", gap:10, padding:10}}>
            <CView style={{flex:1}}>
              <CText>Ingrese las observaciones para este pedido</CText>
            </CView>
            <CView>
              <CInputText label="Observaciones" 
              fontSize={18}
              value={observacionOrden}
              onChangeText={(text)=>setObservacionOrden(text)}
              multiline={true} numberOfLines={7}
              height={90}/>
            </CView>
          </CView>
        </>
        }
      />
    </CContainerView>
  )
}

export default CreateOrder


const styles = StyleSheet.create({
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cecece',
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  orderButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
  }
})

