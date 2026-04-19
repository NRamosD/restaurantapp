import React, { useEffect, useState } from 'react'
import { CView } from '../CView';
import CInputText from '../CInputText';
import { Producto, ProductoOpciones } from '@/interfaces/general.interface';
import { CategoriaProducto } from '@/interfaces';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CText } from '../CText';
import { Switch } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useProductoService } from '@/modules';
import { useAppTheme } from '@/theme';
import GenericModal from '../ui/GenericModal';

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
    const [aplicaIvaActive, setAplicaIvaActive] = useState(false);
    const [productoDisponible, setProductoDisponible] = useState(true);
    const [opciones, setOpciones] = useState<ProductoOpciones[]>([]);
    const [opcionesForm, setOpcionesForm] = useState<Partial<ProductoOpciones>>({});
    const [modalVisibleProductoOpcion, setModalVisibleProductoOpcion] = useState(false);


    const {
        obtenerOpcionesPorProducto, 
        obtenerCategorias, 
        crearProductoOpcion,
        editarProductoOpcion,
        obtenerProductoOpcionPorUuid
    } = useProductoService();

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

    const cargarOpciones = async () => {
        if (!formData.uuid) {
            setOpciones([]);
            return;
        }
        const resultado = await obtenerOpcionesPorProducto(formData.uuid);
        console.log('[FORM PRODUCTO] Cargando opciones', resultado);
        setOpciones(resultado);
    };


    const handleCrearOpcion = async () => {
        if (!formData.uuid || !opcionesForm?.nombre?.trim()) {
            return;
        }
        await crearProductoOpcion({
            productoUuid: formData.uuid,
            nombre: opcionesForm.nombre,
            descripcion: opcionesForm.descripcion,
            valorAdicional: Number(opcionesForm.valorAdicional) || 0,
            activo: true,
        });
        setOpcionesForm({ nombre: '', descripcion: '', valorAdicional: 0 });
        await cargarOpciones();
        setModalVisibleProductoOpcion(false);
    };
    const handleActualizarOpcion = async () => {
        if (!formData.uuid || !opcionesForm?.nombre?.trim()) {
            return;
        }
        await editarProductoOpcion({
            uuid: opcionesForm.uuid!,
            nombre: opcionesForm.nombre,
            descripcion: opcionesForm.descripcion,
            valorAdicional: Number(opcionesForm.valorAdicional) || 0
        });
        setOpcionesForm({ nombre: '', descripcion: '', valorAdicional: 0 });
        await cargarOpciones();
        setModalVisibleProductoOpcion(false);
    };

    useEffect(() => {
        obtenerCategorias().then((categorias) => {
            setCategorias(categorias);
        });
    }, []);
    useEffect(() => {
        cargarOpciones();
    }, [formData.uuid]);

    useEffect(() => {
        setAplicaIvaActive(Boolean(formData.aplicaIva));
        setProductoDisponible(formData.estado !== 'NO_DISPONIBLE');
    }, [formData.aplicaIva, formData.estado]);

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

            <CView style={style.switchRow}>
                <CText>Aplica IVA</CText>
                <Switch
                    value={aplicaIvaActive}
                    onValueChange={(value) => {
                        setAplicaIvaActive(value);
                        handleInputChange('aplicaIva', value);
                        if (!value) {
                            handleInputChange('porcentajeIva', null);
                        }
                    }}
                />
            </CView>

            {aplicaIvaActive && (
                <CView style={{flexDirection: 'row', gap: 10}}>
                    <CView style={{flex: 1}}>
                        <CInputText
                            label="% IVA"
                            placeholder="12"
                            keyboardType="numeric"
                            value={formData.porcentajeIva?.toString()}
                            onChangeText={(text) => handleInputChange('porcentajeIva', parseFloat(text) || 0)}
                        />
                    </CView>
                    <CView style={{flex: 1}}>
                        <CText style={{marginBottom: 8}}>Disponible para venta</CText>
                        <Switch
                            value={productoDisponible}
                            onValueChange={(value) => {
                                setProductoDisponible(value);
                                handleInputChange('estado', value ? 'DISPONIBLE' : 'NO_DISPONIBLE');
                            }}
                        />
                    </CView>
                </CView>
            )}

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

            {
                !!formData?.nombre && (
                    <>
                    <CView style={style.switchRow}>
                        <CText type="defaultSemiBold">Opciones del Producto</CText>
                        <TouchableOpacity onPress={() => setModalVisibleProductoOpcion(true)} style={style.addButton}>
                            <CText style={{ color: theme.colors.text.primary }}>+ Añadir opción</CText>
                        </TouchableOpacity>
                    </CView>
        
                    {opciones.length > 0 && (
                        <CView style={style.chipsContainer}>
                            {opciones.map((opcion) => (
                                <TouchableOpacity onPress={async ()=>{
                                    const result = await obtenerProductoOpcionPorUuid(opcion.uuid!);
                                    setOpcionesForm(result[0])
                                    setModalVisibleProductoOpcion(true)
                                }} key={opcion.uuid}>
                                    <View style={style.chip}>
                                        <CText style={style.chipText}>{opcion.nombre}</CText>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </CView>
                    )}
        
                    <GenericModal
                        showModal={modalVisibleProductoOpcion}
                        setShowModal={setModalVisibleProductoOpcion}
                        showConfirmButton={true}
                        textCloseButton='Cerrar'
                        title={
                            opcionesForm?.uuid 
                                ? "Editar Opción del Producto"
                                : "Agregar Opción del Producto"
                        }
                        nodeContent={<>
                            <CInputText
                                label="Nombre"
                                placeholder="Nombre"
                                value={opcionesForm.nombre || ''}
                                onChangeText={(text) => setOpcionesForm({...opcionesForm, nombre: text})}
                            />
                            <CInputText
                                label="Descripción"
                                placeholder="Descripción"
                                value={opcionesForm.descripcion || ''}
                                onChangeText={(text) => setOpcionesForm({...opcionesForm, descripcion: text})}
                            />
                            <CInputText
                                label="Valor Adicional"
                                placeholder="Valor Adicional"
                                value={opcionesForm.valorAdicional?.toString() || ''}
                                onChangeText={(text) => setOpcionesForm({...opcionesForm, valorAdicional: parseFloat(text) || 0})}
                            />
                        
                        </>}
                        withButton={false}
                        textConfirmButton='Guardar'
                        onConfirm={() => {
                            if(!!opcionesForm?.uuid){
                                handleActualizarOpcion()
                            }else{
                                handleCrearOpcion()
                            }
                            setModalVisibleProductoOpcion(false);
                        }}
                    />
                    </>
                )
            }



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
    addButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
    },
})