import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { SegmentedButtons } from 'react-native-paper';
import DetailTopSeller from '@/components/inventory/DetailTopSeller'
import { getTopSellingProducts } from '@/db/order_product.operations'
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
    const db = useSQLiteContext();
    
    const [todos, setTodos] = useState<mostSellsProduct[]>([]);
    const [segmentedButtonValue, setSegmentedButtonValue] = useState('today');




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
                                    producto={item}
                                    position={key}
                                    key={`${item.nombre||"item"}+${key}`}
                                />
                            )
                            
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