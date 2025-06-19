import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  title,
  loading = false,
  variant = "primary",
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#f4511e" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "outline" && styles.outlineText,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#f4511e",
  },
  secondary: {
    backgroundColor: "#666",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#f4511e",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineText: {
    color: "#f4511e",
  },
  disabledText: {
    color: "#999",
  },
});
