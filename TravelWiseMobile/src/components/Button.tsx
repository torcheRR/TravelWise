import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONT_WEIGHT,
} from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    };

    switch (variant) {
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
        };
      case "large":
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
        };
      default:
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
        };
    }
  };

  const getTextColor = () => {
    if (variant === "outline") {
      return COLORS.primary;
    }
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  disabled: {
    opacity: 0.5,
  },
});
