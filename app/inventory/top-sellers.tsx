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
import { getAllProducts } from '@/database/product.operations'
import { getOrdersByDateRange } from '@/database/order.operations'
import { getOrderProduct, getTopSellingProducts } from '@/database/order_product.operations'
import dayjs from 'dayjs'

type Props = {}

export type mostSellsProduct = {
    id_producto: number;
    nombre: string;
    imagen_url: string;
    veces_vendido: number;
    cantidad_total: number;
    ingreso_total: number;
}

const CreateProductScreen = (props: Props) => {
    const {productname} = useLocalSearchParams()
    const db = useSQLiteContext();
    
    const [todos, setTodos] = useState<mostSellsProduct[]>([]);
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


    async function setup(
        startDate = dayjs.utc().startOf("day").toISOString(),
        endDate = dayjs.utc().endOf("day").toISOString()
    ) {
        const result = await getTopSellingProducts(db, 10, startDate, endDate);
        setTodos(result);
    }

    useEffect(() => {
        switch (segmentedButtonValue) {
            case 'today':
                setup();
                break;
            case 'week':
                setup(dayjs.utc().startOf("day").subtract(7, "day").toISOString(), dayjs.utc().endOf("day").toISOString());
                break;
            case 'month':
                setup(dayjs.utc().startOf("day").subtract(30, "day").toISOString(), dayjs.utc().endOf("day").toISOString());
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
                                    position={key}
                                    key={`${item.nombre||"item"}+${key}`}
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
                        <CText style={{textAlign:"center"}}>No hay resultados</CText>
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
                <CButton title="Inicio" onPress={()=>router.dismissTo("/")}
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