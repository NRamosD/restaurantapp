import React from 'react'
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CView } from '../CView';
import { CText } from '../CText';
import { Button, Dialog, Divider, Portal } from 'react-native-paper';
import { useAppTheme } from '@/theme';

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
    const theme = useAppTheme()

    return (
        <CView style={styles.container}>
            {/* Botón para abrir el modal */}
            {
                withButton && setShowModal &&
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={[
                    styles.openButton,
                    {
                      backgroundColor: theme.components.button.primary.backgroundColor,
                      borderColor: theme.components.button.primary.borderColor,
                    },
                  ]}
                >
                    <CText style={[styles.openButtonText, { color: theme.components.button.primary.textColor }]}>{textOpenButton||"Abrir Modal"}</CText>
                </TouchableOpacity>
            }

            {/* Modal personalizado */}
            <Portal>
              <Dialog
                visible={showModal}
                onDismiss={hideDialog}
                style={[
                  styles.dialog,
                  {
                    backgroundColor: theme.colors.surface.card,
                    borderColor: theme.colors.border.default,
                    shadowColor: theme.colors.text.inverse,
                  },
                ]}
              >
                <Dialog.Title
                  style={[
                    styles.dialogTitle,
                    {
                      backgroundColor: theme.colors.surface.card,
                      color: theme.colors.text.primary,
                    },
                  ]}
                >
                  {title||"Título del Modal"}
                </Dialog.Title>
                <Dialog.ScrollArea
                  style={[
                    styles.dialogScrollArea,
                    {
                      backgroundColor: theme.colors.surface.card,
                      borderTopColor: theme.colors.border.muted,
                      borderBottomColor: theme.colors.border.muted,
                    },
                  ]}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.scrollContent,
                      { backgroundColor: theme.colors.surface.card },
                    ]}
                  >
                    {
                      textContent &&
                      <Text style={[styles.modalText, { color: theme.colors.text.secondary }]}>{textContent}</Text>
                    }
                    {
                      nodeContent &&
                      nodeContent    
                    }
                  </ScrollView>
                </Dialog.ScrollArea>
                <Divider style={{backgroundColor: theme.colors.border.muted}}/>
                <Dialog.Actions style={styles.actionsContainer}>
                  {showCancelButton && <Button
                    mode="outlined"
                    onPress={()=>{
                      onCancel &&onCancel()
                      hideDialog()
                    }}
                    style={[
                      styles.actionButton,
                      {
                        borderColor: theme.components.button.secondary.borderColor,
                        backgroundColor: theme.components.button.secondary.backgroundColor,
                      },
                    ]}
                    labelStyle={{fontSize:16, color: theme.components.button.secondary.textColor, fontWeight:'700'}}
                  >{textCloseButton||"Cancelar"}</Button>}
                  {showConfirmButton && <Button
                    mode="contained"
                    onPress={ ()=>{
                      onConfirm && onConfirm()
                      hideDialog()
                    }}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: theme.components.button.primary.backgroundColor,
                      },
                    ]}
                    labelStyle={{fontSize:16, color: theme.components.button.primary.textColor, fontWeight:'700'}}
                  >{textConfirmButton||"Ok"}</Button>}
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
    minWidth: 160,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialog: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 12,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: '800',
    paddingTop: 22,
    paddingBottom: 10,
  },
  dialogScrollArea: {
    height: 240,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    justifyContent: 'flex-end',
  },
  actionButton: {
    minWidth: 120,
    borderRadius: 14,
  },
});
