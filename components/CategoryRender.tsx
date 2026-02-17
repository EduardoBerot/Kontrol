import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/global";

// Tipagem
type CategoryRenderProps = {
    title: string;
    icon: any;
    color: any;
    onEdit?: () => void;
};

const CategoryRender = ({ title, icon, color, onEdit }: CategoryRenderProps) => {

    // Render
    return (
        <View style={styles.categoryitem}>
            <MaterialIcons name={icon} size={22} color={color} />
            <Text style={globalStyles.text}>{title}</Text>

            <TouchableOpacity
                onPress={onEdit}
                style={{ position: "absolute", right: 20 }}
            >
                <MaterialIcons name="edit" size={20} />
            </TouchableOpacity>
        </View>
    );
}

export default CategoryRender

const styles = StyleSheet.create ({
    categoryitem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingVertical: 10
  }
})
