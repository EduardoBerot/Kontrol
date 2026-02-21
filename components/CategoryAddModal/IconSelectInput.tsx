import { Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Tipagem
type Props = {
    value?: string;
    color: string;
    onPress: () => void;
};

const IconSelectInput = ({ value, color, onPress }: Props) => {

    // Render
    return (
        <>
            <Pressable style={styles.input} onPress={onPress}>
                {value ? (
                    <MaterialIcons name={value as any} color={color} size={24} />
                ) : (
                    <Text style={styles.placeholder}>Selecione um ícone</Text>
                )}

                <MaterialIcons name="keyboard-arrow-down" size={24} />
            </Pressable>
        </>

    );
}

const styles = StyleSheet.create({
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#E5E7EB",
    },

    placeholder: {
        color: "#999",
    },
});

export default IconSelectInput
