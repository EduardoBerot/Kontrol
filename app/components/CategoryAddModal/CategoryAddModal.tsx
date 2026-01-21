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
import { IconSelectInput } from "./IconSelectInput";
import { IconPickerModal } from "./IconPickerModal";
import { ColorSelectInput } from "./ColorSelectInput";
import { ColorPickerModal } from "./ColorPickerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconName } from "@/app/utils/Icons";

// Tipagem (falta ajustar)
type Category = {
  id: any;
  name: any;
  icon: any;
  color: any;
  limit: any;
  spent: any;
};

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};


export function CategoryAddModal({ visible, onClose, onSaved }: ModalProps) {

  // Hooks
  const [name, setName] = useState<string>();
  const [budget, setBudget] = useState<string>();
  const [icon, setIcon] = useState<IconName>();
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [color, setColor] = useState<string>();
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;


  // Salvar categoria no Async Storage
  const saveData = async (data: Category[]) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(data))
    } catch {
      console.log("Não foi possivel salvar a informação no banco de dados!")
    }
  }

  // Adiciona categoria no asyncstorage
  const addData = async () => {
    try {
      const value = await AsyncStorage.getItem('categories');
      const current: Category[] = value ? JSON.parse(value) : [];
      const newCategory = {
        id: Date.now(),
        name,
        icon,
        color,
        limit: budget,
        spent: "",
      };
      const updated = [...current, newCategory];
      await AsyncStorage.setItem('categories', JSON.stringify(updated));

      // Reseta hooks
      setIcon(undefined);
      setColor("#9CA3AF");
      setName('');
      setBudget('');

      //Força atualização
      onSaved();

    } catch (e) {
      console.log("Erro ao salvar categoria", e);
    }
  };

  // Abrir modal
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 300,
      duration: visible ? 280 : 0,
      useNativeDriver: true,
    }).start();
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
              <Text style={styles.title}>Adicionar categoria</Text>
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
                color={color ?? "#9CA3AF"}
                onPress={() => setIconModalOpen(true)}
              />
              <IconPickerModal
                visible={iconModalOpen}
                color={color ?? "#9CA3AF"}
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

            <Pressable style={styles.button} onPress={addData}>
              <Text style={styles.buttonText}>
                Salvar categoria
              </Text>
            </Pressable>
            
          </Animated.View>
        </Pressable>
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
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    elevation: 10,
  },

  /* Header */
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

  /* Fields */
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

  /* Button */
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
