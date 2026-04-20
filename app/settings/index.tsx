import { CButton, CContainerView, CText, CView } from '@/components'
import { Ionicons } from '@expo/vector-icons'
import { router } from "expo-router";
import React, { useMemo, useState } from 'react'
import { Image, SectionList, StyleSheet, TouchableOpacity } from 'react-native'
import { useAppTheme } from '@/theme'
import ThemeSettingsModal from '@/app/settings/modals/ThemeSettingsModal'
import FontSizeSettingsModal from '@/app/settings/modals/FontSizeSettingsModal'
import { fontScaleOptions, useAppearanceStore } from '@/hooks/useAppearanceStore'

type Props = {}

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
  const theme = useAppTheme();
  const themePreset = useAppearanceStore((state) => state.themePreset);
  const fontScale = useAppearanceStore((state) => state.fontScale);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);

  const fontScaleLabel = useMemo(() => {
    return fontScaleOptions.find((item) => item.scale === fontScale)?.label ?? 'Mediana';
  }, [fontScale]);

  const handlePressItem = (item: itemSectionMenu) => {
    if (item.url === '/settings/theme') {
      setShowThemeModal(true);
      return;
    }

    if (item.url === '/settings/font') {
      setShowFontModal(true);
      return;
    }

    alert(item.name + ' ' + item.url)
  }



  return (
    <CContainerView style={styles.container}>

      <CView style={[styles.header, { backgroundColor: theme.colors.brand.primary }]}>
          <CText type="title" style={{color:theme.colors.brand.onPrimary, textAlign:"center", fontSize:18}}>Configuración</CText>
          <CText style={{color:theme.colors.brand.onPrimary, fontSize:12}}>Personaliza la experiencia de tu app</CText>
      </CView>
      <CView style={styles.content}>
        <CView style={[styles.profileCard, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Image source={{uri:URL_ME}} style={{width:100, height:100, borderRadius:50}} alt="user-image"/>
          <CView>
            <CText type="title" style={{textAlign:"center", fontSize:20}}>Usuario Prueba</CText>
            <CText type="title" style={{textAlign:"center", fontSize:20}}>Rol de Usuario</CText>
          </CView>
          <CView style={styles.summaryRow}>
            <CView style={[styles.summaryChip, { backgroundColor: theme.colors.surface.muted, borderColor: theme.colors.border.muted }]}>
              <Ionicons name="color-palette-outline" size={16} color={theme.colors.icon.primary} />
              <CText>{themePreset}</CText>
            </CView>
            <CView style={[styles.summaryChip, { backgroundColor: theme.colors.surface.muted, borderColor: theme.colors.border.muted }]}>
              <Ionicons name="text-outline" size={16} color={theme.colors.icon.primary} />
              <CText>{fontScaleLabel}</CText>
            </CView>
          </CView>
        </CView>
        <SectionList
          sections={DATA_SETTINGS_MENU}
          keyExtractor={(item, index) => item.id+ "_" +item.name+ "_" + index}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={()=>handlePressItem(item)}
              style={[
                styles.rowItem,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.border.default,
                },
              ]}
            >
              <CView style={styles.rowTextBlock}>
                <CText style={{color:theme.colors.text.primary}}>{item.name}</CText>
                {item.url === '/settings/theme' && (
                  <CText style={{color:theme.colors.text.secondary}}>Tema actual: {themePreset}</CText>
                )}
                {item.url === '/settings/font' && (
                  <CText style={{color:theme.colors.text.secondary}}>Tamaño actual: {fontScaleLabel}</CText>
                )}
              </CView>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.icon.muted} />
            </TouchableOpacity>
          )}
          renderSectionHeader={({section: {title}}) => (
            <CText style={{color:theme.colors.text.primary, padding:10, borderRadius:10, marginBottom:5}}>{title}</CText>
          )}
        />
      </CView>
      <CView style={{flex:1, padding:10}}>
        <CButton title="Volver Inicio" onPress={()=>router.dismissTo("/")}
        textStyles={{fontSize:20}}
        containerStyles={{paddingVertical: 2, borderRadius:10, borderWidth:1, borderStyle:"solid", borderColor:theme.colors.border.default}}
        />
      </CView>
      <ThemeSettingsModal showModal={showThemeModal} setShowModal={setShowThemeModal} />
      <FontSizeSettingsModal showModal={showFontModal} setShowModal={setShowFontModal} />
      


    </CContainerView>
  )
}

export default SettingsIndex

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flex: 1.2,
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  content: {
    flex: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  profileCard: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  list: {
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  rowItem: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTextBlock: {
    gap: 4,
    flex: 1,
    backgroundColor: 'transparent',
  },
})
