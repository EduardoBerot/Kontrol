import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/global";
import BanksLogo, { BankKey } from "@/utils/BanksLogo";
import { MaterialIcons } from "@expo/vector-icons";


// Tipagem
type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (bank: BankKey) => void;
};

// Icone dos bancos
const banks = Object.keys(BanksLogo) as BankKey[];


const AccountIconPickerModal = ({ visible, onClose, onSelect }: Props) => {

  // Render
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>

        <Pressable style={styles.container}>
          
          <View style={[globalStyles.row, globalStyles.spacebetween, globalStyles.itemscenter]}>
            <Text>Selecione um ícone</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} />
            </Pressable>
          </View>

          <FlatList
            data={banks}
            numColumns={4}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.icon}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Image
                  source={BanksLogo[item]}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "60%",
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },

  listContent: {
    paddingBottom: 8,
  },

  icon: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 36,
    padding: 20
  },
});

export default AccountIconPickerModal;