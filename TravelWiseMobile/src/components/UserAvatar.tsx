import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
// import { User } from "../../../shared/supabase";
type User = {
  avatar_url?: string;
  username?: string;
};
import { DEFAULT_PROFILE_IMAGE } from "../constants/theme";

type UserAvatarProps = {
  user: User;
  size?: number;
};

export default function UserAvatar({ user, size = 40 }: UserAvatarProps) {
  const avatarSource = user.avatar_url
    ? { uri: user.avatar_url }
    : DEFAULT_PROFILE_IMAGE;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={avatarSource} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#f4511e",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
