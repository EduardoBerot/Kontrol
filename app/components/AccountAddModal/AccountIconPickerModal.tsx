import { Modal, Pressable, FlatList, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BanksLogo, { BankKey } from "@/app/utils/BanksLogo";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (bank: BankKey) => void;
};

const banks = Object.keys(BanksLogo) as BankKey[];

const AccountIconPickerModal = ({
  visible,
  onClose,
  onSelect,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} />
          </Pressable>

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

export default AccountIconPickerModal;

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
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
