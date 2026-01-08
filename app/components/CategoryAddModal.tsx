import { View, Modal, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CategoryAddModal({ visible, onClose }: ModalProps) {
  const translateY = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Evita fechar ao clicar dentro */}
        <Pressable>
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY }] },
            ]}
          >
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <Text>Conteúdo do modal</Text>
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
    justifyContent: "flex-start",
  },
  modal: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 60,
    padding: 20,
    borderRadius: 12,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeText: {
    fontSize: 18,
  },
});
