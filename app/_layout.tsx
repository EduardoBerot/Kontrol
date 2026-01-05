import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: "right",
          headerShown: false,
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Inicio" }} />
        <Drawer.Screen name="form" options={{ title: "Editar Categorias" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
