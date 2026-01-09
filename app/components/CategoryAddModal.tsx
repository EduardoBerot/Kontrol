import { View, Modal, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { globalStyles } from "../styles/global";
import { TextInput } from "react-native-gesture-handler";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CategoryAddModal({ visible, onClose }: ModalProps) {
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(300); // reseta posição inicial
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);


  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Bloqueia o clique dentro */}
        <Pressable>
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={[globalStyles.row, globalStyles.spacebetween, globalStyles.itemscenter]}>
              <Text>Conteúdo do modal</Text>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <View>
              <Text>Nome: </Text>
              <TextInput style={styles.input} />
            </View>
            <View>
              <Text>Icon: </Text>
              <TextInput style={styles.input} />
            </View>
            <View>
              <Text>Cor: </Text>
              <TextInput style={styles.input} />
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
  },
  closeButton: {
  },
  closeText: {
    fontSize: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee"

  }
});
