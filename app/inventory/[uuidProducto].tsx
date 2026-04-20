import { CButton, CContainerView } from '@/components'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ToastAndroid, useColorScheme } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Switch } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { ActualizarProductoParams, useProductoService } from '@/modules/producto/producto.service'
import CImage from '@/components/CImage'
import { getColors } from '@/constants/Colors'
import { useAppTheme } from '@/theme'
import { CategoriaProducto, Producto } from '@/interfaces/general.interface'
import FormProducto from '@/components/inventory/FormProducto'

type Props = {}

const DetailedProductScreen = ({
    
}: Props) => {
    // const db = useSQLiteContext();
    const {uuidProducto} = useLocalSearchParams()
    // const isFocused = useIsFocused();
    const color = useColorScheme()
    const colors = getColors(color)

    const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);

    const [image, setImage] = useState<string>("");
    // const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { obtenerProductoPorUuid, actualizarProducto } = useProductoService();

    const [formData, setFormData] = useState<Partial<Producto>>({});




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
            setFormData({
                ...formData,
                imagenUrl: result.assets?.[0]?.uri ||"",
            });
        }
    };

    const handleSaveProduct = async() => {
        if (!currentProduct?.id) {
            return;
        }
        await actualizarProducto({
            ...formData as ActualizarProductoParams
        });
        ToastAndroid.show(`Producto actualizado`, ToastAndroid.SHORT);
        router.back();

        // try {
        //     setSaving(true);
        //     await updateProduct(db, {
        //         ...formData,
        //         id_producto: currentProduct.id_producto,
        //     });
        //     router.back();
        // } catch (error) {
        //     console.log('[PRODUCT DETAIL] Error actualizando producto', error);
        // } finally {
        //     setSaving(false);
        // }
    };

    async function Setup() {
        try {
            const result = await obtenerProductoPorUuid(uuidProducto.toString());
            setImage(result?.imagenUrl || "")
            setFormData({...result});
            setCurrentProduct(result);
        } catch (error) {
            console.log('[PRODUCT DETAIL] Error cargando categorías', error);
        }
    }

    // async function setup() {
    //     try {
    //         setLoading(true);
    //         await Setup();
    //         const uuid = Array.isArray(productname) ? productname[0] : productname;
    //         if (!uuid) {
    //             setCurrentProduct(null);
    //             return;
    //         }

    //         const result = await getProductByUuid(db, uuid.toString());
    //         if(result){
    //             setCurrentProduct(result);
    //             setSelectedCategory(result.categoriaProductoUuid || '');
    //             setImage(result?.imagen_url || "");
    //             setSwitchEnvioGratis(Boolean(result.envio_gratis));
    //             setSwitchIlimitado(Boolean(result.ilimitado));
    //             setFormData({
    //                 perfilNegocioUuid: result.perfilNegocioUuid,
    //                 negocioUuid: result.negocioUuid,
    //                 nombre: result.nombre,
    //                 descripcion: result.descripcion ?? '',
    //                 imagen: result.imagen ?? '',
    //                 iva: result.iva ?? null,
    //                 precio: result.precio,
    //                 precio_total: result.precio_total,
    //                 stock: result.stock,
    //                 estado: result.estado,
    //                 imagen_url: result.imagen_url ?? '',
    //                 galeria: result.galeria ?? '',
    //                 video_url: result.video_url ?? '',
    //                 codigo_barras: result.codigo_barras ?? '',
    //                 slug: result.slug ?? '',
    //                 descuento: result.descuento ?? 0,
    //                 precio_anterior: result.precio_anterior ?? 0,
    //                 envio_gratis: Boolean(result.envio_gratis),
    //                 tiempo_entrega: result.tiempo_entrega ?? '',
    //                 ilimitado: Boolean(result.ilimitado),
    //                 categoriaProductoUuid: result.categoriaProductoUuid || ''
    //             });
    //         }
    //     } catch (error) {
    //         console.log('[PRODUCT DETAIL] Error cargando producto', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    // useEffect(() => {
    //     setup();
    // }, [db, isFocused, productname]);

    useEffect(()=>{
        Setup();
    }, [])

    // useEffect(() => {
    //     const descuento = formData.descuento || 0;
    //     const precioConDescuento = formData.precio * (1 - descuento / 100);
    //     setFormData(prev => ({
    //         ...prev,
    //         precio_total: Number(precioConDescuento.toFixed(2))
    //     }));
    // }, [formData.precio, formData.descuento]);


    // if (loading) {
    //     return (
    //         <CContainerView style={style.loadingContainer}>
    //             <ActivityIndicator size="large" color={colors.tint} />
    //             <CText>Cargando producto...</CText>
    //         </CContainerView>
    //     )
    // }

    return (
    <CContainerView style={{flex:1}}>
        <CView style={[style.header, { backgroundColor: colors.tint }] }>
          <CText type="title" style={style.headerTitle}>Editar Producto</CText>
          <CText style={style.headerSubtitle}>{currentProduct?.nombre || 'Detalle del producto'}</CText>
        </CView>
        <CView style={{flex:9}}>
            <ScrollView style={{padding:10}} contentContainerStyle={style.scrollContent}>
                <CView style={style.summaryCard}>
                    <CView>
                        <CText type="subtitle">Resumen rápido</CText>
                        <CText>{currentProduct?.uuid}</CText>
                    </CView>
                    <CView style={style.summaryRow}>
                        <CText>Precio final</CText>
                        <CText type="defaultSemiBold">${formData.precio || 0}</CText>
                    </CView>
                    <CView style={style.summaryRow}>
                        <CText>Stock actual</CText>
                        <CText type="defaultSemiBold">{formData.ilimitado ? 'Ilimitado' : formData.stock}</CText>
                    </CView>
                </CView>
                
                <CView style={{ padding:5, justifyContent:"center", gap:5, marginVertical:5}}>
                        <CImage style={style.imgComponent} 
                        src={image}
                        fallback='https://images.unsplash.com/photo-1546069901-ba9599a7e63c'/>
                        <CButton containerStyles={style.btnStyle} title='Subir Imagen' onPress={pickImage}/>

                </CView>
                
                <FormProducto
                formData={formData}
                setFormData={setFormData}
                />

            </ScrollView>
        </CView>
        <CView style={{flex:1, flexDirection:"row", paddingHorizontal:10, gap:10, justifyContent:"center", paddingBottom:40, paddingTop:20 }}>
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
    </CContainerView>

        

    )
}

export default DetailedProductScreen

const style = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    header: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 4,
    },
    headerTitle: {
        textAlign:"center",
        color:"white",
        fontSize:24
    },
    headerSubtitle: {
        color: 'white',
        opacity: 0.92,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    summaryCard: {
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        // backgroundColor: '#fafafc',
        marginBottom: 8,
        gap: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imgComponent:{
        width:"90%",
        height: 200,
        objectFit: "cover",
        margin:"auto",
        borderRadius: 18,
    },
    btnStyle: {
        padding:2,
        borderRadius:5
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        // backgroundColor: '#fafafc',
    },
    fieldCard: {
        gap: 6,
    },
    pickerWrapper: {
        borderWidth:1,
        borderColor:"#cacacaff",
        borderRadius:12,
        // backgroundColor: '#fafafc',
        overflow: 'hidden',
    },
})