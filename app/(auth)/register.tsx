import React, { useState } from 'react'
import { CButton, CContainerView, CView } from '@/components'
import { CText } from '@/components'
import CInputText from '@/components/CInputText'
import { Perfil } from '@/interfaces'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import { createProfile } from '@/database/profile.operations'
import { useSQLiteContext } from 'expo-sqlite'
import { uuid } from '@/assets/utils/uuid'
import { hashPassword } from '@/assets/utils/hash_pass'
import { TextInput } from 'react-native-paper'
import { ToastAndroid } from 'react-native'
type Props = {}

const RegisterScreen = ({
    
}: Props) => {
  const color = useColorScheme()
  const db = useSQLiteContext();
  const [formStatus, setFormStatus] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [formData, setFormData] = useState<Partial<Perfil> & {password_perfil2: string}>({
    correo: '', 
    telefono: '', 
    nombre_perfil: '', 
    password_perfil: '',
    password_perfil2: '',
    tipo_negocio: '',
  });
  const handleInputChange = (field: keyof Perfil | 'password_perfil2', value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      return newData;
    });
  };
  const handleSaveProduct = async() => {
    if(Object.values(formData).some(value => value === '')){
      ToastAndroid.show("Todos los campos son obligatorios", ToastAndroid.LONG);
      setFormStatus(true);
      return;
    }
    if(formData.password_perfil !== formData.password_perfil2){
      ToastAndroid.show("Las contraseñas no coinciden", ToastAndroid.LONG);
      setFormStatus(true);
      return;
    }
    await createProfile(db, {
      ...formData,
      uuid: uuid(),
      tipo_perfil: "admin",
      password_perfil: await hashPassword(formData.password_perfil!),
    })
    router.dismissTo("/(auth)/login")
  };
  return (
    <CContainerView style={{flex:1, alignContent:"center", justifyContent:"center"}}>
      <CText type="title" style={{textAlign:"center"}}>Registra tus datos!</CText>
      <CView style={{ flex: 3, justifyContent: "center" }}>
        <CView style={{ gap: 0, padding: 20, }}>
        <CInputText 
          label={"Nombre"} fontSize={25}
          placeholder='Escriba aquí el nombre'
          value={formData.nombre_perfil}
          outlineColor={formStatus ? "red" : "#CFAE70"}
          style={{height:70}}
          onChangeText={(text) => handleInputChange('nombre_perfil', text)}/>
        <CInputText 
          label={"Correo"} fontSize={25} 
          placeholder='Escriba aquí el correo'
          outlineColor={formStatus ? "red" : "#CFAE70"}
          keyboardType="email-address"
          value={formData.correo}
          style={{height:70}}
          onChangeText={(text) => handleInputChange('correo', text)}/>
        <CInputText 
          label={"Telefono"} fontSize={25}
          placeholder='Escriba aquí el telefono'
          keyboardType="number-pad"
          value={formData.telefono||""}
          style={{height:70}}
          onChangeText={(text) => handleInputChange('telefono', text)}/>
        <CInputText label="Contraseña" fontSize={25} 
          value={formData.password_perfil}
          outlineColor={formStatus ? "red" : "#CFAE70"}
          onChangeText={(value)=>{
            handleInputChange('password_perfil', value);
          }}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={{height:70}}/>
        <CInputText label="Confirmar Contraseña" fontSize={25} 
          value={formData.password_perfil2}
          outlineColor={formStatus ? "red" : "#CFAE70"}
          onChangeText={(value)=>{
            handleInputChange('password_perfil2', value);
          }}
          secureTextEntry={secureTextEntry2}
          right={
            <TextInput.Icon
              icon={secureTextEntry2 ? 'eye-off' : 'eye'}
              onPress={() => setSecureTextEntry2(!secureTextEntry2)}
            />
          }
          style={{height:70}}/>
        <Picker
          selectedValue={formData.tipo_negocio}
          onValueChange={(itemValue) => {
              handleInputChange('tipo_negocio', itemValue);
          }}
          style={{color: Colors[color ?? 'light'].text, height:70, borderWidth: 5, marginHorizontal: 10}}
        >
          <Picker.Item label="Escoja el tipo de negocio" value="" style={{fontSize:25}}/>
          <Picker.Item label="Restaurante" value="restaurante" style={{fontSize:25}}/>
          <Picker.Item label="Tienda" value="tienda" style={{fontSize:25}}/>
          <Picker.Item label="Almacen" value="almacen" style={{fontSize:25}}/>
          <Picker.Item label="Otro" value="otro" style={{fontSize:25}}/>
        </Picker>
        </CView>
      </CView>
      <CView style={{flex:1, gap:5, justifyContent:"center", padding:10, }}>
        <CButton 
        containerStyles={{borderRadius:10}} 
        textStyles={{fontSize:24, paddingVertical:0}}
        onPress={handleSaveProduct}
        title='Guardar'/>
        <CButton title="Regresar" onPress={()=>router.dismissTo("/(auth)/login")}
        textStyles={{fontSize:16, paddingVertical:0}}
        containerStyles={{borderRadius:10, paddingVertical:0, borderWidth:5, borderStyle:"solid", borderColor:"#cecece", backgroundColor:"transparent"}}/>
      </CView>
      
    </CContainerView>
  )
}

export default RegisterScreen