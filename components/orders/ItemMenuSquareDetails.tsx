import React from "react";
import { CView } from "../CView";
import { TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { Products } from "@/interfaces/products";

type Props = {
  data:Products
};

const ItemMenuSquareDetails = ({
  data
}: Props) => {

  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderColor:"#cecece"  }}>
      <TouchableOpacity
        onPress={() => alert("se fue al detalle del registro")}
        style={{ flex: 1 }}
      >
        <CView style={{ flex: 5 }}>
          <CView style={{width:100, height:100, backgroundColor:"orange"}}></CView>
          <CText type="subtitle">{data.name||"Nombre de plato"}</CText>
          
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemMenuSquareDetails;
