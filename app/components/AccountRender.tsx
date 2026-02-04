import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";
import BanksLogo, { BankKey } from "@/app/utils/BanksLogo";

// Tipagem
type AccountRenderProps = {
  name: string;
  bank: BankKey;
  onEdit?: () => void;
};

const AccountRender = ({ name, bank, onEdit }: AccountRenderProps) => {
  return (
    <View style={styles.accountItem}>
      <Image
        source={BanksLogo[bank]}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={globalStyles.text}>{name}</Text>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        style={{ position: "absolute", right: 20 }}
      >
        <MaterialIcons name="edit" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default AccountRender;

const styles = StyleSheet.create({
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },

  logo: {
    width: 22,
    height: 22,
    borderRadius: 22
  },

  textContainer: {
    flex: 1,
  },

  balance: {
    fontSize: 12,
    color: "#666",
  },
});
