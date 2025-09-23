import { StyleSheet, Image, Platform, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';
import { Product } from "@/interfaces/products";
import ItemMenuSquareDetails from '@/components/orders/ItemMenuSquareDetails';
import GenericModal from '@/components/ui/GenericModal';
import { useSQLiteContext } from 'expo-sqlite';
import { getProducts } from '@/database/product.operations';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';







export default function TabTwoScreen() {

  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const products = await getProducts(db);
    setProducts(products);
  };

  useEffect(() => {
    fetchProducts();
  }, [isFocused]);

  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Productos"}/>
        <CView style={{flex:10, flexDirection:"row", width:"90%", margin:"auto", paddingHorizontal:10}}>
          <FlatList<Product>
            data={products}
            renderItem={({item}) => <ItemMenuSquareDetails data={item}/> }
            horizontal={false}
            numColumns={2}
            keyExtractor={item => item.uuid}
            columnWrapperStyle={{
              justifyContent:"space-between",
              gap:10,
              width:"100%"
            }}
            ListEmptyComponent={<CText>No hay productos registrados</CText>}
            
          />
          {/* <ItemOrderExtendedLink data={item}/> */}
        </CView>
        
    </CContainerView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

// export const mockProducts: Product[] = [
//   {
//     uuid: "1a2b3c4d-0001",
//     nombre: "Smartphone Ultra 5G",
//     descripcion: "Teléfono inteligente con pantalla AMOLED y cámara de 108MP",
//     imagenUrl:"",
//     fechaCreacion: "09:45",
//     fechaActualizacion: "2025-06-23"
//   },
//   {
//     uuid: "1a2b3c4d-0002",
//     nombre: "Auriculares Inalámbricos Pro",
//     descripcion: "Cancelación de ruido activa y hasta 30 horas de batería",
//     imagenUrl:"",
//     fechaCreacion: "10:15",
//     fechaActualizacion: "2025-06-22"
//   },
//   {
//     uuid: "1a2b3c4d-0003",
//     nombre: "Laptop Gamer Titan",
//     descripcion: "Intel i9, RTX 4080, 32GB RAM, 1TB SSD",
//     imagenUrl:"",
//     fechaCreacion: "14:30",
//     fechaActualizacion: "2025-06-21"
//   },
//   {
//     uuid: "1a2b3c4d-0004",
//     nombre: "Cámara Reflex Z100",
//     descripcion: "Sensor full-frame, 45MP, video 8K",
//     imagenUrl:"",
//     fechaCreacion: "11:20",
//     fechaActualizacion: "2025-06-20"
//   },
//   {
//     uuid: "1a2b3c4d-0005",
//     nombre: "Smartwatch Active 2",
//     descripcion: "Monitoreo cardíaco, GPS, resistencia al agua",
//     imagenUrl:"",
//     fechaCreacion: "08:00",
//     fechaActualizacion: "2025-06-19"
//   },
//   {
//     uuid: "1a2b3c4d-0006",
//     nombre: "Monitor Curvo 34'' UltraWide",
//     descripcion: "3440x1440, 144Hz, HDR10",
//     imagenUrl:"",
//     fechaCreacion: "13:05",
//     fechaActualizacion: "2025-06-19"
//   },
//   {
//     uuid: "1a2b3c4d-0007",
//     nombre: "Teclado Mecánico RGB",
//     descripcion: "Interruptores azules, retroiluminación personalizable",
//     imagenUrl:"",
//     fechaCreacion: "16:10",
//     fechaActualizacion: "2025-06-18"
//   },
//   {
//     uuid: "1a2b3c4d-0008",
//     nombre: "Mouse Inalámbrico Pro",
//     descripcion: "Sensor óptico de alta precisión, diseño ergonómico",
//     imagenUrl:"",
//     fechaCreacion: "10:45",
//     fechaActualizacion: "2025-06-17"
//   },
//   {
//     uuid: "1a2b3c4d-0009",
//     nombre: "Tablet XPad 12.9''",
//     descripcion: "Pantalla Retina, chip M2, 512GB",
//     imagenUrl:"",
//     fechaCreacion: "09:25",
//     fechaActualizacion: "2025-06-17"
//   },
//   {
//     uuid: "1a2b3c4d-0010",
//     nombre: "Consola de Juegos Zeta",
//     descripcion: "Soporta 8K, SSD ultrarrápido, juegos exclusivos",
//     imagenUrl:"",
//     fechaCreacion: "12:40",
//     fechaActualizacion: "2025-06-16"
//   },
//   {
//     uuid: "1a2b3c4d-0011",
//     nombre: "Proyector 4K Home Cinema",
//     descripcion: "HDR, 3500 lúmenes, hasta 200''",
//     imagenUrl:"",
//     fechaCreacion: "17:30",
//     fechaActualizacion: "2025-06-16"
//   },
//   {
//     uuid: "1a2b3c4d-0012",
//     nombre: "Impresora Multifunción WiFi",
//     descripcion: "Impresión, escaneo y copia desde cualquier dispositivo",
//     imagenUrl:"",
//     fechaCreacion: "08:50",
//     fechaActualizacion: "2025-06-15"
//   },
//   {
//     uuid: "1a2b3c4d-0013",
//     nombre: "Altavoz Inteligente Echo+",
//     descripcion: "Control por voz, compatible con Alexa",
//     imagenUrl:"",
//     fechaCreacion: "14:10",
//     fechaActualizacion: "2025-06-14"
//   },
//   {
//     uuid: "1a2b3c4d-0014",
//     nombre: "Router WiFi 6 AX6000",
//     descripcion: "Velocidad ultra rápida, cobertura ampliada",
//     imagenUrl:"",
//     fechaCreacion: "11:00",
//     fechaActualizacion: "2025-06-14"
//   },
//   {
//     uuid: "1a2b3c4d-0015",
//     nombre: "Disco Duro Externo 5TB",
//     descripcion: "USB 3.2, resistente a golpes",
//     imagenUrl:"",
//     fechaCreacion: "15:25",
//     fechaActualizacion: "2025-06-13"
//   },
//   {
//     uuid: "1a2b3c4d-0016",
//     nombre: "SSD NVMe Gen4 2TB",
//     descripcion: "Lectura hasta 7000MB/s, ideal para gaming",
//     imagenUrl:"",
//     fechaCreacion: "10:05",
//     fechaActualizacion: "2025-06-12"
//   },
//   {
//     uuid: "1a2b3c4d-0017",
//     nombre: "Sistema de Seguridad Inteligente",
//     descripcion: "Incluye cámaras, sensores y app móvil",
//     imagenUrl:"",
//     fechaCreacion: "09:55",
//     fechaActualizacion: "2025-06-11"
//   },
//   {
//     uuid: "1a2b3c4d-0018",
//     nombre: "Silla Ergonómica Pro Office",
//     descripcion: "Soporte lumbar, ajustable, malla transpirable",
//     imagenUrl:"",
//     fechaCreacion: "13:40",
//     fechaActualizacion: "2025-06-10"
//   },
//   {
//     uuid: "1a2b3c4d-0019",
//     nombre: "Panel Solar Portátil 120W",
//     descripcion: "Ideal para camping o emergencias",
//     imagenUrl:"",
//     fechaCreacion: "16:45",
//     fechaActualizacion: "2025-06-09"
//   },
//   {
//     uuid: "1a2b3c4d-0020",
//     nombre: "Cargador Rápido USB-C 100W",
//     descripcion: "Compatible con laptops, tablets y smartphones",
//     imagenUrl:"",
//     fechaCreacion: "11:35",
//     fechaActualizacion: "2025-06-08"
//   }
// ];
