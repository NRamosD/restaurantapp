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
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import { useState } from "react";
import { TopBarWithMenu } from "@/components/TopBarWithMenu";

export default function HomeScreen() {
  const [nameProduct, setNameProduct] = useState<string>("");
  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    <>
      <SafeAreaView style={styles.container}>
        <TopBarWithMenu title={"qweqweqw qwe qw"}/>

        <ScrollView style={styles.scrollView}>
          <Text>Contenido seguro aquí</Text>

          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Welcome!</ThemedText>
            <HelloWave />
            <Link href={"/inventory/:tomate"}>Veamos el tomate</Link>
          </ThemedView>
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
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 1: Try it</ThemedText>
            <ThemedText>
              Edit{" "}
              <ThemedText type="defaultSemiBold">
                app/(tabs)/index.tsx
              </ThemedText>{" "}
              to see changes. Press{" "}
              <ThemedText type="defaultSemiBold">
                {Platform.select({
                  ios: "cmd + d",
                  android: "cmd + m",
                  web: "F12",
                })}
              </ThemedText>{" "}
              to open developer tools.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
            <ThemedText>
              Tap the Explore tab to learn more about what's included in this
              starter app.
            </ThemedText>
            <Link href={"/inventory/(tabs)"}>asdas</Link>
            <Button
              title="qweqw"
              color={"#123"}
              accessibilityLabel="qweqw"
              onPress={() => {
                router.push("/inventory/(tabs)");
              }}
            />
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView:{
    paddingHorizontal: 5,
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
