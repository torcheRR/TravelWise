import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import Icon from "./Icon";

type EmptyStateProps = ViewProps & {
  icon?: keyof typeof Icon.glyphMap;
  title: string;
  message?: string;
};

export default function EmptyState({
  icon = "alert-circle-outline",
  title,
  message,
  style,
  ...props
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Icon name={icon} size={48} color="#999" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
