import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const DUMMY_POSTS = [
  {
    id: "1",
    user: {
      name: "Ali Yılmaz",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    image: "https://picsum.photos/400/302",
    title: "Balon Turu Deneyimi",
    description: "Kapadokya'da harika bir balon turu yaptık!",
    date: "10.05.2024",
    likes: 87,
    comments: 4,
  },
  {
    id: "2",
    user: {
      name: "Zeynep Kaya",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    image: "https://picsum.photos/400/303",
    title: "Güzel Manzaralar",
    description: "Pamukkale'nin beyaz travertenlerinde yürümek harikaydı.",
    date: "12.06.2024",
    likes: 65,
    comments: 2,
  },
];

export const DestinationDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { destination } = route.params || {
    destination: { title: "Destinasyon", location: "" },
  };

  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDesc}>{item.description}</Text>
        <Text style={styles.postMeta}>
          {item.date} • {item.likes} beğeni • {item.comments} yorum
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{destination.title}</Text>
      <Text style={styles.location}>{destination.location}</Text>
      <FlatList
        data={DUMMY_POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    marginTop: 24,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 2,
  },
  location: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  postCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
  postMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
});
