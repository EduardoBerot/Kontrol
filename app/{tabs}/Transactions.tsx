import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

import { Transaction } from "../components/TransactionModal/TransactionModal";
import { formatCurrency } from "../utils/FormatCurrency";
import { globalStyles } from "../styles/global";
import Header from "../components/Header/Header";
import { useTransactionsContext } from "../context/TransactionContext";

type FilterType = "receita" | "despesa" | "saldo";

export default function TransactionsTab() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<FilterType>("saldo");

    const { refresh } = useTransactionsContext();

    const loadTransactions = useCallback(async () => {
        const stored = await AsyncStorage.getItem("transactions");
        const parsed: Transaction[] = stored ? JSON.parse(stored) : [];

        if (activeTab === "saldo") {
            setTransactions(parsed);
            return;
        }

        setTransactions(parsed.filter(t => t.type === activeTab));
    }, [activeTab]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleDelete = (id: string) => {
        Alert.alert(
            "Excluir transação",
            "Tem certeza que deseja excluir esta transação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const stored = await AsyncStorage.getItem("transactions");
                        const parsed: Transaction[] = stored ? JSON.parse(stored) : [];

                        const updated = parsed.filter(t => t.id !== id);

                        await AsyncStorage.setItem("transactions", JSON.stringify(updated));

                        loadTransactions();
                        refresh(); // 🔥 avisa Index e qualquer outra tela
                    },
                },
            ]
        );
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return (
        <View style={globalStyles.container}>
            <Header showIndexContent={false} showTabsContent={true} TabTitle="Editar Categorias" />
            <View style={styles.tabsContainer}>
                <Pressable onPress={() => setActiveTab("receita")}>
                    <MaterialIcons
                        name="trending-up"
                        size={28}
                        color={activeTab === "receita" ? "#22c55e" : "#9CA3AF"}
                    />
                </Pressable>

                <Pressable onPress={() => setActiveTab("saldo")}>
                    <MaterialIcons
                        name="account-balance-wallet"
                        size={28}
                        color={activeTab === "saldo" ? "#2563EB" : "#9CA3AF"}
                    />
                </Pressable>

                <Pressable onPress={() => setActiveTab("despesa")}>
                    <MaterialIcons
                        name="trending-down"
                        size={28}
                        color={activeTab === "despesa" ? "#ef4444" : "#9CA3AF"}
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
                                item.type === "receita" ? styles.iconIncome : styles.iconExpense,
                            ]}
                        >
                            <MaterialIcons
                                name={item.type === "receita" ? "trending-up" : "trending-down"}
                                size={22}
                                color={item.type === "receita" ? "#16A34A" : "#DC2626"}
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
                            <Pressable>
                                <MaterialIcons name="edit" size={22} color="#2563EB" />
                            </Pressable>

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
