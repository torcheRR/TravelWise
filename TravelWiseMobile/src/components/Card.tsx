import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";

type CardProps = ViewProps & {
  onPress?: () => void;
  elevation?: number;
};

export default function Card({
  children,
  onPress,
  elevation = 2,
  style,
  ...props
}: CardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        {
          elevation,
          shadowOpacity: elevation * 0.1,
          shadowRadius: elevation,
        },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
  },
});
