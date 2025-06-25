import { StyleSheet, Image, Platform, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';
import { Products } from "@/interfaces/products";
import ItemMenuSquareDetails from '@/components/orders/ItemMenuSquareDetails';
import GenericModal from '@/components/ui/GenericModal';


export const mockProducts: Products[] = [
  {
    uuid: "1a2b3c4d-0001",
    name: "Smartphone Ultra 5G",
    details: "Teléfono inteligente con pantalla AMOLED y cámara de 108MP",
    image:"",
    created: "09:45",
    modified: "2025-06-23"
  },
  {
    uuid: "1a2b3c4d-0002",
    name: "Auriculares Inalámbricos Pro",
    details: "Cancelación de ruido activa y hasta 30 horas de batería",
    image:"",
    created: "10:15",
    modified: "2025-06-22"
  },
  {
    uuid: "1a2b3c4d-0003",
    name: "Laptop Gamer Titan",
    details: "Intel i9, RTX 4080, 32GB RAM, 1TB SSD",
    image:"",
    created: "14:30",
    modified: "2025-06-21"
  },
  {
    uuid: "1a2b3c4d-0004",
    name: "Cámara Reflex Z100",
    details: "Sensor full-frame, 45MP, video 8K",
    image:"",
    created: "11:20",
    modified: "2025-06-20"
  },
  {
    uuid: "1a2b3c4d-0005",
    name: "Smartwatch Active 2",
    details: "Monitoreo cardíaco, GPS, resistencia al agua",
    image:"",
    created: "08:00",
    modified: "2025-06-19"
  },
  {
    uuid: "1a2b3c4d-0006",
    name: "Monitor Curvo 34'' UltraWide",
    details: "3440x1440, 144Hz, HDR10",
    image:"",
    created: "13:05",
    modified: "2025-06-19"
  },
  {
    uuid: "1a2b3c4d-0007",
    name: "Teclado Mecánico RGB",
    details: "Interruptores azules, retroiluminación personalizable",
    image:"",
    created: "16:10",
    modified: "2025-06-18"
  },
  {
    uuid: "1a2b3c4d-0008",
    name: "Mouse Inalámbrico Pro",
    details: "Sensor óptico de alta precisión, diseño ergonómico",
    image:"",
    created: "10:45",
    modified: "2025-06-17"
  },
  {
    uuid: "1a2b3c4d-0009",
    name: "Tablet XPad 12.9''",
    details: "Pantalla Retina, chip M2, 512GB",
    image:"",
    created: "09:25",
    modified: "2025-06-17"
  },
  {
    uuid: "1a2b3c4d-0010",
    name: "Consola de Juegos Zeta",
    details: "Soporta 8K, SSD ultrarrápido, juegos exclusivos",
    image:"",
    created: "12:40",
    modified: "2025-06-16"
  },
  {
    uuid: "1a2b3c4d-0011",
    name: "Proyector 4K Home Cinema",
    details: "HDR, 3500 lúmenes, hasta 200''",
    image:"",
    created: "17:30",
    modified: "2025-06-16"
  },
  {
    uuid: "1a2b3c4d-0012",
    name: "Impresora Multifunción WiFi",
    details: "Impresión, escaneo y copia desde cualquier dispositivo",
    image:"",
    created: "08:50",
    modified: "2025-06-15"
  },
  {
    uuid: "1a2b3c4d-0013",
    name: "Altavoz Inteligente Echo+",
    details: "Control por voz, compatible con Alexa",
    image:"",
    created: "14:10",
    modified: "2025-06-14"
  },
  {
    uuid: "1a2b3c4d-0014",
    name: "Router WiFi 6 AX6000",
    details: "Velocidad ultra rápida, cobertura ampliada",
    image:"",
    created: "11:00",
    modified: "2025-06-14"
  },
  {
    uuid: "1a2b3c4d-0015",
    name: "Disco Duro Externo 5TB",
    details: "USB 3.2, resistente a golpes",
    image:"",
    created: "15:25",
    modified: "2025-06-13"
  },
  {
    uuid: "1a2b3c4d-0016",
    name: "SSD NVMe Gen4 2TB",
    details: "Lectura hasta 7000MB/s, ideal para gaming",
    image:"",
    created: "10:05",
    modified: "2025-06-12"
  },
  {
    uuid: "1a2b3c4d-0017",
    name: "Sistema de Seguridad Inteligente",
    details: "Incluye cámaras, sensores y app móvil",
    image:"",
    created: "09:55",
    modified: "2025-06-11"
  },
  {
    uuid: "1a2b3c4d-0018",
    name: "Silla Ergonómica Pro Office",
    details: "Soporte lumbar, ajustable, malla transpirable",
    image:"",
    created: "13:40",
    modified: "2025-06-10"
  },
  {
    uuid: "1a2b3c4d-0019",
    name: "Panel Solar Portátil 120W",
    details: "Ideal para camping o emergencias",
    image:"",
    created: "16:45",
    modified: "2025-06-09"
  },
  {
    uuid: "1a2b3c4d-0020",
    name: "Cargador Rápido USB-C 100W",
    details: "Compatible con laptops, tablets y smartphones",
    image:"",
    created: "11:35",
    modified: "2025-06-08"
  }
];





export default function TabTwoScreen() {
  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Menú"}/>
        <CView style={{flex:10, flexDirection:"row"}}>
          <FlatList<Products>
            data={mockProducts}
            renderItem={({item}) => <ItemMenuSquareDetails data={item}/> }
            horizontal={false}
            numColumns={2}
            keyExtractor={item => item.uuid}
            columnWrapperStyle={{
              justifyContent:"space-evenly",
              gap:10,
              width:"100%"
            }}
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
