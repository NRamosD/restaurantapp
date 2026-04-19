import React, { useEffect, useState } from 'react'
import { CView } from '../CView';
import CInputText from '../CInputText';
import { Producto } from '@/interfaces/general.interface';
import { CategoriaProducto } from '@/interfaces';
import { StyleSheet } from 'react-native';
import { CText } from '../CText';
import { Switch } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useProductoService } from '@/modules';
import { useAppTheme } from '@/theme';

type Props = {
    formData: Partial<Producto>;
    setFormData: (data: any) => void;
}

const FormProducto = ({
    formData,
    setFormData
}: Props) => {
    const theme = useAppTheme();
    const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [switchIlimitado, setSwitchIlimitado] = useState(false);
    
    const { obtenerCategorias } = useProductoService();

    const handleInputChange = (field: keyof Producto, value: any) => {
        setFormData((prev: Partial<Producto>) => {
            const newData = {
                ...prev,
                [field]: value
            };
            
            // Auto-generate slug from nombre
            // if (field === 'nombre') {
            //     newData.slug = encodeURI(value.toLowerCase());
            // }
            
            return newData;
        });

    };

    const onToggleSwitchIlimitado = (nameField: keyof Producto) => {
        const newValue = !switchIlimitado;
        if(newValue){
            handleInputChange("stock", 0);
        }
        setSwitchIlimitado(newValue);
        handleInputChange(nameField, newValue);
    };

    useEffect(() => {
        obtenerCategorias().then((categorias) => {
            setCategorias(categorias);
        });
    }, []);

    return (
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
                    value={!!(formData.ilimitado)} 

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
                            handleInputChange('categoriaProductoUuid', itemValue || null);
                        }}
                        style={{backgroundColor: theme.colors.surface.background, color:theme.colors.text.primary}}
                    >
                        <Picker.Item label="Seleccione una categoría" value="" style={{backgroundColor: theme.colors.surface.background, color:theme.colors.text.primary}} />
                        {categorias.map((cat) => (
                            <Picker.Item 
                                style={{backgroundColor: theme.colors.surface.background, color:theme.colors.text.primary}}
                                key={cat.uuid} 
                                label={cat.nombre} 
                                value={cat.uuid} 
                            />
                        ))}
                    </Picker>
                </CView>
            </CView>
        </CView>
    )
}

export default FormProducto


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