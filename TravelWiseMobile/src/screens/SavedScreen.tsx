import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const DUMMY_SAVED = [
  {
    id: "1",
    user: {
      name: "Berkay Ocer",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    image: "https://picsum.photos/400/304",
    title: "Ayasofya Ziyareti",
    description: "Ayasofya'da tarihi bir gün geçirdim.",
    date: "20.07.2024",
    likes: 45,
    comments: 3,
  },
  {
    id: "2",
    user: {
      name: "Zeynep Kaya",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    image: "https://picsum.photos/400/305",
    title: "Kapadokya Balonları",
    description: "Kapadokya'da balon turu harikaydı!",
    date: "15.08.2024",
    likes: 67,
    comments: 5,
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - 12) / 2;

export const SavedScreen: React.FC = () => {
  if (DUMMY_SAVED.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="bookmark-outline"
          size={64}
          color={COLORS.primary}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.title}>Kaydedilen Gönderiler</Text>
        <Text style={styles.subtitle}>
          Henüz kaydedilmiş bir gönderiniz yok.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <View style={styles.gridContent}>
        <View style={styles.gridHeader}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={styles.username} numberOfLines={1}>
            {item.user.name}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.gridTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.gridDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.gridFooter}>
          <Ionicons name="thumbs-up-outline" size={16} color={COLORS.primary} />
          <Text style={styles.footerText}>{item.likes}</Text>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={COLORS.primary}
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.footerText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={DUMMY_SAVED}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{
        padding: SPACING.lg,
        paddingTop: 0,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={styles.title}>Kaydedilen Gönderiler</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE + 90,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  gridImage: {
    width: "100%",
    height: GRID_SIZE,
    resizeMode: "cover",
  },
  gridContent: {
    padding: 8,
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: COLORS.surface,
  },
  username: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
    fontWeight: "600",
    flex: 1,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  gridTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  gridFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
    marginLeft: 2,
  },
});
