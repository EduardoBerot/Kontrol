import { Image, Pressable, StyleSheet, Text } from "react-native";
import globalStyles from "@/styles/global";
import BanksLogo, { BankKey } from "@/utils/BanksLogo";
import { MaterialIcons } from "@expo/vector-icons";

// Tipagem
type Props = {
  value?: BankKey;
  onPress: () => void;
};

const AccountIconSelectInput = ({ value, onPress }: Props) => {

  // Render
  return (
    <Pressable style={[styles.input, globalStyles.row, globalStyles.spacebetween, globalStyles.itemscenter]} onPress={onPress}>
      {value ? (
        <Image
          source={BanksLogo[value]}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.placeholder}>Selecione o Icone</Text>
      )}

      <MaterialIcons name="keyboard-arrow-down" size={24} />
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
  },

  placeholder: {
    color: "#999",
  },

  logo: {
    width: 28,
    height: 28,
    borderRadius: 28
  },
});

export default AccountIconSelectInput;
