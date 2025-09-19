import { StyleSheet, Image, Platform, FlatList, TouchableOpacity, View, SectionList, Button, ToastAndroid } from 'react-native';
import dayjs from 'dayjs'
import "dayjs/locale/es";
dayjs.locale("es");
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
import { ItemOrderExtended, Orden } from '../../interfaces/orders';
import GenericModal from '@/components/ui/GenericModal';
import React, { useEffect, useState } from 'react';
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import CInputText from '@/components/CInputText';
import { useSQLiteContext } from 'expo-sqlite';
import { getOrdersByDate, getOrdersGroupedByDayStats } from '@/database/order.operations';



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

  const dbConnection  = useSQLiteContext();

  const [textFieldToShow, setTextFieldToShow] = useState(0);
  const [openModal2, setopenModal2] = useState(false);
  const [textInField, setTextInField] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    date: false,
  });
  const [date, setDate] = useState(new Date());


  
  DateTimePickerAndroid.dismiss('date')



  // const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const [sectionListDataByDate, setSectionListDataByDate] = useState<any>([]);
  const [auxSectionListDataByDate, setAuxSectionListDataByDate] = useState<any>([]);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, date) => {
        setDate(date!);
        const dateSelected = dayjs(date).format("dddd, D [de] MMMM [de] YYYY")?.toUpperCase()
        const pickedOrders = sectionListDataByDate.filter((item: any) => item.title === dateSelected)
        setAuxSectionListDataByDate(pickedOrders)
        setAppliedFilters({
          ...appliedFilters,
          date: true,
        })
      },
      mode: currentMode,
      is24Hour: true,
      maximumDate: dayjs().toDate(),
      minimumDate: dayjs().subtract(30, "day").toDate(),
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const getOrdersByDay = async () => {
    // const startDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")
    
    // const stats = await getOrdersGroupedByDayStats(dbConnection, 1);
    // console.log({stats})
    
    // const orders = await getOrdersByDate(dbConnection, 1, "month", startDate, endDate);
    
    let startDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")
    const endDate = dayjs().add(5, "hours").format("YYYY-MM-DD")
    let contentSection = []
    while (startDate <= endDate) {
      const ordersByDate = await getOrdersByDate(dbConnection, 1, "day", startDate);
      if(ordersByDate.length > 0){
        const dataWithLocalDate = ordersByDate.map((order: any) => {
          return {
            ...order,
            fecha: dayjs.utc(order.fecha).local()
          }
        })
        contentSection.push({title: dayjs.utc(startDate).local().format("dddd, D [de] MMMM [de] YYYY")?.toUpperCase()  , data: dataWithLocalDate})
      }
      startDate = dayjs(startDate).add(1, "day").format("YYYY-MM-DD")
    }
    // console.log({contentSection})

    setSectionListDataByDate(contentSection)
    setAuxSectionListDataByDate(contentSection)
    // console.log({orders})
  };
  useEffect(()=>{
    getOrdersByDay()
  },[])

  return (
    <CContainerView withBottomPadding={false} style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Ventas Realizadas"}/>
        <CView style={{flex:10}}>
          <SectionList
            sections={auxSectionListDataByDate}
            keyExtractor={(item, index) => item.order_id+ "_"+ index}
            style={{paddingHorizontal:10}}
            renderItem={({item}) => (
              <ItemOrderExtendedLink data={item}/>
            )}
            renderSectionHeader={({section: {title}}) => (<>
              <CText style={{color:"black", paddingTop:20, paddingHorizontal:10, borderRadius:10, marginBottom:5}}>
                {title}
              </CText>
            </>
            )}
            ListEmptyComponent={appliedFilters.date?
            <CText style={{textAlign:"center", marginTop:20}}>No hay registros para el filtro aplicado</CText>:
            <CText>No hay registros</CText>}
          />
          {/* <FlatList<ItemOrderExtended>
            data={mockOrders}
            renderItem={({item}) => <ItemOrderExtendedLink data={item}/> }
            keyExtractor={item => item.order_uui}
          /> */}
        </CView>
        <CView style={styles.sectionFilters}>
          <CView style={styles.filtersStyle}>
              <TouchableOpacity onPress={showDatepicker} style={styles.filtersBtnStyle}>
                  <Ionicons name="filter" size={25}/>
                  <CText type="default">Filtrar por fecha</CText>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                setAuxSectionListDataByDate(sectionListDataByDate)
                setAppliedFilters({
                  ...appliedFilters,
                  date: false,
                })
              }} style={{
                  flex:1,
                  justifyContent:"center",
                  alignItems:"center",
                  height:"100%",
              }}>
                  <Ionicons name="sync" size={25}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setopenModal2(true)} style={styles.filtersBtnStyle}>
                <Ionicons name="filter" size={25}/>
                <CText type="default">Otros filtros</CText>
              </TouchableOpacity>
          </CView>
        </CView>




        {/* <GenericModal
          title='Filtrar por Fecha'
          showModal={openModal1}
          setShowModal={setopenModal1}
          nodeContent={
            <>
              <Button onPress={showDatepicker} title="Show date picker!" />
            </>
          }
          textConfirmButton='qweqw'
        /> */}
        <GenericModal
          title='Otros filtros'
          showModal={openModal2}
          setShowModal={setopenModal2}
          nodeContent={<>
            <CView style={{flex:2, width:"100%", gap:10}}>
              <CView style={{flex:1}}>
                <CText>Seleccione una opción para filtrar</CText>
              </CView>
                <TouchableOpacity 
                  onPress={()=>{
                    setTextFieldToShow(0)
                    setTextInField("")
                    ToastAndroid.show("Ahora solo se muestran tus registros", ToastAndroid.SHORT)
                  }} 
                  style={styles.othersFiltersBtn}>
                    <CText style={{fontSize:20}} type="default">Ver solo mis registros</CText>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=>{
                  setTextFieldToShow(1)
                  setTextInField("")
                  ToastAndroid.show("Ingrese el nombre del usuario", ToastAndroid.SHORT)}
                } style={styles.othersFiltersBtn}>
                  <CText style={{fontSize:20}} type="default">Buscar por usuario</CText>
                </TouchableOpacity>
                {
                  textFieldToShow === 1 &&
                  <CView>
                    <CInputText value={textInField} onChangeText={(e)=>console.log(e)} label="Nombre del usuario" />
                  </CView>
                }
                <TouchableOpacity onPress={()=>{
                  setTextFieldToShow(2)
                  setTextInField("")
                  ToastAndroid.show("Ingrese el nombre del producto", ToastAndroid.SHORT)
                }} style={styles.othersFiltersBtn}>
                  <CText style={{fontSize:20}} type="default">Buscar por producto vendido</CText>
                </TouchableOpacity>
                {
                  textFieldToShow === 2 &&
                  <CView>
                    <CInputText value={textInField} onChangeText={(e)=>console.log(e)} label="Nombre del producto" />
                  </CView>
                }
                

            </CView>
          </>
          }
          textConfirmButton={'qweqw'}
        />
    </CContainerView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionFilters: {
    flex:1,
    flexDirection:"row",
    height:"100%",
  },
  filtersStyle: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    gap:10,
    height:"100%",
    padding:5,

  },
  filtersBtnStyle: {
    flex:7,
    gap:5,
    flexDirection:"row",
    borderWidth:2,
    borderColor:"#cecece",
    justifyContent:"center",
    alignItems:"center",
    height:"100%",
    borderRadius:10,

  },
  othersFiltersBtn: {
    flex:1,
    gap:5,
    flexDirection:"row",
    borderWidth:2,
    borderColor:"#cecece",
    justifyContent:"center",
    alignItems:"center",
    // height:20,
    width:"100%",
    borderRadius:10,
    padding:10,

  }
});




