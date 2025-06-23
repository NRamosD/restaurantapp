import React from "react";
import { CView } from "../CView";
import { TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import ItemOrderExtended from "@/app/interfaces/orders";

type Props = {
  data:ItemOrderExtended
};

const ItemOrderExtendedLink = ({
  data
}: Props) => {

  return (
    <CView style={{ padding: 10, marginVertical: 2, borderWidth:3, borderColor:"#cecece"  }}>
      <TouchableOpacity
        onPress={() => alert("se fue al detalle del registro")}
        style={{ flex: 1, flexDirection: "row", }}
      >
        <CView style={{ flex: 5 }}>
          <CText type="title">Orden #{data.order_number}</CText>
          <CText
            type="default"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {data.details.slice(0, 45).concat("...")}
          </CText>
          <CText>`${data.date} - ${data.time}`</CText>
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
          <Ionicons name="chevron-forward-outline" size={30} />
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemOrderExtendedLink;
