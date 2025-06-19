import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UserAvatar from "./UserAvatar";

type Comment = {
  avatar_url?: string;
  username?: string;
  content: string;
  created_at: string;
  likes_count?: number;
  dislikes_count?: number;
};

type CommentCardProps = {
  comment: Comment;
};

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <UserAvatar
          user={{ avatar_url: comment.avatar_url, username: comment.username }}
          size={28}
        />
        <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
          {comment.username || "Kullanıcı"}
        </Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(comment.created_at).toLocaleDateString("tr-TR")}
        </Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>❤️ {comment.likes_count}</Text>
          <Text style={styles.stat}>👎 {comment.dislikes_count}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
});
