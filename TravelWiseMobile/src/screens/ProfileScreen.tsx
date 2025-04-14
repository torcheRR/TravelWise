import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 48) / COLUMN_COUNT;

type Post = {
  id: string;
  image: string;
  likes: number;
  comments: number;
};

const dummyPosts: Post[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    likes: 120,
    comments: 15,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    likes: 85,
    comments: 8,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    likes: 200,
    comments: 25,
  },
];

const ProfileScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.postImage}
        defaultSource={{ uri: "https://via.placeholder.com/300x300" }}
      />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={16} color="#fff" />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profilim</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.avatar}
              defaultSource={{ uri: "https://via.placeholder.com/150x150" }}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Ahmet Yılmaz</Text>
          <Text style={styles.username}>@ahmetyilmaz</Text>

          <Text style={styles.bio}>
            Gezgin 🌍 | Fotoğrafçı 📸 | Macera Tutkunu 🏃‍♂️
          </Text>

          <View style={styles.stats}>
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Gönderi</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>843</Text>
              <Text style={styles.statLabel}>Takip</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editProfileButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "posts" && styles.activeTab]}
              onPress={() => setActiveTab("posts")}
            >
              <Ionicons
                name="grid-outline"
                size={24}
                color={activeTab === "posts" ? "#2563eb" : "#64748b"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "saved" && styles.activeTab]}
              onPress={() => setActiveTab("saved")}
            >
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={activeTab === "saved" ? "#2563eb" : "#64748b"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.postsGrid}>
            {dummyPosts.map((post) => renderPost({ item: post }))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  settingsButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#2563eb",
  },
  editAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#2563eb",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  statColumn: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  editProfileButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
  },
  postItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    padding: 4,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    justifyContent: "flex-end",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ProfileScreen;
