import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import AccountAddModal from "../components/AccountAddModal/AccountAddModal";
import AccountRender from "../components/AccountRender";
import Header from "../components/Header/Header";
import { globalStyles } from "../styles/global";
import { Account } from "../types/Account";
import { useTransactionsContext } from "../context/TransactionContext";


const accounts = () => {

  // Hooks
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);


  //Lê as contas do Async Storage
  const readAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem("accounts");

      if (stored) {
        setAccounts(JSON.parse(stored));
      } else {
        setAccounts([]);
      }

    } catch (error) {
      console.log("Erro ao ler contas:", error);
    }
  };


  // Função pra salvar reorganização das contas
  const saveAccounts = async (newAccounts: Account[]) => {
    try {
      setAccounts(newAccounts);
      await AsyncStorage.setItem("accounts", JSON.stringify(newAccounts));
    } catch {
      console.log("Erro ao salvar contas");
    }
  };

  const { refresh } = useTransactionsContext();

  useFocusEffect(
    useCallback(() => {
      readAccounts();
    }, [refresh])
  );



  // Render
  return (
    <View
      style={[globalStyles.container]}
    >

      <Header showIndexContent={false} showTabsContent={true} TabTitle="Editar suas contas" />


      <View style={[globalStyles.content, { flex: 1 }]}>
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

          <View style={{ maxHeight: "90%" }}>
            <DraggableFlatList
              data={accounts}
              keyExtractor={(item) => item.id.toString()}
              onDragEnd={({ data }) => saveAccounts(data)}
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

                    <AccountRender
                      id={item.id}
                      name={item.name}
                      bank={item.bank}
                      balance={item.balance}
                      onEdit={() => {
                        setEditAccount(item);
                        setAccountModalVisible(true);
                      }}
                    />
                  </Pressable>
                </View>
              )}
            />
          </View>



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


    </View>
  );
}

export default accounts

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
