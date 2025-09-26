import React from "react";
import { CView } from "../CView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/interfaces/products";
import { router } from 'expo-router';

type Props = {
  data:Product
};

const ItemMenuSquareDetails = ({
  data
}: Props) => {

  return (
    <CView style={styles.containerItem}>
      <TouchableOpacity
        onPress={() => router.navigate(`inventory/:${data?.uuid}`)}
      >
        <CView style={styles.containerImgText}>
          <CView style={{width:"100%", height:100}}>
            <Image
                source={{ uri: data?.imagen_url ||'https://reactnative.dev/img/tiny_logo.png' }}
              style={{ width: "100%", height: "100%", objectFit:"cover", borderRadius:5 }}
            />
          </CView>
          <CText numberOfLines={1} type="defaultSemiBold">
            {data.nombre||"Nombre de plato"}
          </CText>
        </CView>
        <CView style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
          <CView style={{alignItems:"flex-start", gap:1}}>
            <CText type="defaultSemiBold" style={{fontSize:12}}>Precio</CText>
            <CText type="defaultSemiBold">${data.precio || "N/D"}</CText>
          </CView>
          <CView style={{alignItems:"flex-end", gap:1}}>
            <CText type="defaultSemiBold" style={{fontSize:12}}>Stock</CText>
            <CText type="defaultSemiBold">{!!data.ilimitado ? "Ilimitado" : data.stock || "N/D"}</CText>
          </CView>
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemMenuSquareDetails;


const styles = StyleSheet.create({
  containerItem : { padding: 10, marginVertical: 5, borderWidth:3, 
    borderColor:"#cecece", borderRadius:5, width:"45%" },
  containerImgText : { flex:1, alignItems:"center" },

})