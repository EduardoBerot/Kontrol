import { Category } from "@/types/Category";
import { IconName } from "@/utils/Icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import ColorPickerModal from "./ColorPickerModal";
import ColorSelectInput from "./ColorSelectInput";
import IconPickerModal from "./IconPickerModal";
import IconSelectInput from "./IconSelectInput";




type ModalProps = {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
};


const CategoryAddModal = ({ visible, category, onClose, onSaved, }: ModalProps) => {

  // Hooks
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [icon, setIcon] = useState<IconName | undefined>();
  const [color, setColor] = useState("#9CA3AF");

  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const translateY = useRef(new Animated.Value(300)).current;

  const isEditing = !!category;

  /* ===== ANIMAÇÃO DE ABERTURA ===== */

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);


  // Preencher campos ao editar
  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setBudget(category.limit ?? "");
    } else {
      resetFields();
    }
  }, [category, visible]);

  // Resetar camport
  const resetFields = () => {
    setName("");
    setIcon(undefined);
    setColor("#9CA3AF");
    setBudget("");
  };


  // Salvar ou editar no Async Storage
  const saveOrUpdateCategory = async () => {
    try {
      const value = await AsyncStorage.getItem("categories");
      const current: Category[] = value ? JSON.parse(value) : [];

      let updated: Category[];

      if (category) {
        updated = current.map(item => {
          if (category.id === item.id) {
            return {
              ...item,
              name,
              icon: icon!,
              color,
              limit: budget,
            };
          }
          return item;
        });
      } else {
        const newCategory: Category = {
          id: Date.now(),
          name,
          icon: icon!,
          color,
          limit: budget,
          spent: "",
        };
        updated = [...current, newCategory];
      }


      await AsyncStorage.setItem("categories", JSON.stringify(updated));
      resetFields();
      onSaved();
      onClose();

    } catch (error) {
      console.log("Erro ao salvar categoria:", error);
    }
  };

  // Deletar categoria
  const handleDeleteCategory = async () => {
    if (!category) return;

    try {
      const value = await AsyncStorage.getItem("categories");
      const current: Category[] = value ? JSON.parse(value) : [];

      const updated = current.filter(item => item.id !== category.id);

      await AsyncStorage.setItem("categories", JSON.stringify(updated));

      resetFields();
      onSaved();
      onClose();

    } catch (error) {
      console.log("Erro ao excluir categoria:", error);
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
                {isEditing ? "Editar categoria" : "Adicionar categoria"}
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
                placeholder="Ex: Alimentação"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Ícone</Text>
              <IconSelectInput
                value={icon}
                color={color}
                onPress={() => setIconModalOpen(true)}
              />
              <IconPickerModal
                visible={iconModalOpen}
                color={color}
                onClose={() => setIconModalOpen(false)}
                onSelect={setIcon}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Cor</Text>
              <ColorSelectInput
                value={color}
                onPress={() => setColorModalOpen(true)}
              />
              <ColorPickerModal
                visible={colorModalOpen}
                initialColor={color}
                onClose={() => setColorModalOpen(false)}
                onSelect={setColor}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Orçamento</Text>
              <TextInput
                value={budget}
                onChangeText={setBudget}
                placeholder="Ex: 1.000 R$"
                style={styles.input}
              />
            </View>

            <Pressable style={styles.button} onPress={saveOrUpdateCategory}>
              <Text style={styles.buttonText}>
                {category ? "Salvar alterações" : "Salvar categoria"}
              </Text>
            </Pressable>

            {isEditing && (
              <Pressable
                style={[styles.button, { backgroundColor: "#EF4444" }]}
                onPress={handleDeleteCategory}
              >
                <Text style={styles.buttonText}>
                  Excluir categoria
                </Text>
              </Pressable>
            )}


          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default CategoryAddModal

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
