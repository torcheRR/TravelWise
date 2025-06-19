import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type ListItemProps = ViewProps & {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Icon.glyphMap;
  rightIcon?: keyof typeof Icon.glyphMap;
  onPress?: () => void;
};

export default function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  style,
  ...props
}: ListItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[styles.container, style]} onPress={onPress} {...props}>
      {leftIcon && (
        <Icon name={leftIcon} size={24} color="#666" style={styles.leftIcon} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {rightIcon && (
        <Icon
          name={rightIcon}
          size={24}
          color="#666"
          style={styles.rightIcon}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  leftIcon: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rightIcon: {
    marginLeft: 16,
  },
});
