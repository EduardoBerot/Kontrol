import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: "right",
          headerShown: false,
          drawerStyle: styles.drawer,
          drawerActiveTintColor: "#2563EB",
          drawerInactiveTintColor: "#6B7280",
          drawerActiveBackgroundColor: "#EFF6FF",
          drawerLabelStyle: styles.drawerLabel,
          drawerItemStyle: styles.drawerItem,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Início",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="editcategories"
          options={{
            title: "Editar Categorias",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="edit" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#FFFFFF",
    width: "75%",
    alignItems: "flex-start",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  drawerLabel: {
    fontSize: 15,
    fontWeight: "500",
  },

  drawerItem: {
    width: "100%",
    flex: 1,
    borderRadius: 16,
    marginVertical: 4,
  },
});
