import React, { useEffect } from "react";
import { CView } from "../CView";
import { TouchableOpacity, useColorScheme } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
// import { Orden } from "@/interfaces";
import useOrderOperations from "@/hooks/useOrderOperations";
import { Orden } from "@/interfaces/general.interface";
import useOrderStore from "@/hooks/useOrderStore";
import ChipOrderStatus from "./ChipOrderStatus";
import dayjs from "dayjs";

type Props = {
  path?:any
  order?:Orden
  loadOrder?:boolean
};

const ItemOrderLink = ({
  path = "/orders/create-order",
  order,
  loadOrder = true
}: Props) => {
  const theme = useColorScheme()
  const text1 = "Description of order in one line qioweu qoiwu e qwe qjweqw";


  const {
    loadOrderData
  } = useOrderOperations({})
  const {
    setItems,
    setOrderDetails
  } = useOrderStore()
  
  // useEffect(()=>{
  //   if(loadOrder && order?.id_orden){
  //     loadOrderData()
  //   }
  // },[])

  const loadCurrentOrderData = async()=>{
    if (!order?.uuid) {
      return;
    }
    setItems([])
    setOrderDetails(null)

    loadOrderData(order.uuid)
    path ? router.push({ pathname: path, params: { id_orden: order.uuid } }) : alert("No hay ruta")
  }


  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderRadius:5, borderColor:"#cecece"  }}>
      <TouchableOpacity
        onPress={() => loadCurrentOrderData()}
        style={{ flex: 1, flexDirection: "row", }}
      >
        <CView style={{ flex: 5 }}>
          <CView style={{ flexDirection: "row", alignItems: "center" }}>
            <CView style={{ flex: 4, justifyContent:"flex-start" }}>
              <CText type="default" style={{ fontSize:10 }}>Orden</CText>
              <CText type="title">#{order?.numeroOrden?.toString() || "N/A"}</CText>
              <CText
                type="default"
                style={{ overflow: "hidden", textOverflow: "ellipsis", fontSize:14 }}
              >
                {order?.observaciones? order?.observaciones.slice(0, 30).concat("...") : ""}
              </CText>
            </CView>
            <CView style={{ flex:3, justifyContent:"center", alignItems:"flex-end" }}>
              <ChipOrderStatus fontSize={10} estado={order?.estado as any || "PENDIENTE"} />
              <CText type="subtitle" style={{ fontSize:14 }}>Mesa: 1</CText>
              <CText type="subtitle" style={{ fontSize:14 }}>{dayjs(order?.createdAt).format("DD-MM-YYYY HH:mm")}</CText>
            </CView>
          </CView>
        </CView>
        <CView
          style={{
            flex: .5,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons name="chevron-forward-outline" size={30} color={theme === "dark" ? "white" : "black"} />
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemOrderLink;
