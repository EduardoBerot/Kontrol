import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCallback, useRef, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Transaction } from '@/types/Transaction';
import TransactionModal from '@/components/TransactionModal/TransactionModal';
import { globalStyles } from "../../styles/global";
import { Account } from '../../types/Account';
import { formatCurrency } from "../../utils/FormatCurrency";
import Header from '@/components/Header';
import InfoBox from '@/components/InfoBox';
import ProgressItem from '@/components/ProgressItem';
import { Category } from '@/types/Category';


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


  // Salva os dados do AsyncStorage nas suas respectivas constantes
  const loadStorageData = async () => {
    const [
      storedCategories,
      storedTransactions,
      storedBalanceAccounts,
      storedAccounts
    ] = await Promise.all([
      AsyncStorage.getItem("categories"),
      AsyncStorage.getItem("transactions"),
      AsyncStorage.getItem("balanceAccounts"),
      AsyncStorage.getItem("accounts"),
    ]);
    return {
      categories: storedCategories ? JSON.parse(storedCategories) : [],
      transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
      selectedAccounts: storedBalanceAccounts ? JSON.parse(storedBalanceAccounts) : [],
      accounts: storedAccounts ? JSON.parse(storedAccounts) : [],
    };
  };


  // Função para filtrar as transações por mês e ano
  const filterTransactionsByPeriod = (transactions: Transaction[]) => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  };


  // Soma as despesas e receitas de todas as transações
  const calculateIncomeAndExpense = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter(t => t.type === "receita")
      .reduce((sum, t) => sum + t.value, 0);
    const totalExpense = transactions
      .filter(t => t.type === "despesa")
      .reduce((sum, t) => sum + t.value, 0);
    return { totalIncome, totalExpense };
  };


  // Calcula o saldo das contas selecionadas
  const calculateAccountsBalance = (accounts: Account[], selectedAccounts: string[]) => {
    const accountsFiltered =
      selectedAccounts.length === 0
        ? accounts
        : accounts.filter(acc => selectedAccounts.includes(acc.id));
    const totalBalance = accountsFiltered.reduce(
      (sum, acc) => sum + (acc.balance ?? 0),
      0
    );
    return {
      totalBalance,
      accountsFiltered,
      hasAnyAccount: accounts.length > 0,
      hasFilteredAccounts: accountsFiltered.length > 0
    };
  };

  // Armazena os dados das contas selecionadas
  const accountData = calculateAccountsBalance(accounts, balanceAccounts);

  // Soma todas as despesas das categorias
  const calculateSpentPerCategory = (
    categories: Category[],
    transactions: Transaction[]
  ) => {

    return categories.map(category => {
      const spent = transactions
        .filter(t => t.type === "despesa" && t.category === category.name)
        .reduce((sum, t) => sum + t.value, 0);
      return { ...category, spent };
    });
  };


  // Lê os dados e salva nos states
  const readData = async () => {
    try {
      const { categories, transactions, selectedAccounts, accounts } = await loadStorageData();
      const transactionsInPeriod = filterTransactionsByPeriod(transactions);
      const { totalIncome, totalExpense } = calculateIncomeAndExpense(transactionsInPeriod);
      const { totalBalance } = calculateAccountsBalance(accounts, selectedAccounts);
      const categoriesWithSpent = calculateSpentPerCategory(categories, transactionsInPeriod);
      setTotalIncomes(totalIncome);
      setTotalExpenses(totalExpense);
      setBalanceAccounts(selectedAccounts);
      setAccounts(accounts);
      setTotalBalance(totalBalance);
      setCategories(categoriesWithSpent);
    } catch (error) {
      console.log("Problemas ao ler os dados", error);
    }
  };


  // Carregar dados sempre que selecionar mes ou ano diferentes
  useFocusEffect(
    useCallback(() => {
      readData();
    }, [selectedMonth, selectedYear])
  );


  // 
  const toggleAccount = (id: string) => {
    setBalanceAccounts(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(accountId => accountId !== id);
      }
      return [...prev, id];
    });
  };


  // Salva a seleção das contas no Async Storage
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

  // Animações do FAB
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

            {accountData.hasAnyAccount && (
              <Pressable
                onPress={() => setEditBalanceModal(true)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <MaterialIcons name='edit' size={22} />
              </Pressable>
            )}


            <Pressable
              onPress={() =>
                router.push(
                  accountData.hasAnyAccount
                    ? "/(tabs)/transactions?filter=saldo"
                    : "/(tabs)/accounts"
                )
              }
            >

              <View style={[globalStyles.row, globalStyles.itemscenter]}>
                <Text
                  style={[
                    !accountData.hasAnyAccount || !accountData.hasFilteredAccounts
                      ? [globalStyles.text, { marginVertical: 12 }]
                      : globalStyles.title

                  ]}
                >
                  {!accountData.hasAnyAccount
                    ? "Clique para criar contas"
                    : !accountData.hasFilteredAccounts
                      ? "Nenhuma conta selecionada"
                      : formatCurrency(totalBalance)}
                </Text>
                {!accountData.hasAnyAccount && (
                  <MaterialIcons name='chevron-right' size={22} />
                )}
              </View>
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

            {categories.filter(item => Number(item.limit) > 0).length === 0 ? (

              <View style={globalStyles.itemscenter}>

                <Text style={globalStyles.mintitle}>
                  Você ainda não criou nenhuma categoria ou não definiu orçamento para elas, crie ou edite clicando abaixo:
                </Text>

                <View style={[globalStyles.itemscenter, globalStyles.row]}>

                  <Text style={[globalStyles.text, { marginVertical: 20 }]} onPress={() => router.push("/categories")}>
                    Criar ou editar categorias
                  </Text>
                  <MaterialIcons name='chevron-right' size={22} />

                </View>

              </View>


            ) : (
              categories
                .filter(item => Number(item.limit) > 0)
                .map(item => (
                  <ProgressItem
                    key={item.id}
                    icon={item.icon}
                    color={item.color}
                    label={item.name}
                    limit={formatCurrency(item.limit ?? 0)}
                    spent={formatCurrency(item.spent ?? 0)}
                  />
                ))
            )}

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
