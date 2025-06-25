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
import { Link, router } from "expo-router";
import { useState } from "react";
import { TopBarWithMenu } from "@/components/TopBarWithMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuPopUpGeneral from "@/components/MenuPopUpGeneral";
import CButton from "@/components/CButton";
import { Ionicons } from "@expo/vector-icons";
import { ItemOrderLink } from "@/components/orders";

export default function HomeScreen() {
  // const [nameProduct, setNameProduct] = useState<string>("");
  const insets = useSafeAreaInsets()
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
            Ventas Recientes
          </CText>
          <ScrollView style={styles.scrollView}>
            <ItemOrderLink/>
            <ItemOrderLink/>
            <ItemOrderLink/>
            <ItemOrderLink/>
            <ItemOrderLink/>
          </ScrollView>
        </CView>
        <View style={styles.easyAccess}>
          <CText type="title" style={{padding:5}}>
            Acceso Rápido
          </CText>
          <CView style={styles.easyAccessOptionsContainer}>
            <TouchableOpacity style={styles.easyAccessOption}>
              <Ionicons name="woman" size={70}/>
              <CText type="subtitle">Option 1</CText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.easyAccessOption}>
              <Ionicons name="woman" size={70}/>
              <CText type="subtitle">Option 2</CText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.easyAccessOption}>
              <Ionicons name="woman" size={70}/>
              <CText type="subtitle">Option 3</CText>
            </TouchableOpacity>
          </CView>

        </View>
        <View style={styles.contNewPedido}>
          <CButton title={"NUEVO PEDIDO"} containerStyles={styles.touchableCreate}/>
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








