import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Zeynep Kaya",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    postTitle: "Ayasofya Ziyareti",
    date: "1 saat önce",
    text: "gönderini beğendi.",
  },
  {
    id: "2",
    type: "dislike",
    user: {
      name: "Ali Yılmaz",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    postTitle: "Kapadokya Balonları",
    date: "2 saat önce",
    text: "gönderini beğenmedi.",
  },
  {
    id: "3",
    type: "comment",
    user: {
      name: "Mehmet Demir",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    postTitle: "Ayasofya Ziyareti",
    date: "3 saat önce",
    text: "gönderine yorum yaptı: Harika bir fotoğraf!",
  },
  {
    id: "4",
    type: "reply",
    user: {
      name: "Ayşe Yılmaz",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    postTitle: "Kapadokya Balonları",
    date: "4 saat önce",
    text: "yorumuna yanıt verdi: Katılıyorum!",
  },
];

export const NotificationsScreen: React.FC = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.notificationCard}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{item.user.name} </Text>
          {item.text}
        </Text>
        <Text style={styles.postTitle}>{item.postTitle}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      {item.type === "like" && (
        <Ionicons name="thumbs-up-outline" size={22} color={COLORS.primary} />
      )}
      {item.type === "dislike" && (
        <Ionicons name="thumbs-down-outline" size={22} color={COLORS.error} />
      )}
      {item.type === "comment" && (
        <Ionicons name="chatbubble-outline" size={22} color={COLORS.primary} />
      )}
      {item.type === "reply" && (
        <Ionicons
          name="return-down-back-outline"
          size={22}
          color={COLORS.secondary}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildirimler</Text>
      <FlatList
        data={DUMMY_NOTIFICATIONS}
        renderItem={renderItem}
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
    paddingTop: 0,
    marginTop: 50,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  notificationText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },
  userName: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  postTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
});
