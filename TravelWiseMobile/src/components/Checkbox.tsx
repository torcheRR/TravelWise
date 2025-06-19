import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type CheckboxProps = ViewProps & {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export default function Checkbox({
  checked,
  onValueChange,
  label,
  disabled = false,
  style,
  ...props
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onValueChange(!checked)}
      disabled={disabled}
      {...props}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <Icon name="checkmark" size={16} color="#fff" />}
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#f4511e",
    borderColor: "#f4511e",
  },
  disabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
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
