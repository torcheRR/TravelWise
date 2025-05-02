import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const USER = {
  name: "Kullanıcı Adı",
  username: "kullanici123",
  bio: "İstanbul, Türkiye\nGezgin | Fotoğrafçı | Seyahat Tutkunu",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  cover:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  posts: 24,
  followers: 142,
  following: 98,
};

const POSTS = [
  {
    id: "1",
    image: "https://picsum.photos/200/200",
    title: "asda",
    desc: "asdadada",
    date: "01.04.2025",
    location: "İstanbul",
    likes: 129,
    comments: 2,
  },
  {
    id: "2",
    image: "https://picsum.photos/200/201",
    title: "selam",
    desc: "asdadada",
    date: "02.04.2025",
    location: "Ankara",
    likes: 99,
    comments: 1,
  },
];

// Tarihe göre azalan sırala (en son paylaşım en üstte)
const sortedPosts = [...POSTS].sort(
  (a, b) =>
    new Date(b.date.split(".").reverse().join("-")).getTime() -
    new Date(a.date.split(".").reverse().join("-")).getTime()
);

export const ProfileScreen: React.FC = () => {
  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDesc}>{item.desc}</Text>
        <View style={styles.postFooter}>
          <Text style={styles.postDate}>{item.date}</Text>
          <Text style={styles.postLocation}>{item.location}</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity>
            <Ionicons
              name="thumbs-up-outline"
              size={18}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.iconText}>{item.likes}</Text>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons
              name="thumbs-down-outline"
              size={18}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={COLORS.primary}
            style={{ marginLeft: 12 }}
          />
          <Text style={styles.iconText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.coverContainer}>
            <Image source={{ uri: USER.cover }} style={styles.coverImage} />
            <TouchableOpacity style={styles.coverEditBtn}>
              <Ionicons
                name="camera-outline"
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: USER.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditBtn}>
                <Ionicons
                  name="camera-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{USER.name}</Text>
            <Text style={styles.username}>@{USER.username}</Text>
            <Text style={styles.bio}>{USER.bio}</Text>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.white} />
              <Text style={styles.editProfileText}>Profili Düzenle</Text>
            </TouchableOpacity>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{USER.posts}</Text>
                <Text style={styles.statLabel}>Gönderiler</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{USER.followers}</Text>
                <Text style={styles.statLabel}>Takipçiler</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{USER.following}</Text>
                <Text style={styles.statLabel}>Takip Edilenler</Text>
              </View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Gönderiler</Text>
        </>
      }
      data={sortedPosts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 32 }}
      style={{ backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.primary,
    position: "relative",
    marginBottom: 60,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  coverEditBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "absolute",
    left: 24,
    bottom: -36,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 4,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
  },
  avatarEditBtn: {
    position: "absolute",
    right: -8,
    bottom: -8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  infoContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  username: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  bio: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  editProfileText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 6,
    fontSize: FONT_SIZE.sm,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 8,
  },
  postCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: SPACING.md,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  postImage: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.surface,
  },
  postContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  postTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  postDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  postDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  postLocation: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
    marginLeft: 4,
  },
});
