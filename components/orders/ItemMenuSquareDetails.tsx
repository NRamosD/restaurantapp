import React from "react";
import { CView } from "../CView";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { CText } from "../CText";
import { Ionicons } from "@expo/vector-icons";
import { Products } from "@/interfaces/products";
import { router } from 'expo-router';

type Props = {
  data:Products
};

const ItemMenuSquareDetails = ({
  data
}: Props) => {
  const fallBackImage = "https://www.tipos.co/wp-content/uploads/2015/02/La-sabana-es-un-paisaje.jpg"

  return (
    <CView style={styles.containerItem}>
      <TouchableOpacity
        // onPress={() => alert("se fue al detalle del registro")}
        // <Link href={"/inventory/:tomate"}>Veamos el tomate</Link>
        onPress={() => router.navigate(`inventory/:${data.name}`)}
        style={{  }}
      >
        <CView style={styles.containerImgText}>
          <CView style={{width:"100%", height:100}}>
            <Image
              // source={{ uri: data?.image || fallBackImage }}
                source={{ uri: data?.image ||'https://reactnative.dev/img/tiny_logo.png' }}
              style={{ width: "100%", height: "100%", objectFit:"cover", borderRadius:5 }}
            />
          </CView>
          <CText numberOfLines={1} type="defaultSemiBold">
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