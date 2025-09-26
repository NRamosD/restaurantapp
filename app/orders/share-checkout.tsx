import React, { useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Product } from "@/interfaces";
import dayjs from "dayjs";

interface ShareCheckoutProps {
    toShare: boolean,
    dataOrder?: {
        id:number,
        ci:string,
        cliente:string,
        monto:number,
        metodo_pago:string,
        fecha:string,
        items?: Partial<Product>[]
    }
    setToShare?: any
}

export default function ShareCheckout({
    toShare = true,
    dataOrder,
    setToShare
}: ShareCheckoutProps) {
  const receiptRef = useRef(null);

  const shareReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
      });
      await Sharing.shareAsync(uri);
      setToShare(false);
    } catch (error) {
      console.error("Error al compartir el comprobante:", error);
    }
  };

  useEffect(() => {
    if (toShare) {
      shareReceipt();
    }
  }, [toShare]);

  return (
    <View style={styles.container}>
      <View ref={receiptRef} style={styles.receipt}>
        {/* Logo */}
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }}
          style={styles.logo}
        />

        {/* Encabezado */}
        <Text style={styles.title}>Comprobante de Pago</Text>
        <Text style={styles.subtitle}>Bar-Restaurante El Palé</Text>
        <View style={styles.separator} />

        {/* Detalles */}
        <Text style={styles.text}>Orden: #{dataOrder?.id || (Math.random()*100000).toFixed(0)}</Text>
        <Text style={styles.text}>Cliente: { dataOrder?.cliente || "Consumidor Final"}</Text>
        <Text style={styles.text}>Monto: ${dataOrder?.monto || 0.00}</Text>
        <Text style={styles.text}>Método de Pago: {dataOrder?.metodo_pago || "Efectivo"}</Text>
        <Text style={styles.text}>Fecha: {dataOrder?.fecha || dayjs().format("DD/MM/YYYY HH:mm:ss")}</Text>

        <View style={styles.separator} />

        {/* Footer */}
        <Text style={styles.footer}>¡Gracias por su compra!</Text>
      </View>
      {
        !toShare && (
          <Button title="Compartir comprobante" onPress={shareReceipt} />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position:"absolute",
    zIndex:-10
  },
  receipt: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    alignSelf: "stretch",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  footer: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
    color: "#444",
  },
});
