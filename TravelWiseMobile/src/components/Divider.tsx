import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type DividerProps = ViewProps & {
  text?: string;
  color?: string;
  thickness?: number;
  textColor?: string;
};

export default function Divider({
  text,
  color = "#ddd",
  thickness = 1,
  textColor = "#666",
  style,
  ...props
}: DividerProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View
        style={[
          styles.line,
          {
            backgroundColor: color,
            height: thickness,
          },
        ]}
      />
      {text && (
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
  },
});
