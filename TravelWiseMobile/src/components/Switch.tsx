import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  Switch as RNSwitch,
} from "react-native";
import Icon from "./Icon";

type SwitchProps = ViewProps & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
};

export default function Switch({
  value,
  onValueChange,
  label,
  disabled = false,
  trackColor = { false: "#767577", true: "#81b0ff" },
  thumbColor = "#f4f3f4",
  style,
  ...props
}: SwitchProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={trackColor}
        thumbColor={thumbColor}
      />
      {label && (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  track: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ddd",
    padding: 2,
  },
  trackActive: {
    backgroundColor: "#f4511e",
  },
  trackDisabled: {
    backgroundColor: "#f5f5f5",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  thumbActive: {
    transform: [{ translateX: 24 }],
  },
  thumbDisabled: {
    backgroundColor: "#f5f5f5",
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
