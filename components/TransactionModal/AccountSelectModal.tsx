import { Animated, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Account } from "@/types/Account";
import BanksLogo from "@/utils/BanksLogo";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from 'expo-router';


// Tipagem
type ModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelect: (account: Account) => void;
};

const AccountSelectModal = ({ visible, onClose, onSelect }: ModalProps) => {
    // Hooks
    const translateY = useRef(new Animated.Value(400)).current;
    const [accounts, setAccounts] = useState<Account[]>([]);

    //Lê dados do Async Storage
    const readData = async () => {
        try {
            const value = await AsyncStorage.getItem('accounts');
            if (value !== null) {
                const parsed: Account[] = JSON.parse(value);
                setAccounts(parsed);
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


    // Render
    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={{ flex: 1 }}>

                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />


                <Animated.View
                    style={[
                        styles.modal,
                        { transform: [{ translateY }] },
                    ]}
                >

                    <View style={styles.header}>
                        <Text style={styles.title}>Selecione uma conta</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={22} />
                        </Pressable>
                    </View>


                    <FlatList
                        data={accounts}
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
                                    <Image
                                        source={BanksLogo[item.bank]}
                                        resizeMode="contain"
                                        style={styles.logo}
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

    logo: {
        width: 20,
        height: 20,
        borderRadius: 20,
        padding: 10
    },
});

export default AccountSelectModal;
