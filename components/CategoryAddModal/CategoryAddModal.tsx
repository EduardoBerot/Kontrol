import { Animated, Modal, Pressable, StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/Category";
import { IconName } from "@/utils/Icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import ColorPickerModal from "./ColorPickerModal";
import ColorSelectInput from "./ColorSelectInput";
import IconPickerModal from "./IconPickerModal";
import IconSelectInput from "./IconSelectInput";
import formatCurrency from "@/utils/FormatCurrency";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// Tipagem
type ModalProps = {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
};

const CategoryAddModal = ({ visible, category, onClose, onSaved, }: ModalProps) => {

  // Hooks
  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [icon, setIcon] = useState<IconName | undefined>();
  const [color, setColor] = useState("#9CA3AF");
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;
  const isEditing = !!category;
  const insets = useSafeAreaInsets();
  const [displayBudget, setDisplayBudget] = useState(formatCurrency(0));



  // Animação modal
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height - 20,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);


  // Preencher campos ao editar
  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setBudget(category.limit ?? 0);
    } else {
      resetFields();
    }
  }, [category, visible]);

  // Resetar campos
  const resetFields = () => {
    setName("");
    setIcon(undefined);
    setColor("#9CA3AF");
    setBudget(0);
    setDisplayBudget(formatCurrency(0))
  };


  // Salvar ou editar no Async Storage
  const saveOrUpdateCategory = async () => {
    try {

      // Validação nome
      if (!name.trim()) {
        Alert.alert(
          "Categoria inválida",
          "A categoria precisa ter um nome antes de salvar.",
          [{ text: "OK" }]
        );
        return;
      }

      // Validação ícone
      if (!icon) {
        Alert.alert(
          "Ícone obrigatório",
          "Selecione um ícone para a categoria.",
          [{ text: "OK" }]
        );
        return;
      }

      const value = await AsyncStorage.getItem("categories");
      const current: Category[] = value ? JSON.parse(value) : [];

      let updated: Category[];

      if (category) {
        updated = current.map(item => {
          if (category.id === item.id) {
            return {
              ...item,
              name,
              icon,
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
          icon,
          color,
          limit: budget,
          spent: 0,
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


  // Render
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>

      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.modal,
            {
              paddingBottom: insets.bottom,
              transform: [{ translateY }]
            },
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
              onChangeText={(text) => setName(text.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))}
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
              keyboardType="numeric"
              value={displayBudget}
              style={styles.input}
              selection={{
                start: displayBudget.length,
                end: displayBudget.length,
              }}
              onChangeText={(text) => {
                const numeric = text.replace(/\D/g, "");
                const cents = Number(numeric || "0");
                const value = cents / 100;

                setDisplayBudget(formatCurrency(value));
                setBudget(value);
              }}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 10,
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
  color: "#111827"
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

export default CategoryAddModal