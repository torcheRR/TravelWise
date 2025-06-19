import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type ProgressBarProps = ViewProps & {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
};

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = "#f4511e",
  backgroundColor = "#f5f5f5",
  height = 8,
  style,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={[styles.container, style]} {...props}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor, height }]}>
        <View
          style={[
            styles.progress,
            {
              backgroundColor: color,
              width: `${percentage}%`,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  percentage: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  track: {
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    borderRadius: 4,
  },
});
