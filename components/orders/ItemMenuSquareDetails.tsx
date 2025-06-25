import React from "react";
import { CView } from "../CView";
import { StyleSheet, TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { Products } from "@/interfaces/products";
import { Link, router } from 'expo-router';

type Props = {
  data:Products
};

const ItemMenuSquareDetails = ({
  data
}: Props) => {

  return (
    <CView style={styles.containerItem}>
      <TouchableOpacity
        // onPress={() => alert("se fue al detalle del registro")}
        // <Link href={"/inventory/:tomate"}>Veamos el tomate</Link>
        onPress={() => router.navigate(`inventory/:${data.name}`)}
        style={{ flex: 1 }}
      >
        <CView style={styles.containerImgText}>
          <CView style={{width:100, height:100, backgroundColor:"orange"}}></CView>
          <CText numberOfLines={1} type="subtitle">
            {data.name||"Nombre de plato"}
          </CText>
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemMenuSquareDetails;


const styles = StyleSheet.create({
  containerItem : { padding: 10, marginVertical: 5, borderWidth:3, 
    borderColor:"#cecece", borderRadius:5, width:180 },
  containerImgText : { flex:1, alignItems:"center" },

})