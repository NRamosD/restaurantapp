import { CButton, CText, CView } from '@/components'
import React from 'react'
import { router, useRouter } from 'expo-router'
import CInputText from '@/components/CInputText'
import { useAuthStore } from '@/hooks/useAuthStore'

type Props = {}

const LoginScreen = ({
    
}: Props) => {
  const {login} = useAuthStore()
  return (<>
  <CView style={{flex:1, gap:10}}>
    <CText>LoginScreen</CText>
    <CView style={{flex:1, gap:10}}>
        <CInputText label="Correo" placeholder="Correo"/>
        <CInputText label="Contraseña" placeholder="Contraseña"/>
    </CView>
    <CButton title="Iniciar Sesión" onPress={() => {
        login('','')
        router.dismissTo('/')
    }}/>
  </CView>
  </>)
}

export default LoginScreen