import React from "react";
import {
  RefreshControl,
  RefreshControlProps,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import LoadingSpinner from "./LoadingSpinner";

type PullToRefreshProps = ScrollViewProps & {
  refreshing: boolean;
  onRefresh: () => void;
  containerStyle?: ViewProps["style"];
  spinnerColor?: string;
  spinnerSize?: "small" | "large";
};

export default function PullToRefresh({
  refreshing,
  onRefresh,
  containerStyle,
  spinnerColor = "#f4511e",
  spinnerSize = "small",
  children,
  ...props
}: PullToRefreshProps) {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[spinnerColor]}
          tintColor={spinnerColor}
        />
      }
      contentContainerStyle={[styles.contentContainer, containerStyle]}
      {...props}
    >
      {children}
      {refreshing && (
        <View style={styles.spinnerContainer}>
          <LoadingSpinner size={spinnerSize} color={spinnerColor} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  spinnerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
