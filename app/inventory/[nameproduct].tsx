import { Link, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

export default function NameProductScreen() {
    const {nameproduct} = useLocalSearchParams()
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View>
            <Text>Este es el producto: {nameproduct}</Text>
            <Link href={"./modal"} style={{padding:5, margin:10, backgroundColor:"#123", color:"#fff"}}>Open Modal</Link>
            <View style={{margin:10, padding:10}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>Hello World!</Text>
                          <Pressable
                              style={[styles.button, styles.buttonClose]}
                              onPress={() => setModalVisible(!modalVisible)}>
                              <Text style={styles.textStyle}>Hide Modal</Text>
                          </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>Show Modal</Text>
                </Pressable>
            </View>
        </View>
    )
}




const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#12312344'
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 0,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });