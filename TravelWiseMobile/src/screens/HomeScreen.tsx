import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  author: string;
  likes: number;
  comments: number;
  createdAt: string;
};

const dummyPosts: Post[] = [
  {
    id: "1",
    title: "Kapadokya'da Büyülü Bir Gün",
    description: "Balon turu ve yeraltı şehri gezisi...",
    image: "https://source.unsplash.com/random/800x600?cappadocia",
    location: "Nevşehir, Türkiye",
    author: "@gezgin123",
    likes: 128,
    comments: 24,
    createdAt: "23 Mart 2024",
  },
  // Daha fazla gönderi eklenebilir
];

const HomeScreen = ({ navigation }: any) => {
  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={styles.postMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.metaText}>{item.createdAt}</Text>
          </View>
        </View>
        <Text style={styles.postDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#666" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={16} color="#666" />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
          <Text style={styles.authorText}>{item.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dummyPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  postDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  authorText: {
    fontSize: 14,
    color: "#2563eb",
    marginLeft: "auto",
  },
});

export default HomeScreen;
