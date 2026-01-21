import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorPicker from "react-native-wheel-color-picker";
import { globalStyles } from "@/app/styles/global";

// Tipagem
type Props = {
  visible: boolean;
  initialColor?: string;
  onClose: () => void;
  onSelect: (color: string) => void;
};

export function ColorPickerModal({
  visible,
  initialColor = "#3B82F6",
  onClose,
  onSelect,
}: Props) {

  // Hooks
  const [color, setColor] = useState(initialColor);
  const translateY = useRef(new Animated.Value(320)).current;


  // Functions
  useEffect(() => {
    setColor(initialColor);
  }, [initialColor, visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(320);
    }
  }, [visible]);

  // Abrir modal
  function handleClose() {
    Animated.timing(translateY, {
      toValue: 320,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(onClose);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>

        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }] },
          ]}
        >
          <View style={[globalStyles.row, globalStyles.spacebetween]}>
            <Text style={styles.title}>Selecionar cor</Text>

            <Pressable onPress={handleClose} hitSlop={8}>
              <MaterialIcons name="close" size={22} />
            </Pressable>
          </View>
          <View style={styles.pickerWrapper}>
            <ColorPicker
              color={color}
              onColorChangeComplete={setColor}
              thumbSize={28}
              sliderSize={28}
              noSnap
              row={false}
            />
          </View>

          <Pressable
            style={[
              styles.confirmButton,
              { backgroundColor: "#3B82F6" },
            ]}
            onPress={() => {
              onSelect(color);
              handleClose();
            }}
          >
            <Text style={styles.confirmText}>
              Confirmar cor
            </Text>
          </Pressable>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,

    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // sombra Android
    elevation: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  pickerWrapper: {
    height: 280,
    overflow: "hidden",
  },

  confirmButton: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  confirmText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
