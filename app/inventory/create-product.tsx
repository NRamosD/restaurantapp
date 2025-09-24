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
import CImage from '@/components/CImage'
import { createProduct } from '@/database/product.operations'
import { Product } from '@/interfaces'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'

type Props = {}



const CreateProductScreen = (props: Props) => {
    const db = useSQLiteContext();
    const color = useColorScheme()
    // State for form fields
    const [formData, setFormData] = useState<Omit<Product, 'id_producto' | 'uuid' | 'fecha_creacion'>>({
        id_perfil: 1, // You might want to get this from your auth context or props
        nombre: '',
        descripcion: '',
        precio: 0,
        precio_total: 0, // This should be calculated based on precio and descuento
        stock: 0,
        estado: 'disponible',
        envio_gratis: false,
        descuento: 0,
        precio_anterior: 0,
        imagen_url: '',
        galeria: '',
        video_url: '',
        codigo_barras: '',
        iva: null,
        slug: '',
        tiempo_entrega: '',
        ilimitado: false
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [switchEnvioGratis, setSwitchEnvioGratis] = useState(false);
    const [switchIlimitado, setSwitchIlimitado] = useState(false);
    const [image, setImage] = useState<string>("");

    const handleInputChange = (field: keyof Product, value: any) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            
            // Auto-generate slug from nombre
            if (field === 'nombre') {
                newData.slug = encodeURI(value.toLowerCase());
            }
            
            return newData;
        });

    };

    const onToggleSwitchEnvioGratis = (nameField: keyof Product) => {
        const newValue = !switchEnvioGratis;
        setSwitchEnvioGratis(newValue);
        handleInputChange(nameField, newValue);
    };

    const onToggleSwitchIlimitado = (nameField: keyof Product) => {
        const newValue = !switchIlimitado;
        if(newValue){
            handleInputChange("stock", 0);
        }
        setSwitchIlimitado(newValue);
        handleInputChange(nameField, newValue);
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets?.[0]?.uri ||"");
            handleInputChange("imagen_url", result.assets?.[0]?.uri ||"");
        }
    };

    const handleSaveProduct = async() => {
        console.log(formData);
        await createProduct(db, formData)
        router.dismissTo("/")
    };

    useEffect(() => {
        const descuento = formData.descuento || 0;
        const precioConDescuento = formData.precio * (1 - descuento / 100);
        setFormData(prev => ({
            ...prev,
            precio_total: Number(precioConDescuento.toFixed(2))
        }));
    }, [formData.precio, formData.descuento]);


    return (
        <CContainerView style={{flex:1}}>
            <CView style={{flex:1, backgroundColor:Colors[color ?? 'light'].tint, justifyContent:"center", height:20 }}>
              <CText type="title" style={{ textAlign:"center", color:"white"}}>Nuevo Producto</CText>
            </CView>
            <CView style={{flex:9}}>
                <ScrollView style={{padding:10}}>
                    
                    <CView style={{ padding:5, justifyContent:"center", gap:5, marginVertical:5}}>
                            <CImage style={style.imgComponent} 
                            src={image}
                            fallback='https://images.unsplash.com/photo-1546069901-ba9599a7e63c'/>
                            <CButton containerStyles={style.btnStyle} title='Subir Imagen' onPress={pickImage}/>

                    </CView>
                    <CView style={{ gap:10, marginBottom:20, padding:10}}>
                        <CView>
                            <CInputText 
                                label={"Nombre"} 
                                placeholder='Escriba aquí el nombre'
                                value={formData.nombre}
                                onChangeText={(text) => handleInputChange('nombre', text)}
                            />
                        </CView>
                        <CView>
                            <CInputText 
                                label={"Descripción"} 
                                placeholder='Escriba aquí la descripción' 
                                multiline
                                value={formData.descripcion as string}
                                onChangeText={(text) => handleInputChange('descripcion', text)}
                            />
                        </CView>
                        <CView style={{flexDirection: 'row', gap: 10}}>
                            <CView style={{flex: 1}}>
                                <CInputText 
                                    label={"Precio"} 
                                    placeholder='0.00'
                                    keyboardType="numeric"
                                    value={formData.precio?.toString()}
                                    onChangeText={(text) => handleInputChange('precio', parseFloat(text) || 0)}
                                />
                            </CView>
                            <CView style={{flex: 1}}>
                                <CInputText 
                                    label={"Stock"} 
                                    placeholder='0'
                                    keyboardType="numeric"
                                    value={formData.stock?.toString()}
                                    onChangeText={(text) => handleInputChange('stock', parseInt(text) || 0)}
                                    disabled={switchIlimitado}
                                />
                            </CView>
                        </CView>
                        <CView style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 5}}>
                            <CText>Ilimitado</CText>
                            <Switch 
                                value={formData.ilimitado} 
                                onValueChange={()=>onToggleSwitchIlimitado("ilimitado")} 
                            />
                        </CView>
                        
                        <CView>
                            <CText style={{paddingHorizontal:2, marginBottom: 4}}>Categoría</CText>
                            <CView style={{borderWidth:1, borderColor:"#cacacaff", borderRadius:5}}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue) => {
                                        setSelectedCategory(itemValue);
                                        // You might want to map this to a category ID in your actual implementation
                                    }}
                                    style={{color: Colors[color ?? 'light'].text}}
                                >
                                    <Picker.Item label="Seleccione una categoría" value="" />
                                    <Picker.Item label="Comida Rápida" value="comida_rapida" />
                                    <Picker.Item label="Bebidas" value="bebidas" />
                                    <Picker.Item label="Postres" value="postres" />
                                </Picker>
                            </CView>
                        </CView>

                        <CView>
                            <CInputText 
                                label={"Código de Barras"} 
                                placeholder='Código de barras del producto'
                                value={formData.codigo_barras}
                                onChangeText={(text) => handleInputChange('codigo_barras', text)}
                            />
                        </CView>

                        <CView>
                            <CInputText 
                                label={"URL de la Imagen"} 
                                placeholder='https://ejemplo.com/imagen.jpg'
                                value={formData.imagen_url}
                                onChangeText={(text) => {
                                    handleInputChange('imagen_url', text);
                                    setImage(text || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c");
                                }}
                            />
                        </CView>

                        <CView>
                            <CInputText 
                                label={"Galería (URLs separadas por comas)"} 
                                placeholder='https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg'
                                value={formData.galeria}
                                onChangeText={(text) => handleInputChange('galeria', text)}
                                multiline
                            />
                        </CView>

                        <CView>
                            <CInputText 
                                label={"URL del Video"} 
                                placeholder='https://ejemplo.com/video.mp4'
                                value={formData.video_url}
                                onChangeText={(text) => handleInputChange('video_url', text)}
                            />
                        </CView>
                        <CView>
                            <CInputText 
                                label={"IVA %"} 
                                placeholder='Ej: 19'
                                keyboardType="numeric"
                                value={formData.iva?.toString() || ''}
                                onChangeText={(text) => handleInputChange('iva', text ? parseFloat(text) : null)}
                            />
                        </CView>
                        

                        <CView style={{flexDirection: 'row', gap: 10}}>
                            <CView style={{flex: 1}}>
                                <CInputText 
                                    label={"Descuento %"} 
                                    placeholder='0'
                                    keyboardType="numeric"
                                    value={formData.descuento?.toString()}
                                    onChangeText={(text) => handleInputChange('descuento', parseInt(text) || 0)}
                                />
                            </CView>
                            <CView style={{flex: 1}}>
                                <CInputText 
                                    label={"Precio Anterior"} 
                                    placeholder='0.00'
                                    keyboardType="numeric"
                                    value={formData.precio_anterior?.toString()}
                                    onChangeText={(text) => handleInputChange('precio_anterior', parseFloat(text) || 0)}
                                />
                            </CView>
                        </CView>

                        <CView>
                            <CInputText 
                                label={"Tiempo de Entrega"} 
                                placeholder='Ej: 3-5 días'
                                value={formData.tiempo_entrega}
                                onChangeText={(text) => handleInputChange('tiempo_entrega', text)}
                            />
                        </CView>
                        <CView style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 5}}>
                            <CText>Envío Gratis</CText>
                            <Switch 
                                value={formData.envio_gratis} 
                                onValueChange={()=>onToggleSwitchEnvioGratis("envio_gratis")} 
                            />
                        </CView>
                    </CView>
                </ScrollView>
            </CView>
            <CView style={{flex:1.5, gap:5, justifyContent:"center", padding:10, }}>
                <CButton 
                containerStyles={{borderRadius:10}} 
                textStyles={{fontSize:24, paddingVertical:0}}
                onPress={handleSaveProduct}
                title='Guardar'/>
                <CButton title="Inicio" onPress={()=>router.dismissTo("/")}
                textStyles={{fontSize:16, paddingVertical:0}}
                containerStyles={{borderRadius:10, paddingVertical:0, borderWidth:5, borderStyle:"solid", borderColor:"#cecece", backgroundColor:"transparent"}}
                />
            </CView>

            

        </CContainerView>
        
    )
}

export default CreateProductScreen

const style = StyleSheet.create({
    imgComponent:{
        width:300,
        height: 300,
        objectFit: "contain",
        margin:"auto"
    },
    btnStyle: {
        padding:2,
        borderRadius:5,
        borderWidth:2,
        borderColor:"gray"
    }
})