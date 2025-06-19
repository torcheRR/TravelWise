import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type FooterProps = ViewProps & {
  text: string;
};

export default function Footer({ text, style, ...props }: FooterProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
