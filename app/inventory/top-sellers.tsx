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
import { SegmentedButtons } from 'react-native-paper';
import DetailTopSeller from '@/components/inventory/DetailTopSeller'

type Props = {}

const CreateProductScreen = (props: Props) => {
    const {productname} = useLocalSearchParams()
    const db = useSQLiteContext();
    
    const [todos, setTodos] = useState<any[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const [switchEnvioGratis, setSwitchEnvioGratis] = useState(false);
    const [segmentedButtonValue, setSegmentedButtonValue] = useState('today');


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



    useEffect(() => {
        switch (segmentedButtonValue) {
            case 'today':
                async function setup() {
                const result = await db.getAllAsync<any>('SELECT * FROM platos');
                    setTodos(result);
                }
                setup();
                break;
            case 'week':
                setTodos([]);
                break;
            case 'month':
                setTodos([{
                    nombre:"Producto 1",
                    precio:10,
                    stock:24,
                    vendido:24
                }]);
                break;
            default:
                break;
        }
    }, [segmentedButtonValue]);


    return (
        <CContainerView style={{flex:1}}>
            
            <CText type="title" style={{textAlign:"center", paddingVertical:5}}>
                Productos Más Vendidos
            </CText>
            <CView style={{flex:8, padding:10}}>
                <ScrollView style={{flex:8, padding:10, gap:10}}>
                    {
                        todos.length > 0 ?
                        todos.map((item,key)=>{
                            return (
                                <DetailTopSeller
                                    product={item}
                                    key={`${item.name||"item"}+${key}`}
                                />
                            )
                            // <TouchableOpacity key={key} onPress={async()=>{
                            //         const dataPressed:any =  await db.getFirstAsync('SELECT * FROM platos where id=?',[item.id]);
                            //         console.log({dataPressed})
                            //         alert(`Boton presionado: ${dataPressed?.nombre}`)
                            //     }}>
                            //         <CText>{item.nombre||"nada"}</CText>
                            // </TouchableOpacity>
                            
                        })
                        :
                        <CText>No hay resultados</CText>
                    }
                </ScrollView>    
            </CView>
            <SegmentedButtons
                style={{marginVertical:5, padding:10}}
                value={segmentedButtonValue}
                onValueChange={setSegmentedButtonValue}
                buttons={[
                    { value: 'today', label: 'Hoy' },
                    { value: 'week', label: 'Semana' },
                    { value: 'month', label: 'Mes' },
                ]}
            />
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