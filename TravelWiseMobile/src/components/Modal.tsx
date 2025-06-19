import React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type ModalProps = ViewProps & {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  visible,
  onClose,
  children,
  style,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, style]} {...props}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: "90%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
