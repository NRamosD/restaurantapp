import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ToastAndroid } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Switch } from 'react-native-paper'
import CImage from '@/components/CImage'
import { useColorScheme } from '@/hooks/useColorScheme'
import { getColors } from '@/constants/Colors'
import { useProductoService } from '@/modules'
import { useAuthStore } from '@/hooks/useAuthStore'
import FormProducto from '@/components/inventory/FormProducto'

type Props = {}

type ProductFormData = {
    nombre: string;
    descripcion: string;
    precio: number;
    precioFinal: number;
    stock: number;
    imagenUrl: string;
    aplicaIva: boolean;
    porcentajeIva: number;
    ilimitado: boolean;
    estado: 'DISPONIBLE' | 'NO_DISPONIBLE';
}

const CreateProductScreen = ({}: Props) => {
    const color = useColorScheme()
    const colors = getColors(color)
    const { crearProducto } = useProductoService()
    const { user } = useAuthStore()
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '',
        descripcion: '',
        precio: 0,
        precioFinal: 0,
        stock: 0,
        imagenUrl: '',
        aplicaIva: true,
        porcentajeIva: 12,
        ilimitado: false,
        estado: 'DISPONIBLE'
    });
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState<string>("");

    const handleInputChange = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
        setFormData(prev => {
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const onToggleSwitchIlimitado = () => {
        const newValue = !formData.ilimitado;
        if(newValue){
            handleInputChange("stock", 0);
        }
        handleInputChange("ilimitado", newValue);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets?.[0]?.uri ||"");
            handleInputChange("imagenUrl", result.assets?.[0]?.uri ||"");
        }
    };

    const handleSaveProduct = async() => {
        if (!user?.perfilNegocioUuid) {
            ToastAndroid.show('No se encontró el perfil del negocio', ToastAndroid.SHORT)
            return
        }

        if (!formData.nombre.trim()) {
            ToastAndroid.show('Ingresa el nombre del producto', ToastAndroid.SHORT)
            return
        }

        if (formData.precio <= 0) {
            ToastAndroid.show('Ingresa un precio válido', ToastAndroid.SHORT)
            return
        }

        try {
            setSaving(true)
            await crearProducto({
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim() || undefined,
                precio: Math.round(formData.precio * 100),
                aplicaIva: formData.aplicaIva,
                porcentajeIva: formData.porcentajeIva,
                stock: formData.ilimitado ? 0 : formData.stock,
                ilimitado: formData.ilimitado,
                imagenUrl: formData.imagenUrl || undefined,
                perfilNegocioUuid: user.perfilNegocioUuid,
                estado: formData.estado
            })
            ToastAndroid.show('Producto creado correctamente', ToastAndroid.SHORT)
            router.back()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo crear el producto'
            ToastAndroid.show(message, ToastAndroid.LONG)
        } finally {
            setSaving(false)
        }
    };

    useEffect(() => {
        const precioBase = formData.precio || 0;
        const precioConIva = formData.aplicaIva
            ? precioBase * (1 + (formData.porcentajeIva || 0) / 100)
            : precioBase;
        setFormData(prev => ({
            ...prev,
            precioFinal: Number(precioConIva.toFixed(2))
        }));
    }, [formData.precio, formData.aplicaIva, formData.porcentajeIva]);

    return (
        <CContainerView style={{flex:1}}>
            <CView style={{flex:1, backgroundColor:colors.tint, justifyContent:"center", height:20 }}>
              <CText type="title" style={{ textAlign:"center", color: colors.text, fontSize:20}}>Nuevo Producto</CText>
            </CView>
            <CView style={{flex:9}}>
                <ScrollView style={{padding:10}} contentContainerStyle={style.scrollContent}>
                    <CView style={style.summaryCard}>
                        <CView>
                            <CText type="subtitle">Resumen rápido</CText>
                            <CText>{formData.estado}</CText>
                        </CView>
                        <CView style={style.summaryRow}>
                            <CText>Precio final</CText>
                            <CText type="defaultSemiBold">${formData.precioFinal.toFixed(2)}</CText>
                        </CView>
                        <CView style={style.summaryRow}>
                            <CText>Stock inicial</CText>
                            <CText type="defaultSemiBold">{formData.ilimitado ? 'Ilimitado' : formData.stock}</CText>
                        </CView>
                    </CView>
                    
                    <CView style={style.imageSection}>
                            <CImage style={style.imgComponent} 
                            src={image}
                            fallback='https://images.unsplash.com/photo-1546069901-ba9599a7e63c'/>
                            <CButton containerStyles={style.btnStyle} textStyles={{fontSize:16}} title='Subir Imagen' onPress={pickImage}/>

                    </CView>


                    <FormProducto
                    formData={formData}
                    setFormData={setFormData}
                    />

                </ScrollView>
            </CView>
            <CView style={{flex:1, flexDirection:"row", gap:10, justifyContent:"center", paddingHorizontal:10, paddingTop:20, paddingBottom:40, }}>
                <CButton title="Volver" onPress={()=>router.back()}
                textStyles={{fontSize:16, paddingVertical:0}}
                containerStyles={{borderRadius:10, paddingVertical:0, flex:1}}
                />
                <CButton 
                containerStyles={{borderRadius:10, borderWidth:5, borderStyle:"solid", borderColor:"#cecece", flex:1}} 
                textStyles={{fontSize:24, paddingVertical:0}}
                onPress={handleSaveProduct}
                title={saving ? 'Guardando...' : 'Guardar'} />
            </CView>
            {/* <CView style={{flex:1.5, gap:5, justifyContent:"center", padding:10, }}>
                <CButton 
                containerStyles={{borderRadius:10}} 
                textStyles={{fontSize:24, paddingVertical:0}}
                onPress={handleSaveProduct}
                disabled={saving}
                title={saving ? 'Guardando...' : 'Guardar'}/>
                <CButton title="Inicio" onPress={()=>router.dismissTo("/")}
                textStyles={{fontSize:16, paddingVertical:0}}
                containerStyles={{borderRadius:10, paddingVertical:0, borderWidth:5, borderStyle:"solid", borderColor:"#cecece", backgroundColor:"transparent"}}
                />
            </CView> */}
        </CContainerView>
    )
}

export default CreateProductScreen

const style = StyleSheet.create({
    scrollContent:{
        paddingBottom:20,
        gap:12,
    },
    summaryCard:{
        gap:8,
        padding:14,
        borderRadius:14,
        borderWidth:1,
        borderColor:'#d7dde5',
        backgroundColor:'rgba(2,219,183,0.08)',
    },
    summaryRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    imageSection:{
        padding:5,
        justifyContent:"center",
        gap:8,
        marginVertical:5,
    },
    formSection:{
        gap:10,
        marginBottom:20,
        padding:10,
    },
    switchRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:8,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#d7dde5',
    },
    imgComponent:{
        width:300,
        height: 300,
        objectFit: "contain",
        margin:"auto"
    },
    btnStyle: {
        padding:5,
        borderRadius:5,
        borderWidth:2,
        borderColor:"gray"
    }
})