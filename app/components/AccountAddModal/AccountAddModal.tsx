import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccountIconPickerModal from "./AccountIconPickerModal";
import AccountIconSelectInput from "./AccountIconSelectInput";
import { BankKey } from "@/app/utils/BanksLogo";
import { Account } from "@/app/types/Account";



type ModalProps = {
  visible: boolean;
  account: Account | null;
  onClose: () => void;
  onSaved: () => void;
};


const AccountAddModal = ({ visible, account, onClose, onSaved }: ModalProps) => {

  // Hooks
  const [name, setName] = useState("");
  const [bank, setBank] = useState<BankKey>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;



  const isEditing = !!account;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBank(account.bank);
    } else {
      resetFields();
    }
  }, [account, visible]);

  const resetFields = () => {
    setName("");
    setBank(undefined);
  };


  // Salvar ou atualizar conta
  const saveOrUpdateAccount = async () => {
    try {
      const value = await AsyncStorage.getItem("accounts");
      const current: Account[] = value ? JSON.parse(value) : [];

      let updated: Account[];

      if (account) {
        updated = current.map(item =>
          item.id === account.id
            ? { ...item, name, bank: bank! }
            : item
        );
      } else {
        const newAccount: Account = {
          id: Date.now().toString(),
          name,
          bank: bank!,
          balance: 0,
        };

        updated = [...current, newAccount];
      }

      await AsyncStorage.setItem("accounts", JSON.stringify(updated));
      resetFields();
      onSaved();
      onClose();
    } catch (error) {
      console.log("Erro ao salvar conta:", error);
    }
  };


  // Função para deletar conta
  const handleDeleteAccount = async () => {
    if (!account) return;

    try {
      const value = await AsyncStorage.getItem("accounts");
      const current: Account[] = value ? JSON.parse(value) : [];

      const updated = current.filter(item => item.id !== account.id);

      await AsyncStorage.setItem("accounts", JSON.stringify(updated));
      resetFields();
      onSaved();
      onClose();
    } catch (error) {
      console.log("Erro ao excluir conta:", error);
    }
  };


  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>

      <Pressable style={styles.overlay} onPress={onClose}>

        <Pressable>
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEditing ? "Editar conta" : "Adicionar conta"}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <MaterialIcons name="close" size={22} />
              </Pressable>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: Conta principal"
                style={styles.input}
              />
            </View>

            <AccountIconSelectInput
              value={bank}
              onPress={() => setPickerOpen(true)}
            />

            <AccountIconPickerModal
              visible={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={setBank}
            />

            <Pressable style={styles.button} onPress={saveOrUpdateAccount}>
              <Text style={styles.buttonText}>
                {isEditing ? "Salvar alterações" : "Salvar conta"}
              </Text>
            </Pressable>

            {isEditing && (
              <Pressable
                style={[styles.button, { backgroundColor: "#EF4444" }]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.buttonText}>Excluir conta</Text>
              </Pressable>
            )}
          </Animated.View>
        </Pressable>

      </Pressable>

    </Modal>
  );
};

export default AccountAddModal;

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
