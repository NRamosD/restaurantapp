import { CButton, CContainerView, CText, CView } from '@/components'
import React, { useState } from 'react'
import CInputText from '@/components/CInputText'
import { useAuthStore } from '@/hooks/useAuthStore'
import { TextInput } from 'react-native-paper'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { router } from "expo-router";

type Props = {}

const LoginScreen = ({
    
}: Props) => {
  const {login} = useAuthStore()
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  return (
  <CContainerView style={{flex:1, alignContent:"center", justifyContent:"center"}}>
    <CView style={{ gap:10, margin:"auto", justifyContent:"center", alignItems:"center", height:300}}>
      <CView style={{flex:1, gap:10 }}>
        <CText type="title">Bienvenido!</CText>
        {
          status && status!=="success" && <CText type="subtitle" style={{color:"red"}}>{status}</CText>
        }
        <CView style={{flex:1, gap:10}}>
          <CInputText label="Usuario o Correo" fontSize={25} style={{width:300, height:70}} value={user} 
          onChangeText={(value)=>{
            setUser(value);
            setStatus('');
          }}/>
          <CInputText label="Contraseña" fontSize={25} 
          value={pass}
          onChangeText={(value)=>{
            setPass(value);
            setStatus('');
          }}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={{width:300, height:70}}/>
          <CButton title="Iniciar" onPress={() => {
            login(user,pass).then(res => {
              if(res.status !== "success"){
                ToastAndroid.show(res.status, ToastAndroid.LONG);
                setStatus(res.status);
              }
            })
          }} containerStyles={{width:300, borderRadius:10, paddingVertical:10}}/>
          <TouchableOpacity onPress={() => { return router.push("/(auth)/register")}} 
          style={{width:300, borderRadius:10, paddingVertical:10, 
          justifyContent:"center", alignItems:"center"}}>
            <CText type="subtitle">Registrarse</CText>
          </TouchableOpacity>
        </CView>
      </CView>
    </CView>
  </CContainerView>
  )
}

export default LoginScreen