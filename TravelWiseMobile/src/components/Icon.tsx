import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type IconProps = ViewProps & {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export default function Icon({
  name,
  size = 24,
  color = "#333",
  style,
  ...props
}: IconProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
