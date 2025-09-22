import React, { useEffect } from "react";
import { CView } from "../CView";
import { TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Orden } from "@/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import useOrderOperations from "@/hooks/useOrderOperations";
import { getOrderById } from "@/database/order.operations";
import useOrderStore from "@/hooks/useOrderStore";
import { getOrderProduct, getProductsByOrderId } from "@/database/order_product.operations";

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
  const text1 = "Description of order in one line qioweu qoiwu e qwe qjweqw";

  const dbConnection = useSQLiteContext()

  const {
    addItem
  } = useOrderStore()
  
  useEffect(()=>{
    if(loadOrder && order?.id_orden){
      loadOrderData()
    }
  },[])

  const loadOrderData = async()=>{
    const resultOrder = await getProductsByOrderId(dbConnection, order?.id_orden!)
    resultOrder.forEach(item => {
      addItem({
        ...item,
        quantity: item.cantidad
      })
    })
    path? router.push({pathname:path, params:{id_orden:order?.id_orden}}):alert("No hay ruta")    
    // addItem(resultOrder)
  }


  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderRadius:5, borderColor:"#cecece"  }}>
      <TouchableOpacity
        onPress={() => loadOrderData()}
        style={{ flex: 1, flexDirection: "row", }}
      >
        <CView style={{ flex: 5 }}>
          <CText type="title">Orden #{order?.id_orden}</CText>
          <CText
            type="default"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {text1.slice(0, 45).concat("...")}
          </CText>
        </CView>
        <CView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons name="chevron-forward-outline" size={30} />
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemOrderLink;
