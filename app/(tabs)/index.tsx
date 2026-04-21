import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";


import { CText } from "@/components/CText";
import { CView } from "@/components/CView";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { TopBarWithMenu } from "@/components/TopBarWithMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CButton from "@/components/CButton";
import { Ionicons } from "@expo/vector-icons";
import { ItemOrderLink } from "@/components/orders";
import { useIsFocused } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getColors } from "@/constants/Colors";
import { useOrdenService } from "@/modules";
import useOrderStore from "@/hooks/useOrderStore";

export default function HomeScreen() {

  const colorScheme = useColorScheme()
  const isFocused = useIsFocused();
  const [orderList, setOrderList] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false);

  const { obtenerOrdenesPorEstados } = useOrdenService()
  const insets = useSafeAreaInsets()

  const { clearOrder } = useOrderStore()

  const getAllOrdersList = async () => {
    const result = await obtenerOrdenesPorEstados(["PENDIENTE", "EN_PREPARACION", "LISTO", "ENTREGADO"])
    setOrderList(result)
  }
  

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      getAllOrdersList()
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    getAllOrdersList()
  }, [isFocused]);


  return (
    <View style={{
      flex: 1,
      flexDirection:"column",
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
        <TopBarWithMenu title={"Inicio"}/>
        <CView style={{flex:4}}>
          <CText type="title" style={{fontSize:18, textAlign:"center", paddingVertical:5}}>
            Pendientes de Facturar
          </CText>
          <ScrollView style={styles.scrollView}
            bounces={true}
            alwaysBounceVertical={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {
              orderList.length === 0 ? (
                <CText type="subtitle" style={{textAlign:"center", paddingVertical:5}}>
                  No hay pedidos pendientes
                </CText>
              ) : (
                orderList.map((order, index) => (
                  <ItemOrderLink key={`pending-order-${index}`} 
                  order={order}/>
                ))
              )
            }
          </ScrollView>
        </CView>
        <View style={styles.easyAccess}>
          <CText type="title" style={{fontSize:18, textAlign:"center", paddingVertical:5}}>
            Acceso Rápido
          </CText>
          <CView style={styles.easyAccessOptionsContainer}>
            <TouchableOpacity onPress={()=>router.push({pathname:"/inventory/top-sellers"})} style={[styles.easyAccessOption,{boxShadow:`${colorScheme === "dark" ? "#000" : "#c1c1c1"} 0px 5px 5px 2px`}]}>
              <Ionicons name="heart-outline" size={40} color={getColors(colorScheme).tint}/>
              <CText type="subtitle" style={{fontSize:12}}>Más Vendidos</CText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push({pathname:"/inventory/create-product"})} style={[styles.easyAccessOption,{boxShadow:`${colorScheme === "dark" ? "#000" : "#c1c1c1"} 0px 5px 5px 2px`}]}>
              <Ionicons name="storefront-outline" size={40} color={getColors(colorScheme).tint}/>
              <CText type="subtitle" style={{fontSize:12}}>Nuevo Producto</CText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push({pathname:"/settings"})} style={[styles.easyAccessOption,{boxShadow:`${colorScheme === "dark" ? "#000" : "#c1c1c1"} 0px 5px 5px 2px`}]}>
              <Ionicons name="settings-outline" size={40} color={getColors(colorScheme).tint}/>
              <CText type="subtitle" style={{fontSize:12}}>Ajustes</CText>
            </TouchableOpacity>
          </CView>

        </View>
        <View style={styles.contNewPedido}>
          <CButton onPress={()=>{
            clearOrder()
            router.push("/orders/create-order")
          }} title={"NUEVO PEDIDO"} textStyles={{fontSize:25}} containerStyles={styles.touchableCreate}/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  touchableCreate:{
    padding:10,
    textAlign:"center",
    justifyContent:"center",
    borderRadius:10,
    height:80,
    borderWidth:5,
  },
  scrollView:{
    flex:1,
    paddingHorizontal: 5,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderBottomColor:"#ccc",
    borderTopColor:"#ccc"
  },
  easyAccessOptionsContainer:{ 
    flex:1, 
    flexDirection:"row", 
    margin:5,
    padding:5,
    borderRadius:10, 
    gap:10
  },
  easyAccessOption: { 
    flex:1, 
    justifyContent:"center", 
    alignItems:"center",
    borderRadius:5,
  },
  easyAccess: {
    flex:1.5,
    padding:5,
  },
  contNewPedido: {
    flex:1, 
    paddingHorizontal:10, 
    paddingVertical:5,
    justifyContent:"center"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