// const SectionListDataByDate = [
//   {
//     title:"Jueves 28 de agosto de 2025",
//     data:[
//       {
//         order_uui: 'uuid-001',
//         order_id: 1,
//         order_number: 1001,
//         details: '2x Hamburguesa, 1x Papas Fritas',
//         time: '11:15',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-002',
//         order_id: 2,
//         order_number: 1002,
//         details: '1x Pizza Margarita, 2x Gaseosa',
//         time: '11:45',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-003',
//         order_id: 3,
//         order_number: 1003,
//         details: '1x Ensalada César',
//         time: '12:05',
//         date: '2025-06-23'
//       },
//     ]
//   },
//   {
//     title: "Viernes 29 de agosto de 2025",
//     data:[
//       {
//         order_uui: 'uuid-004',
//         order_id: 4,
//         order_number: 1004,
//         details: '3x Tacos, 1x Agua con gas',
//         time: '12:28',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-005',
//         order_id: 5,
//         order_number: 1005,
//         details: '1x Lasaña, 1x Té Helado',
//         time: '12:50',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-006',
//         order_id: 6,
//         order_number: 1006,
//         details: '1x Pollo Frito, 1x Jugo de Naranja',
//         time: '13:10',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-007',
//         order_id: 7,
//         order_number: 1007,
//         details: '2x Sushi Rolls, 1x Agua',
//         time: '13:35',
//         date: '2025-06-23'
//       },
//     ]
//   },
//   {
//     title:"Sábado 30 de agosto de 2025",
//     data:[
//       {
//         order_uui: 'uuid-008',
//         order_id: 8,
//         order_number: 1008,
//         details: '1x Burrito, 1x Coca-Cola',
//         time: '13:50',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-009',
//         order_id: 9,
//         order_number: 1009,
//         details: '1x Filete de Res, 1x Vino Tinto',
//         time: '14:10',
//         date: '2025-06-23'
//       },
//       {
//         order_uui: 'uuid-010',
//         order_id: 10,
//         order_number: 1010,
//         details: '1x Helado, 1x Café Expreso',
//         time: '14:30',
//         date: '2025-06-23'
//       }
//     ]
//   }
  
// ]