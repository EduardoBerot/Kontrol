import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "@/types/Transaction";
import { useTransactionsContext } from "../../context/TransactionContext";
import { globalStyles } from "../../styles/global";
import { formatCurrency } from "../../utils/FormatCurrency";
import Header from "@/components/Header";
import { Account } from "@/types/Account";

// Define os possiveis filtros de transações
type FilterType = "receita" | "despesa" | "transferencia" | "saldo";


export default function transactions() {
    
    // Hooks
    const { filter } = useLocalSearchParams<{ filter?: FilterType }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<FilterType>("saldo");
    const { refresh } = useTransactionsContext();

    // Função para carregar transações
    const loadTransactions = useCallback(async () => {
        const stored = await AsyncStorage.getItem("transactions");
        const parsed: Transaction[] = stored ? JSON.parse(stored) : [];
        // Ordena pela data mais recente
        const sorted = [...parsed].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (activeTab === "saldo") {
            setTransactions(sorted);
            return;
        }
        setTransactions(sorted.filter(t => t.type === activeTab));
    }, [activeTab]);



    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);


    useEffect(() => {
        if (filter) {
            setActiveTab(filter);
        }
    }, [filter]);


    // Captura os valores do AsyncStorage
    const getTransactions = async (): Promise<Transaction[]> => {
        const data = await AsyncStorage.getItem("transactions");
        return data ? JSON.parse(data) : [];
    };

    const saveTransactions = async (transactions: Transaction[]) => {
        await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
    };

    const getAccounts = async (): Promise<Account[]> => {
        const data = await AsyncStorage.getItem("accounts");
        return data ? JSON.parse(data) : [];
    };

    const saveAccounts = async (accounts: Account[]) => {
        await AsyncStorage.setItem("accounts", JSON.stringify(accounts));
    };


    // Remover transação
    const handleDelete = (id: string) => {
        Alert.alert(
            "Excluir transação",
            "Tem certeza que deseja excluir esta transação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deleteTransaction(id),
                },
            ]
        );
    };


    // Função para deletar transação
    const deleteTransaction = async (id: string) => {
        try {

            const transactions = await getTransactions();
            const transaction = transactions.find(t => t.id === id);

            if (!transaction) return;

            const updatedTransactions = transactions.filter(t => t.id !== id);
            await saveTransactions(updatedTransactions);

            await revertAccountBalance(transaction);

            loadTransactions();
            refresh();

        } catch (error) {
            console.log("Erro ao deletar transação:", error);
        }
    };

    // Atualiza os valores após exclusão de transação
    const revertAccountBalance = async (transaction: Transaction) => {
        const accounts = await getAccounts();

        const updatedAccounts = accounts.map(acc => {
            let balance = acc.balance ?? 0;

            if (transaction.type === "receita" && acc.id === transaction.accountId) {
                balance -= transaction.value;
            }

            if (transaction.type === "despesa" && acc.id === transaction.accountId) {
                balance += transaction.value;
            }

            if (transaction.type === "transferencia") {
                if (acc.id === transaction.accountId) {
                    balance += transaction.value;
                }

                if (acc.id === transaction.toAccountId) {
                    balance -= transaction.value;
                }
            }

            return { ...acc, balance };
        });

        await saveAccounts(updatedAccounts);
    };


    // Define formato de data
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });


    // Render
    return (
        <View style={globalStyles.container}>
            <Header showIndexContent={false} showTabsContent={true} TabTitle="Transações" />

            <View style={styles.tabsContainer}>

                {/* TODAS */}
                <Pressable onPress={() => setActiveTab("saldo")} style={styles.tabsContainerButton}>
                    <MaterialIcons
                        name="list"
                        size={26}
                        color={activeTab === "saldo" ? "#2563EB" : "#9CA3AF"}
                    />
                </Pressable>

                {/* RECEITAS */}
                <Pressable onPress={() => setActiveTab("receita")} style={styles.tabsContainerButton}>
                    <MaterialIcons
                        name="trending-up"
                        size={26}
                        color={activeTab === "receita" ? "#22c55e" : "#9CA3AF"}
                    />
                </Pressable>

                {/* DESPESAS */}
                <Pressable onPress={() => setActiveTab("despesa")} style={styles.tabsContainerButton}>
                    <MaterialIcons
                        name="trending-down"
                        size={26}
                        color={activeTab === "despesa" ? "#ef4444" : "#9CA3AF"}
                    />
                </Pressable>

                {/* TRANSFERÊNCIAS */}
                <Pressable onPress={() => setActiveTab("transferencia")} style={styles.tabsContainerButton}>
                    <MaterialIcons
                        name="swap-horiz"
                        size={26}
                        color={activeTab === "transferencia" ? "#F59E0B" : "#9CA3AF"}
                    />
                </Pressable>

            </View>


            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View
                            style={[
                                styles.iconContainer,
                                item.type === "receita"
                                    ? styles.iconIncome
                                    : item.type === "despesa"
                                        ? styles.iconExpense
                                        : styles.iconTransfer
                            ]}
                        >
                            <MaterialIcons
                                name={
                                    item.type === "receita"
                                        ? "trending-up"
                                        : item.type === "despesa"
                                            ? "trending-down"
                                            : "swap-horiz"
                                }
                                size={22}
                                color={
                                    item.type === "receita"
                                        ? "#16A34A"
                                        : item.type === "despesa"
                                            ? "#DC2626"
                                            : "#F59E0B"
                                }
                            />
                        </View>


                        <View style={styles.infoContainer}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.date}>{formatDate(item.date)}</Text>
                        </View>

                        <Text
                            style={[
                                styles.value,
                                item.type === "receita" ? styles.valueIncome : styles.valueExpense,
                            ]}
                        >
                            {formatCurrency(item.value)}
                        </Text>

                        <View style={styles.actions}>
                            <Pressable onPress={() => handleDelete(item.id)}>
                                <MaterialIcons name="delete" size={22} color="#DC2626" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 16,
    },

    tabsContainerButton: {
        paddingHorizontal: 30
    },

    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },

    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    iconIncome: {
        backgroundColor: "#DCFCE7",
    },

    iconExpense: {
        backgroundColor: "#FEE2E2",
    },

    iconTransfer: {
        backgroundColor: "#FEF3C7",
    },


    infoContainer: {
        flex: 1,
    },

    category: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    emptyText: {
        textAlign: "center",
        color: "#6B7280",
        marginTop: 40,
    },

    date: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
        marginRight: 8,
    },

    valueIncome: {
        color: "#16A34A",
    },

    valueExpense: {
        color: "#DC2626",
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },
});
