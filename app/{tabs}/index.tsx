import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { StatusBar } from 'expo-status-bar';


import Header from "../components/Header/Header";
import InfoBox from "../components/InfoBox";
import ProgressItem from "../components/ProgressItem";
import { globalStyles } from "../styles/global";













export default function Index() {



  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  // const Header = ({ month }: HeaderProps) => (

  // );

  const toggleFab = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };


  const receitaStyle = {
    transform: [
      { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
    ],
    opacity: animation,
  };

  const transferenciaStyle = {
    transform: [
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -85] }) },
    ],
    opacity: animation,
  };

  const despesaStyle = {
    transform: [
      { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
    ],
    opacity: animation
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        style="light"
      />
      <ScrollView style={globalStyles.container}>
        <Header showIndexContent={true} showTabsContent={false} TabTittle='Inicio'/>
        <View style={styles.content}>
          <View style={[styles.contentbox, globalStyles.itemscenter]}>
            <Text style={globalStyles.text}>Saldo total</Text>
            <Text style={globalStyles.title}>R$ 8.908,87</Text>
            <View style={globalStyles.row}>
              <InfoBox label="Receitas" value="R$ 4.500" color="green" />
              <InfoBox label="Despesas" value="R$ -4.500" color="red" />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.contentbox}>
            <Text style={[globalStyles.text, { textAlign: "center", marginBottom: 18 }]}>Orçamento</Text>
            <ProgressItem
              icon="local-grocery-store"
              label="Supermercado"
              spent={800}
              limit={1000}
            />
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={toggleFab}
        style={({ pressed }) => [
          styles.addbutton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
        ]}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </Pressable>

      <Animated.View style={[styles.fabMini, receitaStyle, { backgroundColor: "#22c55e" }]}>
        <Pressable onPress={() => console.log("Receita")}>
          <MaterialIcons name="trending-up" size={22} color="#fff" />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.fabMini, transferenciaStyle, { backgroundColor: "#8b5cf6" }]}>
        <Pressable onPress={() => console.log("Transferência")}>
          <MaterialIcons name="sync-alt" size={22} color="#fff" />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.fabMini, despesaStyle, { backgroundColor: "#ef4444" }]}>
        <Pressable onPress={() => console.log("Despesa")}>
          <MaterialIcons name="trending-down" size={22} color="#fff" />
        </Pressable>
      </Animated.View>
    </View>

  );
}


const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    top: -30,
    flexDirection: "row"
  },


  contentbox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    marginBottom: 20
  },

  addbutton: {
    backgroundColor: "rgba(37, 97, 236, 1)",
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    bottom: "7%",
    alignSelf: "center",
    position: "absolute",
    borderRadius: 28,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "#000",
    zIndex: 10
  },

  fabMini: {
    position: "absolute",
    alignSelf: "center",
    bottom: 52,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
})
