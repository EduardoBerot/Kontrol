import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import Header from "../components/Header/Header";
import InfoBox from "../components/InfoBox";
import ProgressItem from "../components/ProgressItem";
import { globalStyles } from "../styles/global";
import { Categories } from '../utils/Categories';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Category = {
  id: any;
  name: any;
  icon: any;
  color: any;
  limit: any;
  spent: any;
};



export default function Index() {

  // Hooks
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [categories, setCategories] = useState<Category[]>([]);

  //Lê dados do Async Storage
  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem('categories');
      if (value !== null) {
        const parsed: Category[] = JSON.parse(value);
        setCategories(parsed);
      }
    } catch {
      console.log("Problemas ao ler os dados")
    }
  }

  useFocusEffect(
    useCallback(() => {
      readData();
    }, [])
  );


  // Abrir FABs
  const toggleFab = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  // Funções de animações
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

      <ScrollView style={[globalStyles.container]}>

        <Header showIndexContent={true} showTabsContent={false} TabTittle='Inicio' />

        <View style={globalStyles.indexcontent}>
          <View style={[globalStyles.contentbox, globalStyles.itemscenter]}>
            <Text style={globalStyles.text}>Saldo total</Text>
            <Text style={globalStyles.title}>R$ 8.908,87</Text>
            <View style={globalStyles.row}>
              <InfoBox label="Receitas" value="R$ 4.500" color="green" />
              <InfoBox label="Despesas" value="R$ -4.500" color="red" />
            </View>
          </View>
        </View>

        <View style={globalStyles.indexcontent}>
          <View style={globalStyles.contentbox}>
            <Text style={[globalStyles.text, { textAlign: "center", marginBottom: 18 }]}>Orçamento</Text>
            {categories.map(item => (
              <ProgressItem
                key={item.id}
                icon={item.icon}
                color={item.color}
                label={item.name}
                limit={item.limit}
                spent={item.spent}
              />
            ))}
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
