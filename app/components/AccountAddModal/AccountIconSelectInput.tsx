import { Text, Pressable, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BanksLogo, { BankKey } from "@/app/utils/BanksLogo";
import globalStyles from "@/app/styles/global";

// Tipagem
type Props = {
  value?: BankKey;
  onPress: () => void;
};

const AccountIconSelectInput = ({ value, onPress }: Props) => {
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

export default AccountIconSelectInput;

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
