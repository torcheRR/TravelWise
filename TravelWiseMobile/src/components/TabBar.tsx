import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import Icon from "./Icon";

type TabBarProps = ViewProps & {
  tabs: {
    key: string;
    icon: keyof typeof Icon.glyphMap;
    label: string;
  }[];
  activeTab: string;
  onTabPress: (key: string) => void;
};

export default function TabBar({
  tabs,
  activeTab,
  onTabPress,
  style,
  ...props
}: TabBarProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabPress(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? "#f4511e" : "#666"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#f4511e",
  },
});
