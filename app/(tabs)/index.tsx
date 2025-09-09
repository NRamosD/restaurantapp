import {
  Image,
  StyleSheet,
  Platform,
  Button,
  View,
  TextInput,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { CText } from "@/components/CText";
import { CView } from "@/components/CView";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TopBarWithMenu } from "@/components/TopBarWithMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuPopUpGeneral from "@/components/MenuPopUpGeneral";
import CButton from "@/components/CButton";
import { Ionicons } from "@expo/vector-icons";
import { ItemOrderLink } from "@/components/orders";
import { createComponent, getAllComponents } from "@/database/components.operations";
import { dbConnection } from "@/database/database.connection";
import { Componente } from "@/interfaces";

export default function HomeScreen() {
  // const [nameProduct, setNameProduct] = useState<string>("");
  const [components, setComponents] = useState<Componente[]>([])
  const insets = useSafeAreaInsets()


  const createComponentWithButton = async () => {
    await createComponent(await dbConnection, {
      nombre: "Nuevo Componente",
      descripcion: "Descripción del nuevo componente",
      tipo: "Tipo del nuevo componente",
      material: "Material del nuevo componente",
      peso: 1.5,
      longitud: 50,
      ancho: 30,
      alto: 20,
      calorias: 150,
      stock: 0,
      porciones: 3,
      color: "#FF0000",
    });

  }

  const getComponentsList = async () => {
    const components = await getAllComponents(await dbConnection)
    alert(components)
    console.log(components)
    setComponents(components)
  }

  useEffect(() => {
    getComponentsList()
  }, [components])


  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    <View style={{
      flex: 1,
      flexDirection:"column",
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
        <TopBarWithMenu title={"Inicio"}/>
        <CView style={{flex:3}}>
          <CText type="title" style={{textAlign:"center", paddingVertical:5}}>
            Pendientes de Facturar
          </CText>
          <ScrollView style={styles.scrollView}>
            <ItemOrderLink path={"/orders/create-order"}/>
            <ItemOrderLink path={"/orders/create-order"}/>
            <ItemOrderLink path={"/orders/create-order"}/>
            <ItemOrderLink path={"/orders/create-order"}/>
            <ItemOrderLink path={"/orders/create-order"}/>
          </ScrollView>
        </CView>
        <View style={styles.easyAccess}>
          <CText type="title" style={{padding:5}}>
            Acceso Rápido
          </CText>
          <CView style={styles.easyAccessOptionsContainer}>
            <TouchableOpacity onPress={()=>router.push({pathname:"/inventory/top-sellers"})} style={styles.easyAccessOption}>
              <Ionicons name="heart-outline" size={70}/>
              <CText type="subtitle" style={{fontSize:14}}>Más Vendidos</CText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push({pathname:"/inventory/create-product"})} style={styles.easyAccessOption}>
              <Ionicons name="storefront-outline" size={70}/>
              <CText type="subtitle" style={{fontSize:13}}>Nuevo Producto</CText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push({pathname:"/settings"})} style={styles.easyAccessOption}>
              <Ionicons name="settings-outline" size={70}/>
              <CText type="subtitle" style={{fontSize:14}}>Ajustes</CText>
            </TouchableOpacity>
          </CView>

        </View>
        <View style={styles.contNewPedido}>
          <CButton onPress={()=>router.push({pathname:"/orders/create-order"})} title={"NUEVO PEDIDO"} containerStyles={styles.touchableCreate}/>
        </View>
        <View style={styles.contNewPedido}>
          <CButton onPress={()=>{
            createComponentWithButton()
          }} title={"NUEVO componente"} containerStyles={styles.touchableCreate}/>
        </View>
        <View style={styles.contNewPedido}>
          <CText type="title" style={{textAlign:"center", paddingVertical:5}}>
            Componentes
          </CText>
          <ScrollView style={styles.scrollView}>
            {components.map((componente, index) => (
              <CText key={index} style={{padding:5}}>{componente.nombre}</CText>
            ))}
          </ScrollView>
        </View>
    </View>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingTop: 20,
  // },
  touchableCreate:{
    backgroundColor:"#dedede",
    padding:10,
    textAlign:"center",
    justifyContent:"center",
    borderRadius:10,
    height:80,
    borderWidth:5,
    borderColor:"#cecece"
  },
  scrollView:{
    flex:1,
    paddingHorizontal: 5,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderBottomColor:"#ccc",
    borderTopColor:"#ccc"
  },
  easyAccessOptionsContainer:{ 
    flex:1, 
    flexDirection:"row", 
    margin:5,
    padding:5,
    borderRadius:10, 
    gap:10
  },
  easyAccessOption: { 
    flex:1, 
    justifyContent:"center", 
    alignItems:"center",
    boxShadow:"#cecece 0px 5px 5px 2px",
    borderRadius:5,
    marginHorizontal:5, 
    marginVertical:10,
  },
  easyAccess: {
    flex:2,
    padding:5,
  },
  contNewPedido: {
    flex:1, 
    paddingHorizontal:10, 
    paddingVertical:5,
    justifyContent:"center"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});





