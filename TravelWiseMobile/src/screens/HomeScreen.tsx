import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/theme";
import { Button } from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DUMMY_POSTS = [
  {
    id: "1",
    user: {
      name: "Kullanıcı Adı",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      location: "İstanbul, Türkiye",
    },
    image: "https://picsum.photos/400/300",
    title: "İstanbul'da 3 Gün",
    description:
      "İstanbul'un tarihi mekanlarını keşfettim ve harika deneyimler yaşadım.",
    date: "15-18 Mart 2024",
    likes: 129,
    comments: 2,
  },
  {
    id: "2",
    user: {
      name: "Ayşe Yılmaz",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      location: "Ankara, Türkiye",
    },
    image: "https://picsum.photos/400/301",
    title: "Ankara'da Kültür Turu",
    description: "Müzeleri gezdim, çok keyifliydi!",
    date: "10-12 Şubat 2024",
    likes: 87,
    comments: 5,
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const renderPost = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.userLocation}>{item.user.location}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.cardContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Ionicons
                name="thumbs-up-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <Text style={styles.iconText}>{item.likes}</Text>
            <TouchableOpacity style={{ marginLeft: 12 }}>
              <Ionicons
                name="thumbs-down-outline"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 16 }}
            />
            <Text style={styles.iconText}>{item.comments}</Text>
          </View>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>TravelWise</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={28}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={DUMMY_POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  appTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  notificationBtn: {
    padding: 4,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  userLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  postImage: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    padding: SPACING.md,
  },
  postTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  postDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  postDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
