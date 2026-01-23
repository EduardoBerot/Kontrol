import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import CategorySelectInput from "./CategorySelectInput";
import CategorySelectModal from "./CategorySelectModal";
import { Category } from "./CategorySelectModal";
import DateTimePicker from "@react-native-community/datetimepicker";


// Tipagem
type ModalProps = {
  visible: boolean;
  type: "despesa" | "receita" | "transferencia" | null;
  onClose: () => void;
};



const TransactionModal = ({ visible, onClose, type }: ModalProps) => {

  // Hooks
  const [category, setCategory] = useState<Category | undefined>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);


  // Constantes de renderizações condicionais
  const buttonLabel = {
    despesa: "Salvar Despesa",
    receita: "Salvar Receita",
    transferencia: "Salvar Transferência"
  }

  const modalTitle = {
    despesa: "Adicionar despesa",
    receita: "Adicionar receita",
    transferencia: "Adicionar transferência"
  }

  // Função de seleçao de data
  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };




  // Animação
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Fechar modal e resetar categoria
  useEffect(() => {
    if (!visible) {
      // quando o modal principal FECHAR
      setCategory(undefined);
      setCategoryModalOpen(false);
    }
  }, [visible]);


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
                {type ? modalTitle[type] : ""}
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <MaterialIcons name="close" size={22} />
              </Pressable>
            </View>



            <View style={styles.field}>
              <Text style={styles.label}>Data</Text>

              {/* Campo visual (não editável) */}
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
                placeholder="Ex: 1.000 R$"
                style={styles.input}
              />
            </View>

            <Pressable style={styles.button} >
              <Text style={styles.buttonText}>
                {type ? buttonLabel[type] : ""}
              </Text>
            </Pressable>

          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default TransactionModal

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
