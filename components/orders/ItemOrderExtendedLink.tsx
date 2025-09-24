import React from "react";
import { CView } from "../CView";
import { TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { Orden } from "@/interfaces/orders";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = {
  data:Orden
};

const ItemOrderExtendedLink = ({
  data
}: Props) => {
  const theme = useColorScheme()

  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderColor:"#cecece", borderRadius:10  }}>
      <TouchableOpacity
        onPress={() => {
          router.push({pathname:"/orders/checkout", params:{id_orden:data.id_orden, review_order:"1"}})
        }}
        style={{ flex: 1, flexDirection: "row", }}
      >
        <CView style={{ flex: 5 }}>
          <CText type="title">Orden #{data.id_orden}</CText>
          <CText
            type="default"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {data.uuid}
          </CText>
          <CText>{dayjs(data.fecha).format("DD-MM-YYYY")} - {dayjs(data.fecha).format("HH:mm:ss")}</CText>
          {/* <CView style={{flex:1, flexDirection:"row"}}>
            <CText></CText>
          </CView> */}
        </CView>
        <CView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons name="chevron-forward-outline" size={30} color={theme === "dark" ? "white" : "black"}/>
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemOrderExtendedLink;
