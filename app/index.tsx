import { Text, View, StyleSheet, ScrollView, Pressable, Animated } from "react-native";
import { useRef, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { StatusBar } from 'expo-status-bar';


type HeaderProps = {
  month: string;
};

type InfoBoxProps = {
  label: string;
  value: string;
  color?: string;
};

const InfoBox = ({ label, value, color }: InfoBoxProps) => (
  <View style={[styles.contentboxinfo, styles.itemscenter]}>
    <Text style={styles.mintext}>{label}</Text>
    <Text style={[styles.mintitle, { color }]}>{value}</Text>
  </View>
);

const getProgressColor = (progress: number) => {
  if (progress < 0.5) return "#22c55e";   // verde: uso saudável
  if (progress < 0.8) return "#eab308";   // amarelo: atenção
  return "#ef4444";                       // vermelho: limite estourando
};

const progressValue = 0.9;

const ProgressItem = () => (
  <View style={{ gap: 8, marginBottom: 20 }}>
    <View style={[styles.row, styles.spacebetween]}>
      <MaterialIcons name="local-grocery-store" size={30} />
      <Text>Supermercado</Text>
      <Text>R$ 1.000</Text>
    </View>

    <View style={[styles.itemscenter, styles.row]}>
      <Progress.Bar
        progress={progressValue}
        width={null}
        height={20}
        borderRadius={20}
        color={getProgressColor(progressValue)}
        unfilledColor="#f0f1f3ff"   // fundo da barra (cinza claro)
        borderWidth={1}
        borderColor="#d1d5db"
        animated
        style={{
          flex: 1,
        }}
      />
    </View>

    <View style={[styles.row, styles.spacebetween]}>
      <Text style={styles.mintext}>Restam: R$ 200</Text>
      <Text style={styles.mintext}>80% utilizado</Text>
    </View>
  </View>
);



export default function Index() {

  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const Header = ({ month }: HeaderProps) => (
    <View style={[styles.header, styles.row, styles.itemscenter]}>
      <MaterialIcons name="person" size={30} color="#fff" />
      <Text style={{ textAlign: "center", color: "#fff", fontSize: 24 }}>
        {month}
        <MaterialIcons name="arrow-drop-down" size={25} />
      </Text>
      <Text style={{ textAlign: "center" }}>
        <MaterialIcons onPress={openDrawer} name="menu" size={30} color="#fff" />
      </Text>
    </View>
  );

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
      <ScrollView style={styles.container}>
        <Header month="Janeiro" />
        <View style={styles.content}>
          <View style={[styles.contentbox, styles.itemscenter]}>
            <Text style={styles.text}>Saldo total</Text>
            <Text style={styles.title}>R$ 8.908,87</Text>
            <View style={styles.row}>
              <InfoBox label="Receitas" value="R$ 4.500" color="green" />
              <InfoBox label="Despesas" value="R$ -4.500" color="red" />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.contentbox}>
            <Text style={[styles.text, { textAlign: "center", marginBottom: 18 }]}>Orçamento</Text>
            <ProgressItem />
            <ProgressItem />
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
  row: {
    flexDirection: "row"
  },

  itemscenter: {
    alignItems: "center"
  },

  spacebetween: {
    justifyContent: "space-between"
  },

  container: {
    flex: 1,
    backgroundColor: "#efefefff",
  },

  header: {
    height: 130,
    backgroundColor: "rgba(37, 97, 236, 1)",
    justifyContent: "space-between",
    padding: 20,
  },

  content: {
    justifyContent: "center",
    top: -30,
    flexDirection: "row"
  },

  text: {
    fontSize: 16,
    color: "#787878ff"
  },

  mintext: {
    fontSize: 12,
    color: "#787878ff"
  },

  mintitle: {
    fontSize: 20,
    color: "#000"
  },

  title: {
    fontSize: 28,
    color: "#000"
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

  contentboxinfo: {
    flex: 1
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
