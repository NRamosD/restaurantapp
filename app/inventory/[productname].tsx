import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

type Props = {}

const DetailedProductScreen = (props: Props) => {
    const {productname} = useLocalSearchParams()

      const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


    return (
        <ScrollView style={{flex:1, padding:10}}>
            <CView style={{ padding:5, justifyContent:"center", gap:5, marginVertical:5}}>
                    <Image style={style.imgComponent} 
                    source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}/>
                    <CButton containerStyles={style.btnStyle} title='Subir Imagen' onPress={pickImage}/>

            </CView>
            <CView style={{ gap:5, marginBottom:20}}>
                <CText type="title">
                    {`Detalles de ${productname}`}
                </CText>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>
                <CView>
                    <CText type="defaultSemiBold">Nombre</CText>
                    <CInputText placeholder='Escriba aquí el nombre'/>
                </CView>

            </CView>
        </ScrollView>
    )
}

export default DetailedProductScreen

const style = StyleSheet.create({
    imgComponent:{
        width:"90%",
        height: 200,
        objectFit: "cover",
        margin:"auto"
    },
    btnStyle: {
        padding:2,
        backgroundColor:"gray",
        borderRadius:5
    }
})