import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Button, StyleSheet, Image, Alert, Platform, ToastAndroid } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { File, Paths } from 'expo-file-system';
import { Product } from "@/interfaces";
import dayjs from "dayjs";
import { OrdenData, OrdenDetails, useOrdenService } from "@/modules/orden/orden.service";

type ReceiptAction = 'share' | 'save';

interface ShareCheckoutProps {
    toShare: boolean,
    action?: ReceiptAction,
    orderDetails: OrdenDetails | null;
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
    toShare = false,
    action = 'share',
    orderDetails,
    dataOrder,
    setToShare
}: ShareCheckoutProps) {
  const receiptRef = useRef(null);
  const [orderData, setOrderData] = React.useState<OrdenData | null>(null);
  const { obtenerOrdenConClienteYUsuario } = useOrdenService();

  const products = orderDetails?.ordenProductos || [];

  const summary = useMemo(() => {
    const subtotal = products.reduce((acc, item) => acc + Number(item.subtotal ?? 0), 0);
    const iva = products.reduce((acc, item) => acc + Number(item.iva ?? 0), 0);
    const discount = products.reduce((acc, item) => acc + Number(item.descuento ?? 0), 0);
    const total = products.reduce((acc, item) => acc + Number(item.total ?? ((item.precioUnitario ?? 0) * (item.cantidad ?? 0))), 0);

    return {
      subtotal,
      iva,
      discount,
      total,
    };
  }, [products]);

  const clienteNombre = useMemo(() => {
    if (orderData?.cliente?.nombre) return orderData.cliente.nombre;
    return dataOrder?.cliente || 'Consumidor Final';
  }, [dataOrder?.cliente, orderData?.cliente?.nombre]);

  const clienteIdentificacion = useMemo(() => {
    if (orderData?.cliente?.identificacion) return orderData.cliente.identificacion;
    return dataOrder?.ci || '9999999999';
  }, [dataOrder?.ci, orderData?.cliente?.identificacion]);

  const formattedDate = useMemo(() => {
    const rawDate = orderDetails?.orden?.createdAt || dataOrder?.fecha;

    if (!rawDate) return dayjs().format('DD/MM/YYYY HH:mm:ss');

    return dayjs(rawDate).isValid()
      ? dayjs(rawDate).format('DD/MM/YYYY HH:mm:ss')
      : String(rawDate);
  }, [dataOrder?.fecha, orderDetails?.orden?.createdAt]);

  const formatCurrency = (value: number) => `$${Number(value || 0).toFixed(2)}`;

  const showMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }

    Alert.alert('Comprobante', message);
  };

  const captureReceipt = async () => {
    return captureRef(receiptRef, {
      format: "png",
      quality: 1,
    });
  };

  const shareReceipt = async () => {
    try {
      const uri = await captureReceipt();
      await Sharing.shareAsync(uri);
      setToShare?.(false);
    } catch (error) {
      console.error("Error al compartir el comprobante:", error);
    }
  };

  const saveReceipt = async () => {
    try {
      const uri = await captureReceipt();
      const fileName = `comprobante-${orderDetails?.orden?.numeroOrden || Date.now()}.png`;

      const sourceFile = new File(uri);
      const destinationFile = new File(Paths.document, fileName);
      const fileBytes = await sourceFile.bytes();

      // Si ya existe un comprobante con ese nombre, lo eliminamos primero
      if (destinationFile.exists) {
        destinationFile.delete();
      }

      destinationFile.create({ overwrite: true });
      destinationFile.write(fileBytes);

      console.log('Comprobante guardado en:', destinationFile.uri);
      showMessage(`Comprobante guardado en: ${destinationFile.uri}`);
      setToShare?.(false);
    } catch (error) {
      console.error("Error al guardar el comprobante:", error);
      showMessage('No se pudo guardar el comprobante');
    }
  };

  const loadOrderData = async () => {
    if (orderDetails?.orden?.uuid) {
      const data = await obtenerOrdenConClienteYUsuario(orderDetails.orden.uuid);
      setOrderData(data);
    }
  };

  useEffect(() => {
    if (toShare) {
      if (action === 'save') {
        saveReceipt();
        return;
      }

      shareReceipt();
    }
  }, [action, toShare]);

  useEffect(() => {
    loadOrderData();
  }, [orderDetails?.orden?.uuid]);

  return (
    <View style={styles.container}>
      <View ref={receiptRef} style={styles.receipt}>
        <View style={styles.headerCard}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Comprobante de Venta</Text>
          <Text style={styles.subtitle}>{orderData?.usuario?.nombreNegocio || "Bar-Restaurante El Palé"}</Text>
          <Text style={styles.caption}>Documento generado desde RestaurantApp</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Orden</Text>
            <Text style={styles.infoValue}>#{orderDetails?.orden?.numeroOrden || dataOrder?.id || ''}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Pago</Text>
            <Text style={styles.infoValue}>{dataOrder?.metodo_pago || 'Efectivo'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>{orderDetails?.orden?.tipo || 'LOCAL'}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nombre</Text>
            <Text style={styles.detailValue}>{clienteNombre}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Identificación</Text>
            <Text style={styles.detailValue}>{clienteIdentificacion}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dirección</Text>
            <Text style={styles.detailValue}>{orderData?.cliente?.direccion || 'No registrada'}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Productos</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.productColumn]}>Producto</Text>
            <Text style={[styles.tableHeaderText, styles.qtyColumn]}>Cant.</Text>
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>Valor</Text>
            <Text style={[styles.tableHeaderText, styles.totalColumn]}>Total</Text>
          </View>
          {products.map((item) => {
            const unitPrice = Number(item.precioUnitario ?? 0);
            const rowTotal = Number(item.total ?? item.subtotal ?? unitPrice * Number(item.cantidad ?? 0));

            return (
              <View key={item.uuid} style={styles.tableRow}>
                <View style={styles.productColumn}>
                  <Text style={styles.productName}>{item.producto?.nombre || 'Producto'}</Text>
                  {!!item.notas && <Text style={styles.productNotes}>Nota: {item.notas}</Text>}
                </View>
                <Text style={[styles.tableCellText, styles.qtyColumn]}>{item.cantidad ?? 0}</Text>
                <Text style={[styles.tableCellText, styles.priceColumn]}>{formatCurrency(unitPrice)}</Text>
                <Text style={[styles.tableCellText, styles.totalColumn]}>{formatCurrency(rowTotal)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.separator} />

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Descuento</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.discount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>IVA</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.iva)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(orderDetails?.orden?.total ? Number(orderDetails.orden.total) : summary.total)}</Text>
          </View>
        </View>

        {!!orderDetails?.orden?.observaciones && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observaciones</Text>
              <Text style={styles.observationsText}>{orderDetails.orden.observaciones}</Text>
            </View>
          </>
        )}

        <Text style={styles.footer}>¡Gracias por su compra!</Text>
      </View>
      {
        !toShare && (
          <Button title={action === 'save' ? "Guardar comprobante" : "Compartir comprobante"} onPress={action === 'save' ? saveReceipt : shareReceipt} />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position:"absolute",
    zIndex:-10,
    width: '100%',
  },
  receipt: {
    backgroundColor: "#FFFFFF",
    width: 360,
    padding: 22,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  headerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: "#E2E8F0",
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    color: '#94A3B8',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    alignSelf: "stretch",
    marginVertical: 14,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1.4,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  productColumn: {
    flex: 2.4,
  },
  qtyColumn: {
    flex: 0.8,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1.1,
    textAlign: 'right',
  },
  totalColumn: {
    flex: 1.1,
    textAlign: 'right',
  },
  productName: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  productNotes: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  tableCellText: {
    fontSize: 13,
    color: '#0F172A',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    marginTop: 4,
    paddingTop: 10,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  observationsText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  footer: {
    fontSize: 13,
    marginTop: 14,
    fontStyle: "italic",
    color: "#475569",
    textAlign: 'center',
  },
});
