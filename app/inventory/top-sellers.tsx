import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Switch, TextInput } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { useSQLiteContext } from 'expo-sqlite'

type Props = {}

const CreateProductScreen = (props: Props) => {
    const {productname} = useLocalSearchParams()

    const [image, setImage] = useState<string | null>(null);
    const [switchEnvioGratis, setSwitchEnvioGratis] = React.useState(false);



    const onToggleSwitch = () => setSwitchEnvioGratis(!switchEnvioGratis);
    
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

    const db = useSQLiteContext();
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        async function setup() {
        const result = await db.getAllAsync<any>('SELECT * FROM platos');
            setTodos(result);
        }
        setup();
    }, []);


    return (
        <CContainerView style={{flex:1}}>
            <CText type="title" style={{textAlign:"center", paddingVertical:5}}>
                Productos Más Vendidos
            </CText>
            <ScrollView style={{flex:8, padding:10}}>
                {
                    todos.map((item,key)=>{
                        return <TouchableOpacity key={key} onPress={async()=>{
                                const dataPressed:any =  await db.getFirstAsync('SELECT * FROM platos where id=?',[item.id]);
                                console.log({dataPressed})
                                alert(`Boton presionado: ${dataPressed?.nombre}`)
                            }}>
                                <CText>{item.nombre||"nada"}</CText>
                        </TouchableOpacity>
                        
                    })
                }
            </ScrollView>
            <CView style={{flex:1, padding:10}}>
                <CButton title="Volver Inicio" onPress={()=>router.dismissTo("/")}
                textStyles={{fontSize:20}}
                containerStyles={{paddingVertical: 2, borderRadius:10, borderWidth:5, borderStyle:"solid", borderColor:"#cecece"}}
                />
            </CView>
        </CContainerView>
    )
}

export default CreateProductScreen

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