import React from 'react'
import { Modal, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CView } from '../CView';
import { CText } from '../CText';
import { Button, Dialog, Divider, Portal } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme'
type Props = {
    title?:string
    textContent?:string
    nodeContent?:React.ReactNode
    withButton?: boolean;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    textOpenButton?: string;
    textConfirmButton?: string;
    textCloseButton?: string;
    showModal: boolean;
    setShowModal:  React.Dispatch<React.SetStateAction<boolean>>

    onConfirm?: () => void
    onCancel?: () => void
}
/**
 * Title: Modal genérico
 * @param { withButton?: boolean, textOpenButton?: string, showModal?: boolean, setShowModal:  React.Dispatch<React.SetStateAction<boolean>> } 
 * @returns void
 */
const GenericModal = ({
    title,
    textContent,
    nodeContent,
    withButton=false,
    showConfirmButton=true,
    showCancelButton=true,
    textOpenButton,
    textConfirmButton,
    textCloseButton,
    showModal,
    onConfirm,
    onCancel,
    setShowModal
}: Props) => {
    const hideDialog = () => setShowModal(false)
    const theme = useColorScheme()

    return (
        <CView style={styles.container}>
            {/* Botón para abrir el modal */}
            {
                withButton && setShowModal &&
                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.openButton}>
                    <CText style={styles.openButtonText}>{textOpenButton||"Abrir Modal"}</CText>
                </TouchableOpacity>
            }

            {/* Modal personalizado */}
            <Portal>
              <Dialog visible={showModal} onDismiss={hideDialog} style={{borderRadius:10, backgroundColor:theme === "dark" ? "black" : "white"}}>
                <Dialog.Title style={{backgroundColor:theme === "dark" ? "black" : "white", color:theme === "dark" ? "white" : "black"}}>{title||"Título del Modal"}</Dialog.Title>
                <Dialog.ScrollArea style={{height:200, paddingHorizontal:0, backgroundColor:theme === "dark" ? "black" : "white"}}>
                  <ScrollView contentContainerStyle={{ backgroundColor:theme === "dark" ? "black" : "white"}}>
                    {
                      textContent &&
                      <Text style={styles.modalText}>{textContent}</Text>
                    }
                    {
                      nodeContent &&
                      nodeContent    
                    }
                  </ScrollView>
                </Dialog.ScrollArea>
                <Divider/>
                <Dialog.Actions style={{gap:10}}>
                  {showCancelButton && <Button onPress={()=>{
                    onCancel &&onCancel()
                    hideDialog()
                  }} labelStyle={{fontSize:20, color:theme === "dark" ? "white" : "black"}}>{textCloseButton||"Cancelar"}</Button>}
                  {showConfirmButton && <Button onPress={ ()=>{
                    onConfirm && onConfirm()
                    hideDialog()
                  }} labelStyle={{fontSize:20, color:theme === "dark" ? "white" : "black"}}>{textConfirmButton||"Ok"}</Button>}
                </Dialog.Actions>
              </Dialog>
            </Portal>
        </CView>
    )
}

export default GenericModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    padding: 12,
    // backgroundColor: '#3498db',
    borderRadius: 6,
  },
  openButtonText: {
    // color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 5, // sombra para Android
    shadowColor: '#000', // sombra para iOS
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 6,
  },
  confirmButton:{
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 6,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmCancelButtons:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingTop:15
  }
});
