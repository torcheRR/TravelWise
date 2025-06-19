import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type HeaderProps = ViewProps & {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
};

export default function Header({
  title,
  showBackButton = false,
  rightComponent,
  style,
  ...props
}: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.left}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>{rightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  left: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
});