{/* <Text>Contenido seguro aquí</Text>

<CView style={styles.titleContainer}>
  <CText type="title">Welcome!</CText>
  <HelloWave />
  <Link href={"/inventory/:tomate"}>Veamos el tomate</Link>
</CView>
<View style={{ padding: 10, display: "flex", gap: 15 }}>
  <TextInput
    onChangeText={(text) => setNameProduct(text)}
    style={{
      borderStyle: "solid",
      borderWidth: 5,
      borderColor: "red",
      borderRadius: 10,
    }}
  />
  <Button
    title="aquiii"
    onPress={() => {
      router.navigate(`inventory/:${nameProduct}`);
    }}
  />
</View>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 1: Try it</CText>
  <CText>
    Edit{" "}
    <CText type="defaultSemiBold">
      app/(tabs)/index.tsx
    </CText>{" "}
    to see changes. Press{" "}
    <CText type="defaultSemiBold">
      {Platform.select({
        ios: "cmd + d",
        android: "cmd + m",
        web: "F12",
      })}
    </CText>{" "}
    to open developer tools.
  </CText>
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 2: Explore</CText>
  <CText>
    Tap the Explore tab to learn more about what's included in this
    starter app.
  </CText>
  <Link href={"/inventory/(tabs)"}>asdas</Link>
  <Button
    title="qweqw"
    color={"#123"}
    accessibilityLabel="qweqw"
    onPress={() => {
      router.push("/inventory/(tabs)");
    }}
  />
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 3: Get a fresh start</CText>
  <CText>
    When you're ready, run{" "}
    <CText type="defaultSemiBold">
      npm run reset-project
    </CText>{" "}
    to get a fresh <CText type="defaultSemiBold">app</CText>{" "}
    directory. This will move the current{" "}
    <CText type="defaultSemiBold">app</CText> to{" "}
    <CText type="defaultSemiBold">app-example</CText>.
  </CText>
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 3: Get a fresh start</CText>
  <CText>
    When you're ready, run{" "}
    <CText type="defaultSemiBold">
      npm run reset-project
    </CText>{" "}
    to get a fresh <CText type="defaultSemiBold">app</CText>{" "}
    directory. This will move the current{" "}
    <CText type="defaultSemiBold">app</CText> to{" "}
    <CText type="defaultSemiBold">app-example</CText>.
  </CText>
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 3: Get a fresh start</CText>
  <CText>
    When you're ready, run{" "}
    <CText type="defaultSemiBold">
      npm run reset-project
    </CText>{" "}
    to get a fresh <CText type="defaultSemiBold">app</CText>{" "}
    directory. This will move the current{" "}
    <CText type="defaultSemiBold">app</CText> to{" "}
    <CText type="defaultSemiBold">app-example</CText>.
  </CText>
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 3: Get a fresh start</CText>
  <CText>
    When you're ready, run{" "}
    <CText type="defaultSemiBold">
      npm run reset-project
    </CText>{" "}
    to get a fresh <CText type="defaultSemiBold">app</CText>{" "}
    directory. This will move the current{" "}
    <CText type="defaultSemiBold">app</CText> to{" "}
    <CText type="defaultSemiBold">app-example</CText>.
  </CText>
</CView>
<CView style={styles.stepContainer}>
  <CText type="subtitle">Step 3: Get a fresh start</CText>
  <CText>
    When you're ready, run{" "}
    <CText type="defaultSemiBold">
      npm run reset-project
    </CText>{" "}
    to get a fresh <CText type="defaultSemiBold">app</CText>{" "}
    directory. This will move the current{" "}
    <CText type="defaultSemiBold">app</CText> to{" "}
    <CText type="defaultSemiBold">app-example</CText>.
  </CText>
</CView> */}








