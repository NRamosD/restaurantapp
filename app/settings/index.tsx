
import { CButton, CContainerView, CText, CView } from '@/components'
import CInputText from '@/components/CInputText'
import FloatingButton from '@/components/FloatingButton'
import { ItemOrderSelected } from '@/components/orders'
import { Ionicons } from '@expo/vector-icons'
import { router } from "expo-router";
import {useNavigation} from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { FlatList, Image, SectionList, StyleSheet, TouchableOpacity } from 'react-native'
import { Product } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid';
import ItemOrderOptionSquare from '@/components/orders/ItemOrderOptionSquare'
import CImagePicker from '@/components/CImagePicker'


type Props = {}
type dataType = {id:string, name:string}
const data:Product[] = Array.from({ length: 20 }, (_, i) => ({ 
  id: i.toString(), 
  uuid:uuidv4(),//"Producto #"+(i/2),
  nombre:"Producto #"+i,
  precio:(Math.random()*100)+ parseFloat(Math.random().toFixed(3)),
  activo:true,
  fechaCreacion:new Date(),
}) as Product );

type itemSectionMenu = {
  id:string,
  name:string,
  url:string
}
type dataSettingsMenu = {
  title:string,
  data:itemSectionMenu[]
}

const DATA_SETTINGS_MENU:dataSettingsMenu[] = [
  {
    title: "Perfil",
    data: [
      {
        id: "1",
        name: "Actualizar datos",
        url: "/settings/update-profile",
      },
      {
        id: "3",
        name: "Cambiar contraseña",
        url: "/settings/change-password",
      },
      {
        id: "4",
        name: "Plan Actual",
        url: "/settings/account-plan",
      },
      {
        id: "5",
        name: "Cerrar Sesión",
        url: "/settings/logout",
      },
    ],
  },
  {
    title: "Personalización",
    data: [
      {
        id: "1",
        name: "Tema",
        url: "/settings/theme",
      },
      {
        id: "2",
        name: "Ajustes de fuente",
        url: "/settings/font",
      },
      {
        id: "3",
        name: "Idioma",
        url: "/settings/language",
      },
      {
        id: "4",
        name: "Notificaciones",
        url: "/settings/notifications",
      },
    ],
  },
  {
    title: "Ayuda",
    data: [
      {
        id: "1",
        name: "Ayuda",
        url: "/settings/help",
      },
      {
        id: "2",
        name: "Acerca de",
        url: "/settings/about",
      },
    ],
  },

];

const URL_ME ="https://media.licdn.com/dms/image/v2/D4E03AQEwPhvZi8oeSw/profile-displayphoto-crop_800_800/B4EZhKXejYGoAI-/0/1753594326547?e=1759363200&v=beta&t=9Z7Uz3-IY3BWKF_j9D8qzRG2_CbtnC7XLsqGVtjALrY" ;

const SettingsIndex = (props: Props) => {



  return (
    <CContainerView style={{flex:1, justifyContent:"center"}}>

      <CView style={{flex:1, gap:15, justifyContent:"center", paddingHorizontal:5, alignItems:"center", backgroundColor:"#1c1c1c"}}>
          <CText type="title" style={{color:"white", textAlign:"center"}}>Configuración</CText>
      </CView>
      <CView style={{flex:10, justifyContent:"center", paddingHorizontal:10}}>
        <CView style={{justifyContent:"center", alignItems:"center", gap:5, padding:10}}>
          <Image source={{uri:URL_ME}} style={{width:100, height:100, borderRadius:50}} alt="user-image"/>
          <CView>
            <CText type="title" style={{textAlign:"center", fontSize:20}}>Nombre Completo de la persona</CText>
            <CText type="title" style={{textAlign:"center", fontSize:20}}>Mesero</CText>
          </CView>
        </CView>
        <SectionList
          sections={DATA_SETTINGS_MENU}
          keyExtractor={(item, index) => item.id+ "_" +item.name+ "_" + index}
          style={{paddingHorizontal:10}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>alert(item.name+" " +item.url)} style={{padding:10, backgroundColor:"#1c1c1c", borderRadius:10, marginBottom:5}}>
              <CText style={{color:"white"}}>{item.name}</CText>
            </TouchableOpacity>
          )}
          renderSectionHeader={({section: {title}}) => (
            <CText style={{color:"black", padding:10, borderRadius:10, marginBottom:5}}>{title}</CText>
          )}
        />
      </CView>
      <CView style={{flex:1, padding:10}}>
        <CButton title="Volver Inicio" onPress={()=>router.dismissTo("/")}
        textStyles={{fontSize:20}}
        containerStyles={{paddingVertical: 2, borderRadius:10, borderWidth:5, borderStyle:"solid", borderColor:"#cecece"}}
        />
      </CView>
      


    </CContainerView>
  )
}

export default SettingsIndex
