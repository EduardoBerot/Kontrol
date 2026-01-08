import { Text, View, StyleSheet, Pressable } from "react-native";
import { globalStyles } from "../styles/global";
import Header from "../components/Header/Header";
import { MaterialIcons } from "@expo/vector-icons";
import { Categories } from "../utils/Categories";
import { CategoryRender } from "../components/CategoryRender";
import { useState } from "react";
import { CategoryAddModal } from "../components/CategoryAddModal";


export default function Form() {


  const [modalVisible, setmodalVisible] = useState(false)

  return (
    <View
      style={globalStyles.container}
    >
      <Header showIndexContent={false} showTabsContent={true} TabTittle="Editar Categorias" />
      <View style={globalStyles.content}>
        <View style={[globalStyles.contentbox, { marginTop: 20 }]}>
          <View style={[globalStyles.row, globalStyles.spacebetween, globalStyles.itemscenter, { marginBottom: 20 }]}>
            <Text style={globalStyles.mintitle}>Categorias</Text>
            <Pressable
              onPress={() => setmodalVisible(true)}
              style={({ pressed }) => [
                styles.addbutton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
              ]}>
              <MaterialIcons name="add" size={16} />
            </Pressable>
          </View>
          {Categories.map(item => (
            <CategoryRender
              key={item.id}
              title={item.title}
              icon={item.icon}
              onEdit={() => console.log("Editar", item.title)}
            />
          ))}
        </View>
      </View>
      <CategoryAddModal visible={modalVisible} onClose={() => setmodalVisible(false)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  addbutton: {
    backgroundColor: "#eee",
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  categoryitem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 10
  }
})
