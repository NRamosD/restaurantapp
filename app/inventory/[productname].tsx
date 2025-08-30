import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Switch, TextInput } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { useSQLiteContext } from 'expo-sqlite'

type Props = {}

const DetailedProductScreen = (props: Props) => {
    const {productname} = useLocalSearchParams()

    const [image, setImage] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState();
    const [switchEnvioGratis, setSwitchEnvioGratis] = React.useState(false);



    const onToggleSwitch = () => setSwitchEnvioGratis(!switchEnvioGratis);
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
        <ScrollView style={{flex:1, padding:10}}>
            <CView>
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
            </CView>
            <CView style={{ padding:5, justifyContent:"center", gap:5, marginVertical:5}}>
                    <Image style={style.imgComponent} 
                    source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}/>
                    <CButton containerStyles={style.btnStyle} title='Subir Imagen' onPress={pickImage}/>

            </CView>
            <CView style={{ gap:10, marginBottom:20, padding:10}}>
                {/* <CText type="title">
                    {`Detalles de ${productname}`}
                </CText> */}
                <CView>
                    <CInputText label={"Nombre"} placeholder='Escriba aquí el nombre' />
                </CView>
                <CView>
                    <CInputText label={"Descripción"} 
                    placeholder='Escriba aquí la descripción' 
                    multiline/>
                    
                </CView>
                <CView>
                    <CInputText label={"Precio"} optionText='number'
                    keyboardType="numeric"
                    placeholder='Escriba aquí el precio' />
                </CView>
                <CText style={{paddingHorizontal:2}}>Categoría</CText>
                <CView style={{borderWidth:2, borderCurve:"circular", borderColor:"#cacacaff", borderRadius:5}}>
                    {/* <CInputText label={"Categoría"} placeholder='Escriba aquí la categoría' /> */}
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCategory(itemValue)
                        }
                    >
                        <Picker.Item label="Java" value="java" />
                        <Picker.Item label="JavaScript" value="js" />
                    </Picker>
                </CView>
                <CView>
                    <CInputText label={"Subcategoría"} placeholder='Escriba aquí la subcategoría' />
                </CView>
                <CView>
                    <CInputText label={"Imagen URL"} placeholder='Escriba aquí la URL de la imagen' />
                </CView>
                <CView>
                    <CInputText label={"Galería"} placeholder='Escriba aquí las URLs de la galería' />
                </CView>
                <CView>
                    <CInputText label={"Video URL"} placeholder='Escriba aquí la URL del video' />
                </CView>
                <CView>
                    <CInputText label={"Descuento"} placeholder='Escriba aquí el descuento (%)' 
                    keyboardType="numeric"
                    />
                </CView>
                <CView>
                    <CInputText label={"Precio Anterior"} placeholder='Escriba aquí el precio anterior' 
                    keyboardType="numeric"
                    />
                </CView>
                <CView style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                    <CText style={{paddingHorizontal:2, flex:1}}>Envío Gratis</CText>
                    <Switch value={switchEnvioGratis} onValueChange={onToggleSwitch} style={{flex:3, alignSelf:"center"}}/>
                </CView>
                <CView>
                    <CInputText label={"Relacionados"} placeholder='Escriba los IDs o nombres relacionados' />
                </CView>

            </CView>
            <CView>
                <CButton containerStyles={{marginBottom:40, backgroundColor:"orange", borderRadius:10}} title='Guardar'/>
            </CView>
        </ScrollView>
    )
}

export default DetailedProductScreen

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