import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";
import BanksLogo from "@/app/utils/BanksLogo";
import { Account } from "../types/Account";
import formatCurrency from "../utils/FormatCurrency";



const AccountRender = ({ id, name, bank, balance, onEdit }: Account) => {

  // Render
  return (

    <View style={styles.accountItem}>
      <Image
        source={BanksLogo[bank]}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={globalStyles.text}>{name}</Text>
        <Text>{formatCurrency(balance)}</Text>
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
