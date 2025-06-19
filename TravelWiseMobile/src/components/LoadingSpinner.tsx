import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";

type LoadingSpinnerProps = ViewProps & {
  size?: "small" | "large";
  color?: string;
};

export default function LoadingSpinner({
  size = "large",
  color = "#f4511e",
  style,
  ...props
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
