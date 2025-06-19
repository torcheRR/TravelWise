import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type RadioButtonProps = ViewProps & {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export default function RadioButton({
  checked,
  onValueChange,
  label,
  disabled = false,
  style,
  ...props
}: RadioButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onValueChange(!checked)}
      disabled={disabled}
      {...props}
    >
      <View
        style={[
          styles.radio,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <View style={styles.inner} />}
      </View>
      {label && (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    borderColor: "#f4511e",
  },
  disabled: {
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f4511e",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  disabledLabel: {
    color: "#999",
  },
});
