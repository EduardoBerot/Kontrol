import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CategoryAddModal from "../components/CategoryAddModal/CategoryAddModal";
import CategoryRender from "../components/CategoryRender";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header/Header";
import { globalStyles } from "../styles/global";
import { BankKey } from "../utils/BanksLogo";
import AccountRender from "../components/AccountRender";
import AccountAddModal from "../components/AccountAddModal/AccountAddModal";


const EditCategories = () => {

  // Tipagem

  type Account = {
    id: number;
    name: string;
    bank: BankKey;
    balance: string;
  };


  type Category = {
    id: number;
    name: string;
    icon: any;
    color: string;
    limit: string;
    spent: string;
  };


  // Hooks
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);


  const [modalVisible, setmodalVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);


  //Lê dados do Async Storage
  const readData = async () => {
    try {
      const [categoriesValue, accountsValue] = await Promise.all([
        AsyncStorage.getItem("categories"),
        AsyncStorage.getItem("accounts"),
      ]);

      if (categoriesValue) {
        setCategories(JSON.parse(categoriesValue));
      }

      if (accountsValue) {
        setAccounts(JSON.parse(accountsValue));
      }
    } catch {
      console.log("Erro ao ler dados");
    }
  };


  const readAccounts = async () => {
    try {
      const value = await AsyncStorage.getItem("accounts");
      if (value) {
        setAccounts(JSON.parse(value));
      }
    } catch {
      console.log("Erro ao ler contas");
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
      style={globalStyles.container}
    >

      <Header showIndexContent={false} showTabsContent={true} TabTitle="Editar Categorias" />


      <View style={globalStyles.content}>
        <View style={[globalStyles.contentbox, { marginTop: 20 }]}>
          <View
            style={[
              globalStyles.row,
              globalStyles.spacebetween,
              globalStyles.itemscenter,
              { marginBottom: 20 }
            ]}
          >
            <Text style={globalStyles.mintitle}>Contas</Text>
            <Pressable
              onPress={() => setAccountModalVisible(true)}
              style={({ pressed }) => [
                styles.addbutton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
              ]}
            >
              <MaterialIcons name="add" size={16} />
            </Pressable>
          </View>

          {accounts.map(item => (
            <AccountRender
              key={item.id}
              name={item.name}
              bank={item.bank}
              onEdit={() => {
                setEditAccount(item);
                setAccountModalVisible(true);
              }}
            />
          ))}
        </View>
      </View>




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
              onEdit={() => {
                setEditCategory(item);
                setmodalVisible(true)
              }}
            />
          ))}
        </View>
      </View>

      <AccountAddModal
        visible={accountModalVisible}
        onClose={() => {
          setAccountModalVisible(false);
          setEditAccount(null);
        }}
        onSaved={() => {
          readAccounts();
          setAccountModalVisible(false);
        }}
        account={editAccount}
      />



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

export default EditCategories

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
