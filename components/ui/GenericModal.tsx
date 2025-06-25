import React from 'react'
import { Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CView } from '../CView';
import { CText } from '../CText';
type Props = {
    title?:string
    textContent?:string
    nodeContent?:React.ReactNode
    withButton?: boolean;
    showConfirmCancel?: boolean;
    textOpenButton?: string;
    textConfirmButton?: string;
    textCloseButton?: string;
    showModal?: boolean;

    onConfirm?: () => void
    setShowModal:  React.Dispatch<React.SetStateAction<boolean>>
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
    showConfirmCancel=true,
    textOpenButton,
    textConfirmButton,
    textCloseButton,
    showModal,
    onConfirm,
    setShowModal
}: Props) => {
    // const [showModal, setShowModal] = useState(false)

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
            <Modal
                transparent
                animationType="fade"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <CView style={styles.modalOverlay}>
                <CView style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title||"Título del Modal"}</Text>
                    {
                        textContent &&
                        <Text style={styles.modalText}>{textContent}</Text>
                    }
                    {
                        nodeContent &&
                        <CView>
                            {nodeContent}    
                        </CView>
                    }
                    {
                        showConfirmCancel?
                        <CView style={styles.confirmCancelButtons}>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>{textCloseButton||"Cerrar"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                onConfirm && onConfirm()
                                setShowModal(false)
                            }} style={styles.confirmButton}>
                                <Text style={styles.closeButtonText}>{textConfirmButton||"Confirmar"}</Text>
                            </TouchableOpacity>
                        </CView>
                        :
                        <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>{textCloseButton||"Cerrar"}</Text>
                        </TouchableOpacity>
                    }
                </CView>
                </CView>
            </Modal>
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
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  openButtonText: {
    color: 'white',
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
    padding: 20,
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
