import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";

type ImagePickerProps = ViewProps & {
  image?: ImageSourcePropType;
  onImagePick: () => void;
  size?: number;
};

export default function ImagePicker({
  image,
  onImagePick,
  size = 100,
  style,
  ...props
}: ImagePickerProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onImagePick}
      {...props}
    >
      {image ? (
        <Image
          source={image}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Icon name="camera" size={size / 3} color="#999" />
        </View>
      )}
      <View style={styles.overlay}>
        <Icon name="camera" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
