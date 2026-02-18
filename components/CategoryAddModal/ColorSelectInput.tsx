import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Tipagem
type Props = {
  value?: string;
  onPress: () => void;
};

const ColorSelectInput = ({ value, onPress }: Props) => {

  // Render
  return (
    <Pressable style={styles.input} onPress={onPress}>
      <View style={styles.left}>
        <View
          style={[
            styles.preview,
            { backgroundColor: value ?? "#E5E7EB" },
          ]}
        />
        <Text>{value ?? "Selecionar cor"}</Text>
      </View>
      <MaterialIcons name="color-lens" size={22} />
    </Pressable>
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
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default ColorSelectInput
