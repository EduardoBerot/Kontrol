import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Account } from "@/types/Account";
import BanksLogo from "@/utils/BanksLogo";
import { MaterialIcons } from "@expo/vector-icons";



// Tipagem
type Props = {
    Account?: Account;
    onPress: () => void;
};

const AccountSelectInput = ({ Account, onPress }: Props) => {

    // Render
    return (

        <Pressable style={styles.input} onPress={onPress}>
            {Account ? (
                <View style={styles.left}>
                    <Image
                        source={BanksLogo[Account.bank]}
                        style={styles.logo}
                    />
                    <Text style={styles.text}>{Account.name}</Text>
                </View>
            ) : (
                <View style={styles.left}>
                    <MaterialIcons name="category" size={22} color="#9CA3AF" />
                    <Text style={styles.placeholder}>
                        Selecione uma conta
                    </Text>
                </View>
            )}

            <MaterialIcons name="keyboard-arrow-down" size={24} color="#6B7280" />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    placeholder: {
        color: "#9CA3AF",
        fontSize: 14,
    },

    text: {
        fontSize: 14,
        color: "#111827",
    },

    logo: {
        width: 20,
        height: 20,
        borderRadius: 20,
        padding: 10
    },
});

export default AccountSelectInput;
