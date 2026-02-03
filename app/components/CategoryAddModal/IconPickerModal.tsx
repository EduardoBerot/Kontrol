import { Modal, Pressable, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Icons, IconName } from "@/app/utils/Icons";

// Tipagem
type Props = {
  visible: boolean;
  color: string;
  onClose: () => void;
  onSelect: (icon: IconName) => void;
};

const IconPickerModal = ({ visible, color, onClose, onSelect }: Props) => {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >

      <Pressable style={styles.overlay} onPress={onClose}>

        <Pressable style={styles.container} onPress={() => { }}>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} />
          </Pressable>

          <FlatList
            data={Icons}
            numColumns={4}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            renderItem={({ item }) => (
              <Pressable
                style={styles.icon}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <MaterialIcons name={item} color={color} size={28} />
              </Pressable>
            )}
          />


        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default IconPickerModal

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
    maxHeight: "60%", // 🔹 controla o tamanho do modal
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },

  list: {
    maxHeight: "100%", // 🔹 FlatList respeita o container
  },

  listContent: {
    paddingBottom: 8,
  },

  icon: {
    padding: 12,
    alignItems: "center",
    flex: 1,
  },
});
