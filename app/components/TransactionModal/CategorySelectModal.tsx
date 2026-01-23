import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconName } from "@/app/utils/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Tipagem
export type Category = {
    id: number;
    name: string;
    icon: IconName;
    color: string;
};

type ModalProps = {
    visible: boolean;
    type: "despesa" | "receita" | null;
    onClose: () => void;
    onSelect: (category: Category) => void;
};


export const incomestypes: Category[] = [
  { id: 101, name: "Salário", icon: "attach-money", color: "#22C55E" },
  { id: 102, name: "Freelance", icon: "work", color: "#10B981" },
  { id: 103, name: "Investimentos", icon: "trending-up", color: "#3B82F6" },
  { id: 104, name: "Aluguel", icon: "home", color: "#8B5CF6" },
  { id: 105, name: "Vendas", icon: "store", color: "#F59E0B" },
  { id: 106, name: "Prêmios", icon: "emoji-events", color: "#EF4444" },
  { id: 107, name: "Outros", icon: "more-horiz", color: "#6B7280" },
];



const CategorySelectModal = ({ visible, type, onClose, onSelect }: ModalProps) => {

    // Hooks
    const translateY = useRef(new Animated.Value(400)).current;
    const [categories, setCategories] = useState<Category[]>([]);

    // Ler dados do Async Storage
    const readData = async () => {
        try {
            const value = await AsyncStorage.getItem('categories');
            if (value !== null) {
                const parsed: Category[] = JSON.parse(value);
                setCategories(parsed);
            }
        } catch {
            console.log("Problemas ao ler os dados")
        }
    }

    useFocusEffect(
        useCallback(() => {
            readData();
        }, [])
    );

    // Funçao de animação  
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : 400,
            duration: 280,
            useNativeDriver: true,
        }).start();
    }, [visible]);



    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={{ flex: 1 }}>
                {/* BACKDROP */}
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                {/* MODAL FIXO NO FUNDO */}
                <Animated.View
                    style={[
                        styles.modal,
                        { transform: [{ translateY }] },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Selecione a categoria</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={22} />
                        </Pressable>
                    </View>

                    {/* Lista */}
                    <FlatList
                        data={type === "despesa" ? categories : incomestypes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.item}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <View style={styles.left}>
                                    <MaterialIcons
                                        name={item.icon}
                                        size={22}
                                        color={item.color}
                                    />
                                    <Text style={styles.text}>{item.name}</Text>
                                </View>

                                <MaterialIcons
                                    name="chevron-right"
                                    size={22}
                                    color="#9CA3AF"
                                />
                            </Pressable>
                        )}
                    />
                </Animated.View>
            </View>
        </Modal>

    );
};

export default CategorySelectModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
    },

    modal: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#FFF",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    text: {
        fontSize: 15,
    },
});
