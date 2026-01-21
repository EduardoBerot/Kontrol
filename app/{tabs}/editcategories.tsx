import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useState} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CategoryAddModal } from "../components/CategoryAddModal/CategoryAddModal";
import { CategoryRender } from "../components/CategoryRender";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header/Header";
import { globalStyles } from "../styles/global";


export default function editcategories() {

  // Tipagem (falta ajustar)
  type Category = {
    id: any;
    name: any;
    icon: any;
    color: any;
    limit: any;
    spent: any;
  };


  // Hooks
  const [modalVisible, setmodalVisible] = useState(false)
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

          {categories.map(item => (
            <CategoryRender
              key={item.id}
              title={item.name}
              icon={item.icon}
              color={item.color}
              onEdit={() => console.log("Editar", item.name)}
            />
          ))}


        </View>
      </View>


      <CategoryAddModal
        visible={modalVisible}
        onClose={() => setmodalVisible(false)}
        onSaved={() => {
          readData(); 
          setmodalVisible(false);
        }}
      />

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
