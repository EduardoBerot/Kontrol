import { Modal, View, Pressable, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Icons, IconName } from "@/app/utils/Icons";

// Tipagem
type Props = {
  visible: boolean;
  color: string;
  onClose: () => void;
  onSelect: (icon: IconName) => void;
};

export function IconPickerModal({ visible, color, onClose, onSelect }: Props) {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >

      <Pressable style={styles.overlay} onPress={onClose}>

        <Pressable style={styles.container} onPress={() => {}}>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} />
          </Pressable>

          <FlatList
            data={Icons}
            numColumns={4}
            keyExtractor={(item) => item}
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
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  icon: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
});
