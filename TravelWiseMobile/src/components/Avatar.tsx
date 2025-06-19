import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type AvatarProps = ViewProps & {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  color?: string;
  textColor?: string;
};

export default function Avatar({
  source,
  name,
  size = 40,
  color = "#f4511e",
  textColor = "#fff",
  style,
  ...props
}: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
      {...props}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : name ? (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: size * 0.4,
            },
          ]}
        >
          {getInitials(name)}
        </Text>
      ) : (
        <Icon name="person" size={size * 0.6} color={textColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  text: {
    fontWeight: "bold",
  },
});
