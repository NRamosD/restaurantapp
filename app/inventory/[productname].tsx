import { CButton } from '@/components'
import { CContainerView } from '@/components/CContainerView'
import CInputText from '@/components/CInputText'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Switch } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { useSQLiteContext } from 'expo-sqlite'
import { getProductByUuid, updateProduct } from '@/db/product.operations'
import { Product } from '@/interfaces'
import CImage from '@/components/CImage'
import { useIsFocused } from '@react-navigation/native';
import { getColors } from '@/constants/Colors'

type Props = {}

const DetailedProductScreen = ({
    
}: Props) => {
    const db = useSQLiteContext();
    const {productname} = useLocalSearchParams()
    const isFocused = useIsFocused();
    const color = useColorScheme()
    const colors = getColors(color)

    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [switchEnvioGratis, setSwitchEnvioGratis] = useState(false);
    const [switchIlimitado, setSwitchIlimitado] = useState(false);
    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Omit<Product, 'id_producto' | 'uuid'>>({
        perfilNegocioUuid: 'TEMP_PERFIL_NEGOCIO_UUID', 

        nombre: '',
        descripcion: '',
        precio: 0,
        precio_total: 0, 
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
        if (!currentProduct?.id_producto) {
            return;
        }

        try {
            setSaving(true);
            await updateProduct(db, {
                ...formData,
                id_producto: currentProduct.id_producto,
            });
            router.back();
        } catch (error) {
            console.log('[PRODUCT DETAIL] Error actualizando producto', error);
        } finally {
            setSaving(false);
        }
    };
    
    useEffect(() => {
        const descuento = formData.descuento || 0;
        const precioConDescuento = formData.precio * (1 - descuento / 100);
        setFormData(prev => ({
            ...prev,
            precio_total: Number(precioConDescuento.toFixed(2))
        }));
    }, [formData.precio, formData.descuento]);

    async function setup() {
        try {
            setLoading(true);
            const uuid = Array.isArray(productname) ? productname[0] : productname;
            if (!uuid) {
                setCurrentProduct(null);
                return;
            }

            const result = await getProductByUuid(db, uuid.toString());
            if(result){
                setCurrentProduct(result);
                setImage(result?.imagen_url || "");
                setSwitchEnvioGratis(Boolean(result.envio_gratis));
                setSwitchIlimitado(Boolean(result.ilimitado));
                setFormData({
                    perfilNegocioUuid: result.perfilNegocioUuid,
                    negocioUuid: result.negocioUuid,
                    nombre: result.nombre,
                    descripcion: result.descripcion ?? '',
                    imagen: result.imagen ?? '',
                    iva: result.iva ?? null,
                    precio: result.precio,
                    precio_total: result.precio_total,
                    stock: result.stock,
                    estado: result.estado,
                    imagen_url: result.imagen_url ?? '',
                    galeria: result.galeria ?? '',
                    video_url: result.video_url ?? '',
                    codigo_barras: result.codigo_barras ?? '',
                    slug: result.slug ?? '',
                    descuento: result.descuento ?? 0,
                    precio_anterior: result.precio_anterior ?? 0,
                    envio_gratis: Boolean(result.envio_gratis),
                    tiempo_entrega: result.tiempo_entrega ?? '',
                    ilimitado: Boolean(result.ilimitado),
                });
            }
        } catch (error) {
            console.log('[PRODUCT DETAIL] Error cargando producto', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        setup();
    }, [db, isFocused, productname]);


    if (loading) {
        return (
            <CContainerView style={style.loadingContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
                <CText>Cargando producto...</CText>
            </CContainerView>
        )
    }

    return (
    <>
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
                        <CText type="defaultSemiBold">${formData.precio_total || 0}</CText>
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
                    <CView style={style.switchRow}>
                        <CText>Ilimitado</CText>
                        <Switch 
                            value={formData.ilimitado} 

                            onValueChange={()=>onToggleSwitchIlimitado("ilimitado")} 
                        />
                    </CView>
                    
                    <CView style={style.fieldCard}>
                        <CText style={{paddingHorizontal:2, marginBottom: 4}}>Categoría</CText>
                        <CView style={style.pickerWrapper}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue) => {

                                    setSelectedCategory(itemValue);
                                    // You might want to map this to a category ID in your actual implementation
                                }}
                                style={{color: colors.text}}
                            >
                                <Picker.Item label="Seleccione una categoría" value="" />
                                <Picker.Item label="Comida" value="comida" />

                                <Picker.Item label="Entrada" value="entrada" />
                                <Picker.Item label="Plato Fuerte" value="plato_fuerte" />
                                <Picker.Item label="Comida Rápida" value="comida_rapida" />
                                <Picker.Item label="Bebidas" value="bebidas" />
                                <Picker.Item label="Adicionales" value="adicionales" />
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

                    <CView style={{flexDirection: 'row', gap: 10}}>
                        <CView style={{flex: 1, gap: 10}}>
                            <CInputText 
                                label={"Descuento %"} 
                                placeholder='0'
                                keyboardType="numeric"
                                maxLength={2}
                                value={formData.descuento?.toString()}
                                onChangeText={(text) => handleInputChange('descuento', parseInt(text) || 0)}
                            />
                        </CView>
                        <CView style={{flex: 1}}>
                            <CInputText 
                                label={"Nuevo Precio"} 
                                placeholder='0'
                                disabled
                                value={
                                    ((formData.precio||0)-(formData.precio||0)*(formData.descuento||0)/100).toString()
                                }
                            />
                            {/* <CInputText 
                                label={"Precio Anterior"} 
                                placeholder='0.00'
                                keyboardType="numeric"
                                value={formData.precio_anterior?.toString()}
                                onChangeText={(text) => handleInputChange('precio_anterior', parseFloat(text) || 0)}
                            /> */}
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
                    <CView style={style.switchRow}>
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
            title={saving ? 'Guardando...' : 'Guardar'} />
            <CButton title="Volver" onPress={()=>router.back()}
            textStyles={{fontSize:16, paddingVertical:0}}
            containerStyles={{borderRadius:10, paddingVertical:0, borderWidth:5, borderStyle:"solid", borderColor:"#cecece", backgroundColor:"transparent"}}
            />

        </CView>
        </>

        

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