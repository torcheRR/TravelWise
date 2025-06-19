import React, { useEffect, useState } from "react";
import { NetInfo } from "react-native";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import Icon from "./Icon";

type NetworkStatusProps = ViewProps & {
  onNetworkChange?: (isConnected: boolean) => void;
};

export default function NetworkStatus({
  onNetworkChange,
  style,
  ...props
}: NetworkStatusProps) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);
      onNetworkChange?.(connected);
    });

    return () => {
      unsubscribe();
    };
  }, [onNetworkChange]);

  if (isConnected) return null;

  return (
    <View style={[styles.container, style]} {...props}>
      <Icon name="wifi-off" size={20} color="#fff" style={styles.icon} />
      <Text style={styles.text}>İnternet Bağlantısı Yok</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    padding: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
