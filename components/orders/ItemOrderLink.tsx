import React from "react";
import { CView } from "../CView";
import { TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  path?:any
};

const ItemOrderLink = ({
  path
}: Props) => {
  const text1 = "Description of order in one line qioweu qoiwu e qwe qjweqw";

  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderRadius:5, borderColor:"#cecece"  }}>
      <TouchableOpacity
        onPress={() => path? router.push({pathname:path||"/orders/create-order"}):alert("No hay ruta")}
        style={{ flex: 1, flexDirection: "row", }}
      >
        <CView style={{ flex: 5 }}>
          <CText type="title">Orden #223</CText>
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
