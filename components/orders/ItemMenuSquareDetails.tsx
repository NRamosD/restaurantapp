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
  const stockLabel = data.ilimitado ? 'Ilimitado' : `${data.stock ?? 0}`;

  return (
    <CView style={styles.containerItem}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.navigate(`/inventory/${data.uuid}`)}
      >
        <CView style={styles.containerImgText}>
          <CView style={styles.imageWrapper}>
            <Image
                source={{ uri: data?.imagen_url ||'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.image}
            />
          </CView>
          <CView style={styles.badgeRow}>
            <CView style={styles.badge}>
              <Ionicons name="pricetag-outline" size={12} color="#2563eb" />
              <CText style={styles.badgeText}>{data.estado || 'disponible'}</CText>
            </CView>
          </CView>
          <CText numberOfLines={1} type="defaultSemiBold">
            {data.nombre||"Nombre de plato"}
          </CText>
          <CText numberOfLines={2} style={styles.description}>
            {data.descripcion || 'Sin descripción disponible'}
          </CText>
        </CView>
        <CView style={styles.footerRow}>
          <CView style={styles.metricBlock}>
            <CText type="defaultSemiBold" style={styles.metricLabel}>Precio</CText>
            <CText type="defaultSemiBold">${data.precio || "N/D"}</CText>
          </CView>
          <CView style={styles.metricBlockRight}>
            <CText type="defaultSemiBold" style={styles.metricLabel}>Stock</CText>
            <CText type="defaultSemiBold">{stockLabel}</CText>
          </CView>
        </CView>
      </TouchableOpacity>
    </CView>
  );
};

export default ItemMenuSquareDetails;

const styles = StyleSheet.create({
  containerItem : {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 18,
    width: "48%",
    // backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  containerImgText : { flex:1, alignItems:"flex-start", gap: 8 },
  imageWrapper: { width:"100%", height:124, borderRadius:14, overflow:'hidden', backgroundColor:'#f4f4f5' },
  image: { width: "100%", height: "100%", objectFit:"cover" },
  badgeRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-start' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eff6ff', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, color: '#2563eb', textTransform: 'capitalize' },
  description: { fontSize: 12, color: '#71717a', minHeight: 34 },
  footerRow: { flexDirection:"row", justifyContent:"space-between", marginTop: 10 },
  metricBlock: { alignItems:"flex-start", gap:1 },
  metricBlockRight: { alignItems:"flex-end", gap:1 },
  metricLabel: { fontSize:12, color: '#71717a' },
})