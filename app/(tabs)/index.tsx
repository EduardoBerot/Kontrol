import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import { StatusBar } from 'expo-status-bar';
import Header from "../components/Header/Header";
import InfoBox from "../components/InfoBox";
import ProgressItem from "../components/ProgressItem";
import TransactionModal from "../components/TransactionModal/TransactionModal"
import { globalStyles } from "../styles/global"
import { Transaction } from '../components/TransactionModal/TransactionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "../utils/FormatCurrency";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Account } from '../types/Account';



// Tipagem
type Category = {
  id: any;
  name: any;
  icon: any;
  color: any;
  limit: any;
  spent: any;
};

const Index = () => {


  // Hooks
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<"despesa" | "receita" | "transferencia" | null>(null);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [balanceAccounts, setBalanceAccounts] = useState<string[]>([]);
  const [editBalanceModal, setEditBalanceModal] = useState(false);




  // Lê dados filtrando por mês e ano vindos do Header
 const readData = async () => {
  try {
    // Pega os dados do Async Storage
    const storedCategories = await AsyncStorage.getItem('categories');
    const storedTransactions = await AsyncStorage.getItem('transactions');
    const storedBalanceAccounts = await AsyncStorage.getItem("balanceAccounts");
    const storedAccounts = await AsyncStorage.getItem("accounts");

    // Parse dos dados
    const categoriesFromStorage: Category[] = storedCategories
      ? JSON.parse(storedCategories)
      : [];

    const transactionsFromStorage: Transaction[] = storedTransactions
      ? JSON.parse(storedTransactions)
      : [];

    const selectedAccounts: string[] = storedBalanceAccounts
      ? JSON.parse(storedBalanceAccounts)
      : [];

    const accountsFromStorage: Account[] = storedAccounts
      ? JSON.parse(storedAccounts)
      : [];

    // Identifica o período selecionado
    const isInSelectedPeriod = (dateString: string) => {
      const date = new Date(dateString);
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    };

    // Transações no período
    const transactionsInPeriod = transactionsFromStorage.filter(t =>
      isInSelectedPeriod(t.date)
    );

    // Receita e despesa (mantive como estava)
    const incomeTransactions =
      transactionsInPeriod.filter(t => t.type === "receita");

    const expenseTransactions =
      transactionsInPeriod.filter(t => t.type === "despesa");

    const totalIncome = incomeTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    const totalExpense = expenseTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    setTotalIncomes(totalIncome);
    setTotalExpenses(totalExpense);
    setBalanceAccounts(selectedAccounts);
    setAccounts(accountsFromStorage);

    // ✅ NOVO — saldo total baseado nas contas selecionadas
    const accountsFilteredBySelection =
      selectedAccounts.length === 0
        ? accountsFromStorage
        : accountsFromStorage.filter(acc =>
            selectedAccounts.includes(acc.id)
          );

    const totalBalance = accountsFilteredBySelection.reduce(
      (sum, acc) => sum + (acc.balance ?? 0),
      0
    );

    setTotalBalance(totalBalance);

    // Categorias com gasto
    const categoriesWithSpent = categoriesFromStorage.map(category => {
      const spentInCategory = transactionsInPeriod
        .filter(t => t.type === "despesa")
        .filter(t => t.category === category.name)
        .reduce((sum, { value }) => sum + value, 0);

      return {
        ...category,
        spent: spentInCategory
      };
    });

    setCategories(categoriesWithSpent);

  } catch (error) {
    console.log("Problemas ao ler os dados", error);
  }
};


  // Carregar dados pelo hook
  useFocusEffect(
    useCallback(() => {
      readData();
    }, [selectedMonth, selectedYear])
  );


  const toggleAccount = (id: string) => {
    setBalanceAccounts(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };


  const saveBalanceAccounts = async () => {
    await AsyncStorage.setItem(
      "balanceAccounts",
      JSON.stringify(balanceAccounts)
    );

    setEditBalanceModal(false);
    readData();
  };



  // Funções do FAB
  const toggleFab = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const closeFab = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(false);
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


  // Render
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" style="light" />

      <ScrollView style={[globalStyles.container]}>

        <Header
          showIndexContent={true}
          showTabsContent={false}
          TabTitle='Inicio'
          month={selectedMonth}
          year={selectedYear}
          onChangePeriod={(month, year) => {
            setSelectedMonth(month);
            setSelectedYear(year);
          }}
        />

        <View style={globalStyles.indexcontent}>
          <View style={[globalStyles.contentbox, globalStyles.itemscenter]}>

            <Pressable onPress={() => setEditBalanceModal(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <MaterialIcons name='edit' size={22} />
            </Pressable>


            <Pressable
              onPress={() => router.push("/(tabs)/transactions?filter=saldo")}
            >
              <Text style={globalStyles.title}>
                {formatCurrency(totalBalance)}
              </Text>
            </Pressable>


            <View style={globalStyles.row}>

              <Pressable
                onPress={() => router.push("/(tabs)/transactions?filter=receita")}
                style={{ flex: 1 }}
              >
                <InfoBox
                  label="Receitas"
                  value={formatCurrency(totalIncomes)}
                  color="green"
                />
              </Pressable>

              <Pressable
                onPress={() => router.push("/(tabs)/transactions?filter=despesa")}
                style={{ flex: 1 }}
              >
                <InfoBox
                  label="Despesas"
                  value={formatCurrency(totalExpenses)}
                  color="red"
                />
              </Pressable>


              <Modal visible={editBalanceModal} transparent>

                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>

                  <View style={{ backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 16 }}>

                    {accounts.map(acc => {
                      const selected = balanceAccounts.includes(acc.id);

                      return (
                        <Pressable
                          key={acc.id}
                          onPress={() => toggleAccount(acc.id)}
                          style={{ flexDirection: "row", justifyContent: "space-between", padding: 12 }}
                        >
                          <Text>{acc.name}</Text>

                          <MaterialIcons
                            name={selected ? "check-box" : "check-box-outline-blank"}
                            size={24}
                          />
                        </Pressable>
                      );
                    })}

                    <Pressable
                      onPress={saveBalanceAccounts}
                      style={{
                        backgroundColor: "#2563EB",
                        padding: 14,
                        borderRadius: 12,
                        marginTop: 20,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Salvar
                      </Text>
                    </Pressable>

                  </View>

                </View>

              </Modal>



            </View>

          </View>
        </View>

        <View style={globalStyles.indexcontent}>
          <View style={globalStyles.contentbox}>
            <Text style={[globalStyles.text, { textAlign: "center", marginBottom: 18 }]}>Orçamento</Text>

            {categories
              .filter(item => Number(item.limit) > 0)
              .map(item => (
                <ProgressItem
                  key={item.id}
                  icon={item.icon}
                  color={item.color}
                  label={item.name}
                  limit={formatCurrency(item.limit)}
                  spent={formatCurrency(item.spent)}
                />
              ))}
          </View>
        </View>
      </ScrollView>

      <Pressable onPress={toggleFab} style={styles.addbutton}>
        <MaterialIcons name="add" size={32} color="#fff" />
      </Pressable>

      {open && <Pressable style={styles.fabBackdrop} onPress={closeFab} />}

      <Animated.View style={[styles.fabMini, receitaStyle, { backgroundColor: "#22c55e" }]}>
        <Pressable onPress={() => {
          setTransactionType('receita');
          setmodalVisible(true);
        }}>
          <MaterialIcons name="trending-up" size={22} color="#fff" />
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.fabMini, transferenciaStyle, { backgroundColor: "#F59E0B" }]}>
        <Pressable onPress={() => {
          setTransactionType('transferencia');
          setmodalVisible(true);
        }}>
          <MaterialIcons name="sync-alt" size={22} color="#fff" />
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.fabMini, despesaStyle, { backgroundColor: "#ef4444" }]}>
        <Pressable onPress={() => {
          setTransactionType('despesa');
          setmodalVisible(true);
        }}>
          <MaterialIcons name="trending-down" size={22} color="#fff" />
        </Pressable>
      </Animated.View>

      <TransactionModal
        visible={modalVisible}
        onClose={() => setmodalVisible(false)}
        type={transactionType}
        onSaved={() => {
          readData();
        }}
      />

    </View>
  );
};

export default Index;

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
    zIndex: 15
  },
  fabBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 5,
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
    zIndex: 10,
  },
});
