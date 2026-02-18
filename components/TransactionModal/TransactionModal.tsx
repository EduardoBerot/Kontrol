import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/Category";
import { Account } from "@/types/Account";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-gesture-handler";
import AccountSelectInput from "./AccountSelectInput";
import AccountSelectModal from "./AccountSelectModal";
import CategorySelectInput from "./CategorySelectInput";
import CategorySelectModal from "./CategorySelectModal";
import { Transaction } from "@/types/Transaction";

// Tipagem
type ModalProps = {
  visible: boolean;
  type: "despesa" | "receita" | "transferencia" | null;
  onClose: () => void;
  onSaved?: () => void;
};

const TransactionModal = ({ visible, onClose, onSaved, type }: ModalProps) => {
  
  // Hooks
  const [account, setAccount] = useState<Account | undefined>();
  const [category, setCategory] = useState<Category | undefined>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;
  const [date, setDate] = useState<Date | null>(new Date());
  const [show, setShow] = useState(false);
  const [expenseValue, setExpenseValue] = useState(0);
  const [incomeValue, setIncomeValue] = useState(0);
  const [transferValue, setTransferValue] = useState(0);
  const [toAccount, setToAccount] = useState<Account | undefined>();
  const [toAccountModalOpen, setToAccountModalOpen] = useState(false);

  // Captura o valor do tipo de transação
  const getCurrentValue = () => {
    if (type === "despesa") return expenseValue;
    if (type === "receita") return incomeValue;
    if (type === "transferencia") return transferValue;
    return 0;
  };

  // Salva os dados no Async Storage
  const saveData = async () => {
    try {
      if (!type || !account) return;
      const value = getCurrentValue();
      const transactionDate = (date ?? new Date()).toISOString();
      const categoryName = category?.name ?? "Transferência";
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type,
        date: transactionDate,
        value,
        category: categoryName,
        accountId: account.id,
        toAccountId: toAccount?.id,
      };
      await updateAccountBalance(value);
      const storedData = await AsyncStorage.getItem("transactions");
      const transactions: Transaction[] = storedData ? JSON.parse(storedData) : [];
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.log("Erro ao salvar:", error);
    }
  };


  // Função de adicionar transação
  const addTransaction = async () => {
    await saveData();
    onSaved?.();
    onClose();
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Atualiza o saldo das contas 
  const updateAccountBalance = async (transactionValue: number) => {
    if (!account || !type) return;

    try {
      const data = await AsyncStorage.getItem("accounts");
      const accounts: Account[] = data ? JSON.parse(data) : [];

      const updatedAccounts = accounts.map(acc => {
        let newBalance = acc.balance ?? 0;

        const isSourceAccount = acc.id === account.id;
        const isDestinationAccount = acc.id === toAccount?.id;

        // Ajuste conta origem
        if (isSourceAccount) {
          if (type === "receita") newBalance += transactionValue;
          else newBalance -= transactionValue; // despesa + transferencia
        }

        // Ajuste conta destino (transferência)
        if (type === "transferencia" && isDestinationAccount) {
          newBalance += transactionValue;
        }

        return { ...acc, balance: newBalance };
      });

      await AsyncStorage.setItem("accounts", JSON.stringify(updatedAccounts));

    } catch (error) {
      console.log("Erro ao atualizar saldo:", error);
    }
  };


  // Label e Titulo condicionados ao tipo de transação
  const buttonLabel = {
    despesa: "Salvar Despesa",
    receita: "Salvar Receita",
    transferencia: "Salvar Transferência",
  };

  const modalTitle = {
    despesa: "Adicionar despesa",
    receita: "Adicionar receita",
    transferencia: "Adicionar transferência",
  };

  // Animações do modal
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);


  // Reseta os inputs
  useEffect(() => {
    if (!visible) {
      setDate(new Date());
      setAccount(undefined);
      setToAccount(undefined);
      setCategory(undefined);
      setExpenseValue(0);
      setIncomeValue(0);
      setTransferValue(0);
      setCategoryModalOpen(false);

    }
  }, [visible]);


  // Render
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable>
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                {type ? modalTitle[type] : ""}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <MaterialIcons name="close" size={22} />
              </Pressable>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Data</Text>
              <Pressable onPress={() => setShow(true)}>
                <TextInput
                  placeholder="Selecione a data"
                  style={styles.input}
                  value={date ? date.toLocaleDateString("pt-BR") : ""}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>

              {show && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleChange}
                />
              )}




            </View>


            <View style={styles.field}>
              <Text style={styles.label}> Conta</Text>
              <AccountSelectInput
                Account={account}
                onPress={() => setAccountModalOpen(true)}
              />

              <AccountSelectModal
                visible={accountModalOpen}
                onClose={() => {
                  setAccountModalOpen(false);
                }}
                onSelect={setAccount}
              />
            </View>


            {type === "transferencia" && (
              <View style={styles.field}>
                <Text style={styles.label}>Para conta</Text>

                <AccountSelectInput
                  Account={toAccount}
                  onPress={() => setToAccountModalOpen(true)}
                />

                <AccountSelectModal
                  visible={toAccountModalOpen}
                  onClose={() => setToAccountModalOpen(false)}
                  onSelect={setToAccount}
                />
              </View>
            )}


            {(type === "despesa" || type === "receita") && (
              <View style={styles.field}>
                <Text style={styles.label}>
                  {type === "despesa" ? "Categoria" : "Natureza"}
                </Text>

                <CategorySelectInput
                  type={type}
                  category={category}
                  onPress={() => setCategoryModalOpen(true)}
                />

                <CategorySelectModal
                  visible={categoryModalOpen}
                  type={type}
                  onClose={() => {
                    setCategoryModalOpen(false);
                  }}
                  onSelect={setCategory}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Ex: 1.000 R$"
                style={styles.input}
                onChangeText={(text) => {
                  const value = Number(text.replace(",", "."));
                  type === "despesa"
                    ? setExpenseValue(value)
                    : type === "receita"
                      ? setIncomeValue(value)
                      : setTransferValue(value);
                }}
              />
            </View>

            <Pressable style={styles.button} onPress={addTransaction}>
              <Text style={styles.buttonText}>
                {type ? buttonLabel[type] : ""}
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default TransactionModal;