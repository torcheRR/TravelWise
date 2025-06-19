import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type BadgeProps = ViewProps & {
  value: number | string;
  color?: string;
  textColor?: string;
  size?: number;
  maxValue?: number;
};

export default function Badge({
  value,
  color = "#f4511e",
  textColor = "#fff",
  size = 20,
  maxValue = 99,
  style,
  ...props
}: BadgeProps) {
  const displayValue =
    typeof value === "number" && value > maxValue ? `${maxValue}+` : value;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: size * 0.6,
          },
        ]}
      >
        {displayValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
