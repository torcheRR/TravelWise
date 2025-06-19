import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type SeparatorProps = ViewProps & {
  color?: string;
  thickness?: number;
};

export default function Separator({
  style,
  color = "#eee",
  thickness = 1,
  ...props
}: SeparatorProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color, height: thickness },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
