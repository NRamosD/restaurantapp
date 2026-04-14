import { StyleSheet, TouchableOpacity, SectionList, ToastAndroid, RefreshControl } from 'react-native';
import dayjs from 'dayjs'
import "dayjs/locale/es";
dayjs.locale("es");
import { CText } from '@/components/CText';
import { CView } from '@/components/CView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CContainerView } from '@/components/CContainerView';
import ItemOrderExtendedLink from '@/components/orders/ItemOrderExtendedLink';
import { Ionicons } from '@expo/vector-icons';
import GenericModal from '@/components/ui/GenericModal';
import React, { useEffect, useState } from 'react';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CInputText from '@/components/CInputText';
import { useIsFocused } from '@react-navigation/native';
import { useOrdenService } from '@/modules';
import { useAppearanceStore } from '@/hooks/useAppearanceStore';




export default function TabTwoScreen() {
  const isFocused = useIsFocused();
  const themePreset = useAppearanceStore((state) => state.themePreset);

  const [textFieldToShow, setTextFieldToShow] = useState(0);
  const [openModal2, setopenModal2] = useState(false);
  const [textInField, setTextInField] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    date: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date());


  



  // const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState<any>('date');
  const [show, setShow] = useState(false);
  const [sectionListDataByDate, setSectionListDataByDate] = useState<any>([]);
  const [auxSectionListDataByDate, setAuxSectionListDataByDate] = useState<any>([]);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDateFilter(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: dateFilter,
      onChange: (_event, date) => {
        setDateFilter(date!);
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
  const { obtenerOrdenesPorFecha } = useOrdenService();

  const getOrdersByDay = async () => {
    let startDate = dayjs().subtract(30, "day").format("YYYY-MM-DD")
    const endDate = dayjs().add(5, "hours").format("YYYY-MM-DD")
    let contentSection = []
    while (startDate <= endDate) {
      console.log("startDate", startDate)
      const ordersByDate = await obtenerOrdenesPorFecha(startDate);
      console.log("ordersByDate", ordersByDate)
      if(ordersByDate.length > 0){
        const dataWithLocalDate = ordersByDate.map((order: any) => {
          return {
            ...order,
            fecha: dayjs.utc(order.fecha).local()
          }
        })
        contentSection.push({title: dayjs(startDate).local().format("dddd, D [de] MMMM [de] YYYY")?.toUpperCase()  , data: dataWithLocalDate})
      }
      startDate = dayjs(startDate).add(1, "day").format("YYYY-MM-DD")
    }
    console.log("contentSection",contentSection)
    setSectionListDataByDate(contentSection)
    setAuxSectionListDataByDate(contentSection)
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      getOrdersByDay()
      setRefreshing(false);
    }, 1500);
  };
  useEffect(() => {
    if (!isFocused) return;
    getOrdersByDay();
  }, [isFocused]);

  useEffect(() => {
    DateTimePickerAndroid.dismiss('date');
  }, []);

  return (
    <CContainerView withBottomPadding={false} style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <CView style={{flex:1}}>
          <TopBarWithMenu title={"Ventas Realizadas"}/>
        </CView>
        <CView style={{flex:10}}>
          <SectionList
            sections={auxSectionListDataByDate}
            keyExtractor={(item, index) => item.order_id+ "_"+ index}
            style={{paddingHorizontal:10}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            bounces={true}
            alwaysBounceVertical={true}
            renderItem={({item}) => (
              <ItemOrderExtendedLink data={item}/>
            )}
            renderSectionHeader={({section: {title}}) => (<>
              <CText style={{paddingTop:20, paddingHorizontal:10, borderRadius:10, marginBottom:5}}>
                {title}
              </CText>
            </>
            )}
            ListEmptyComponent={appliedFilters.date?
            <CText style={{textAlign:"center", marginTop:20}}>No hay registros para el filtro aplicado</CText>:
            <CText style={{textAlign:"center", marginTop:20}}>No hay registros</CText>}
          />
        </CView>
        <CView style={styles.sectionFilters}>
          <CView style={styles.filtersStyle}>
              <TouchableOpacity onPress={showDatepicker} style={styles.filtersBtnStyle}>
                  <Ionicons name="filter" size={25} color={themePreset === "dark" ? "white" : "black"}/>
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
                  <Ionicons name="sync" size={25} color={themePreset === "dark" ? "white" : "black"}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setopenModal2(true)} style={styles.filtersBtnStyle}>
                <Ionicons name="filter" size={25} color={themePreset === "dark" ? "white" : "black"}/>
                <CText type="default">Otros filtros</CText>
              </TouchableOpacity>
          </CView>
        </CView>

        <GenericModal
          title='Seleccione un filtro'
          showModal={openModal2}
          setShowModal={setopenModal2}
          textConfirmButton={'Buscar'}
          nodeContent={
            <CView style={{flex:2, width:"100%", gap:10, padding:10}} darkColor="black" >
                <TouchableOpacity 
                  onPress={()=>{
                    setTextFieldToShow(0)
                    setTextInField("")
                    ToastAndroid.show("Ahora solo se muestran tus registros", ToastAndroid.LONG)
                    setopenModal2(false)
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
          
          }
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

