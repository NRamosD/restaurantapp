import { StyleSheet, Image, Platform, FlatList, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { CText } from '@/components/CText';
import { CView } from '@/components/CView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CContainerView } from '@/components/CContainerView';
import ItemOrderExtendedLink from '@/components/orders/ItemOrderExtendedLink';
import { Ionicons } from '@expo/vector-icons';
import { ItemOrderExtended } from '../../interfaces/orders';


const mockOrders: ItemOrderExtended[] = [
  {
    order_uui: 'uuid-001',
    order_id: 1,
    order_number: 1001,
    details: '2x Hamburguesa, 1x Papas Fritas',
    time: '11:15',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-002',
    order_id: 2,
    order_number: 1002,
    details: '1x Pizza Margarita, 2x Gaseosa',
    time: '11:45',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-003',
    order_id: 3,
    order_number: 1003,
    details: '1x Ensalada César',
    time: '12:05',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-004',
    order_id: 4,
    order_number: 1004,
    details: '3x Tacos, 1x Agua con gas',
    time: '12:28',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-005',
    order_id: 5,
    order_number: 1005,
    details: '1x Lasaña, 1x Té Helado',
    time: '12:50',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-006',
    order_id: 6,
    order_number: 1006,
    details: '1x Pollo Frito, 1x Jugo de Naranja',
    time: '13:10',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-007',
    order_id: 7,
    order_number: 1007,
    details: '2x Sushi Rolls, 1x Agua',
    time: '13:35',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-008',
    order_id: 8,
    order_number: 1008,
    details: '1x Burrito, 1x Coca-Cola',
    time: '13:50',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-009',
    order_id: 9,
    order_number: 1009,
    details: '1x Filete de Res, 1x Vino Tinto',
    time: '14:10',
    date: '2025-06-23'
  },
  {
    order_uui: 'uuid-010',
    order_id: 10,
    order_number: 1010,
    details: '1x Helado, 1x Café Expreso',
    time: '14:30',
    date: '2025-06-23'
  }
];


export default function TabTwoScreen() {
  
  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Historial de Ventas"}/>
        <CView style={{flex:10}}>
          <FlatList<ItemOrderExtended>
            data={mockOrders}
            renderItem={({item}) => <ItemOrderExtendedLink data={item}/> }
            keyExtractor={item => item.order_uui}
          />
        </CView>
        <View style={styles.sectionFilters}>
          <CView style={styles.filtersStyle}>
            {/* <CView > */}
              <TouchableOpacity style={styles.filtersBtnStyle}>
                  <Ionicons name="filter" size={30}/>
                  <CText type="subtitle">Option 1</CText>
              </TouchableOpacity>
            {/* </CView> */}
            {/* <CView> */}
              <TouchableOpacity style={styles.filtersBtnStyle}>
                <Ionicons name="filter" size={30}/>
                <CText type="subtitle">Option 2</CText>
              </TouchableOpacity>
            {/* </CView> */}
          </CView>
        </View>
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
  sectionFilters: {
    flex:1,
    flexDirection:"row",
    backgroundColor: "#28fa15"
  },
  filtersStyle: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    gap:50,

  },
  filtersBtnStyle: {
    flex:1,
    flexDirection:"row",
    backgroundColor:"green",
    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal:5,
    paddingVertical: 10,

  }
});
