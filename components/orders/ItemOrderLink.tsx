import React, { useEffect } from "react";
import { CView } from "../CView";
import { TouchableOpacity, useColorScheme } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
// import { Orden } from "@/interfaces";
import useOrderOperations from "@/hooks/useOrderOperations";
import { Orden } from "@/interfaces/general.interface";

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
  
  // useEffect(()=>{
  //   if(loadOrder && order?.id_orden){
  //     loadOrderData()
  //   }
  // },[])

  const loadCurrentOrderData = async()=>{
    if (!order?.uuid) {
      return;
    }

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
          <CText type="title">Orden #{order?.numeroOrden?.toString() || "N/A"}</CText>
          <CText
            type="default"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {order?.observaciones? order?.observaciones.slice(0, 45).concat("...") : "Sin observaciones"}
          </CText>
        </CView>
        <CView
          style={{
            flex: 1,
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
