import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/global";
import { IconName, Icons } from "@/utils/Icons";
import { MaterialIcons } from "@expo/vector-icons";


// Tipagem
type Props = {
  visible: boolean;
  color: string;
  onClose: () => void;
  onSelect: (icon: IconName) => void;
};

const IconPickerModal = ({ visible, color, onClose, onSelect }: Props) => {

  // Render
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >

      <Pressable style={styles.overlay} onPress={onClose}>

        <Pressable style={styles.container} onPress={() => { }}>

          <View style={[globalStyles.row, globalStyles.spacebetween, globalStyles.itemscenter]}>
            <Text>Selecione um ícone</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} />
            </Pressable>
          </View>


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

  list: {
    maxHeight: "100%",
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

export default IconPickerModal