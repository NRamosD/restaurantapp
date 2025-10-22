import { CButton, CContainerView, CText, CView } from '@/components'
import React, { useEffect, useState } from 'react'
import CInputText from '@/components/CInputText'
import { useAuthStore } from '@/hooks/useAuthStore'
import { TextInput } from 'react-native-paper'
import { ToastAndroid, TouchableOpacity } from 'react-native'
import { router } from "expo-router";
import { getAllProfiles } from '@/database/profile.operations'
import { useSQLiteContext } from 'expo-sqlite'

type Props = {}

const LoginScreen = ({
    
}: Props) => {
  const db = useSQLiteContext();
  const {login} = useAuthStore()
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [freeUserCreated, setFreeUserCreated] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleRedirectRegister = () => {
    router.push("/(auth)/register");
  }

  useEffect(() => {
    getAllProfiles(db).then(res => {
      if(res.length > 0){
        setFreeUserCreated(true);
      }
    })
  }, [])

  return (
  <CContainerView style={{flex:1, alignContent:"center", justifyContent:"center"}}>
    <CView style={{ gap:10, margin:"auto", justifyContent:"center", height:300, width:"90%"}}>
      <CView style={{flex:1, gap:10}}>
        <CText type="title">Bienvenido!</CText>
        {
          status && status!=="success" && <CText type="subtitle" style={{color:"red"}}>{status}</CText>
        }
        <CView style={{flex:1, gap:10}}>
          <CInputText label="Usuario o Correo" fontSize={25} style={{width:"100%", height:70}} value={user} 
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
          style={{width:"100%", height:70}}/>
          <CButton title="Iniciar" onPress={() => {
            login(user,pass).then(res => {
              if(res.status !== "success"){
                ToastAndroid.show(res.status, ToastAndroid.LONG);
                setStatus(res.status);
              }
            })
          }} containerStyles={{width:"100%", borderRadius:10, paddingVertical:10}}/>
          {
            !freeUserCreated && (
              <TouchableOpacity onPress={handleRedirectRegister} 
              style={{width:"100%", borderRadius:10, paddingVertical:10, 
              justifyContent:"center", alignItems:"center"}}>
                <CText type="subtitle">Versión Gratuita</CText>
              </TouchableOpacity>
            )
          }
        </CView>
      </CView>
    </CView>
  </CContainerView>
  )
}

export default LoginScreen