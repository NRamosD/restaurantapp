import { CButton, CContainerView, CText, CView } from '@/components'
import React, { useState } from 'react'
import { router, useRouter } from 'expo-router'
import CInputText from '@/components/CInputText'
import { useAuthStore } from '@/hooks/useAuthStore'
import { TextInput } from 'react-native-paper'

type Props = {}

const LoginScreen = ({
    
}: Props) => {
  const {login} = useAuthStore()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [password, setPassword] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  return (<>
  <CContainerView style={{flex:1}}>
    <CView style={{flex:1}}></CView>
    <CView style={{flex:2, gap:10, justifyContent:"center", alignItems:"center"}}>
      <CView style={{flex:1, gap:10 }}>
        <CText type="subtitle">Bienvenido!</CText>
        <CView style={{flex:1, gap:10}}>
            <CInputText label="Usuario o Correo" fontSize={25} style={{width:300}} value={user} onChangeText={setUser}/>
            <CInputText label="Contraseña" fontSize={25} 
            value={pass}
            onChangeText={setPass}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            style={{width:300}}/>
          <CButton title="Iniciar" onPress={() => {
              login(user,pass)
          }} containerStyles={{width:300, borderRadius:10, paddingVertical:10}}/>
        </CView>
      </CView>
    </CView>
    <CView style={{flex:1}}></CView>
  </CContainerView>
  </>)
}

export default LoginScreen