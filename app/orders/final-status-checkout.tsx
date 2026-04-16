import { CButton, CContainerView, CText, CView } from '@/components'
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import ShareCheckout from './share-checkout';
import useOrderStore from '@/hooks/useOrderStore';
import CInputText from '@/components/CInputText';
import GenericModal from '@/components/ui/GenericModal';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

type Props = {}

const FinalStatusCheckout = ({
  
}: Props) => {
  // const {id_orden} = useLocalSearchParams<{ id_orden: string }>()
  const [toShare, setToShare] = useState(false);
  const [toSave, setToSave] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null | undefined>(null);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const theme = useAppTheme();

  const {
    orderDetails,
    items,
  } = useOrderStore()

  const handleOpenNotes = (notes: string | null | undefined) => {
    setSelectedNotes(notes);
    setOpenNotesModal(true);
  };


  return (
    <CContainerView style={{flex:1, justifyContent:"center"}}>

      <CView style={{flex:7, gap:15, paddingHorizontal:10 }}>
        <CView style={{flex:1, justifyContent:"flex-end"}}>
          <CText type="title" style={{ fontSize:24, textAlign:"center"}}>La orden ha sido facturada!</CText>
          <CText type="title" style={{ fontSize:20, textAlign:"center"}}>Orden #{orderDetails?.orden?.numeroOrden}</CText>
        </CView>
        <CView style={{flex:3}}>
          <CText type="title" style={{ fontSize:20, textAlign:"center", marginBottom:10}}>Detalle de Productos</CText>
          <CView style={styles.tableContainer}>
            <CView style={[styles.tableRow, styles.tableHeader]}>
              <CView style={[styles.cell, styles.numberCell]}>
                <CText style={styles.headerText}>#</CText>
              </CView>
              <CView style={[styles.cell, styles.nameCell]}>
                <CText style={styles.headerText}>Producto</CText>
              </CView>
              <CView style={[styles.cell, styles.quantityCell]}>
                <CText style={styles.headerText}>Cant.</CText>
              </CView>
              <CView style={[styles.cell, styles.subtotalCell]}>
                <CText style={styles.headerText}>Subtotal</CText>
              </CView>
              <CView style={[styles.cell, styles.notesCell]}>
                <CText style={styles.headerText}>Notas</CText>
              </CView>
            </CView>
            <ScrollView style={styles.tableBody} contentContainerStyle={styles.tableBodyContent}>
              {items.map((item, index) => (
                <CView key={item.uuid} style={styles.tableRow}>
                  <CView style={[styles.cell, styles.numberCell]}>
                    <CText style={styles.bodyText}>{index + 1}</CText>
                  </CView>
                  <CView style={[styles.cell, styles.nameCell]}>
                    <CText style={styles.bodyText}>{item.producto?.nombre || 'Producto'}</CText>
                  </CView>
                  <CView style={[styles.cell, styles.quantityCell]}>
                    <CText style={styles.bodyText}>{item.cantidad}</CText>
                  </CView>
                  <CView style={[styles.cell, styles.subtotalCell]}>
                    <CText style={styles.bodyText}>${(item.subtotal ?? (item.precioUnitario ?? 0) * (item.cantidad ?? 0)).toFixed(2)}</CText>
                  </CView>
                  <CView style={[styles.cell, styles.notesCell]}>
                    {item.notas ? (
                      <TouchableOpacity onPress={() => handleOpenNotes(item.notas)}>
                        <Ionicons name="eye" size={28} color={theme.colors.icon.primary} />
                      </TouchableOpacity>
                    ) : (
                      <CText style={styles.naText}>N/A</CText>
                    )}
                  </CView>
                </CView>
              ))}
            </ScrollView>
          </CView>
        </CView>
        <CView style={{flex:1}}>
          <CText type="title" style={{ fontSize:20, textAlign:"center"}}>Observaciones de la Orden</CText>
          <CInputText
            label=""
            value={orderDetails?.orden?.observaciones || "No hay observaciones"}
            onChangeText={() => {}}
            disabled multiline={true} height={100}
          />
        </CView>
      </CView>
      <CView style={{flex:2, justifyContent:"center", paddingHorizontal:10, gap:10}}>
        <CView style={{flexDirection:"row", gap:10}}>
          <CView style={{flex:1}}>
            <CButton containerStyles={styles.touchableCreate} textStyles={{fontSize:14}} onPress={()=>setToSave(true)} title={"Guardar Comprobante"}/>
          </CView>
          <CView style={{flex:1}}>
            <CButton containerStyles={styles.touchableCreate} textStyles={{fontSize:14}} onPress={()=>setToShare(true)} title={"Compartir"}/>
          </CView>
        </CView>
        <CButton containerStyles={styles.touchableCreate} textStyles={{fontSize:18}} onPress={()=>router.dismissTo("/")} title={"Inicio"}/>
      </CView>

      <ShareCheckout toShare={toSave} action="save" orderDetails={orderDetails} setToShare={setToSave}/>
      <ShareCheckout toShare={toShare} action="share" orderDetails={orderDetails} setToShare={setToShare}/>
      <GenericModal
        showModal={openNotesModal}
        setShowModal={setOpenNotesModal}
        showConfirmButton={false}
        textCloseButton='Cerrar'
        title="Notas del Producto"
        nodeContent={
          <CText style={{fontSize:18}}>{selectedNotes || 'N/A'}</CText>
        }
        withButton={false}
      />
    </CContainerView>
  )
}

export default FinalStatusCheckout

const styles = StyleSheet.create({
  touchableCreate:{
    padding:5,
    textAlign:"center",
    justifyContent:"center",
    borderRadius:10,
    height:60,
    borderWidth:5,
    borderColor:"#cecece"
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cecece',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#1c1c1c',
  },
  tableBody: {
    flex: 1,
  },
  tableBodyContent: {
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    minHeight: 56,
    alignItems: 'center',
  },
  cell: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cecece',
    alignSelf: 'stretch',
  },
  numberCell: {
    flex: 0.7,
  },
  nameCell: {
    flex: 2.2,
    alignItems: 'flex-start',
  },
  quantityCell: {
    flex: 1,
  },
  subtotalCell: {
    flex: 1.4,
  },
  notesCell: {
    flex: 1,
    borderRightWidth: 0,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  naText: {
    fontSize: 14,
    opacity: 0.7,
  },
})