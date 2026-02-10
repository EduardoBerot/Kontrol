import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import CategoryAddModal from "../components/CategoryAddModal/CategoryAddModal";
import CategoryRender from "../components/CategoryRender";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header/Header";
import { globalStyles } from "../styles/global";
import DraggableFlatList from "react-native-draggable-flatlist";

// Tipagem
type Category = {
  id: number;
  name: string;
  icon: any;
  color: string;
  limit: string;
  spent: string;
};

const categories = () => {
  // Hooks
  const [modalVisible, setmodalVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);


  //Lê as categorias do Async Storage
  const readData = async () => {
    try {
      const categoriesValue = await AsyncStorage.getItem("categories");
      if (categoriesValue) {
        setCategories(JSON.parse(categoriesValue));
      }
    } catch {
      console.log("Erro ao ler dados");
    }
  };

  // Função pra salvar reorganização das categorias
  const saveCategories = async (newCategories: Category[]) => {
    try {
      setCategories(newCategories);
      await AsyncStorage.setItem("categories", JSON.stringify(newCategories));
    } catch {
      console.log("Erro ao salvar categorias");
    }
  };



  useFocusEffect(
    useCallback(() => {
      readData();
    }, [])
  );


  // Render
  return (
    <View
      style={[globalStyles.container]}
    >

      <Header showIndexContent={false} showTabsContent={true} TabTitle="Editar Categorias" />

      <View style={[globalStyles.content, { flex: 1 }]}>
        <View style={[globalStyles.contentbox, { marginTop: 20, maxHeight: "80%" }]}>
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

          <View style={{ maxHeight: "90%"}}>
            <DraggableFlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              onDragEnd={({ data }) => saveCategories(data)}
              renderItem={({ item, drag, isActive }) => (
                <View>
                  <Pressable
                    delayLongPress={250}
                    onLongPress={drag}
                    style={{
                      transform: [
                        { scale: isActive ? 1.06 : 1 },
                        { translateX: isActive ? 10 : 0 }
                      ],
                      zIndex: isActive ? 999 : 0,
                      elevation: isActive ? 20 : 0,
                    }}

                  >

                    <CategoryRender
                      title={item.name}
                      icon={item.icon}
                      color={item.color}
                      onEdit={() => {
                        setEditCategory(item);
                        setmodalVisible(true);
                      }}
                    />
                  </Pressable>
                </View>
              )}
            />
          </View>




        </View>
      </View>


      <CategoryAddModal
        visible={modalVisible}
        onClose={() => {
          setmodalVisible(false);
          setEditCategory(null);
        }}
        onSaved={() => {
          readData();
          setmodalVisible(false);
        }}
        category={editCategory}
      />

    </View>
  );
}

export default categories

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
