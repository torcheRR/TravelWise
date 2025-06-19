import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/AppNavigator";
import EmptyState from "../components/EmptyState";
import { useNotifications } from "../contexts/NotificationContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useTheme } from "../contexts/ThemeContext";
import { getPost, getComment } from "../services/supabase";

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "Notifications"
>;

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { notifications, loading, error, refreshNotifications } =
    useNotifications();
  const { theme } = useTheme();

  useEffect(() => {
    refreshNotifications();
  }, []);

  const handleNotificationPress = async (item: any) => {
    try {
      let postId = item.post_id;
      let commentId = item.comment_id;

      // Eğer post_id yoksa, comment_id üzerinden post_id bul
      if (!postId && commentId) {
        const comment = await getComment(commentId);
        if (comment && comment.post_id) {
          postId = comment.post_id;
        }
      }

      if (postId) {
        const post = await getPost(postId);
        if (!post) {
          Alert.alert(
            "Gönderi Bulunamadı",
            "Bu gönderi silinmiş veya erişilemiyor."
          );
          return;
        }
        navigation.navigate("PostDetail", {
          postId: post.id,
          commentId: commentId,
        });
      } else {
        Alert.alert(
          "Bildirim Hatası",
          "Bu bildirim için geçerli bir gönderi bulunamadı."
        );
      }
    } catch (error) {
      Alert.alert(
        "Hata",
        "Bildirim detayları yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const renderItem = ({ item }: any) => {
    console.log("renderItem", item);
    return (
      <TouchableOpacity
        style={[styles.notificationItem, { backgroundColor: theme.card }]}
        onPress={() => {
          console.log("Bildirim tıklandı", item);
          handleNotificationPress(item);
        }}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri:
              item.from_user?.avatar_url ||
              `https://ui-avatars.com/api/?name=${
                item.from_user?.username || "User"
              }&size=40`,
          }}
          style={styles.avatar}
        />
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationText, { color: theme.text }]}>
            <Text style={[styles.username, { color: theme.primary }]}>
              {item.from_user?.username || "Kullanıcı"}
            </Text>
            {item.type === "reply"
              ? ` sana yanıt verdi: ${item.content || ""}`
              : item.type === "like"
              ? " gönderini beğendi"
              : item.type === "comment"
              ? " gönderine yorum yaptı"
              : " bildirim"}
          </Text>
          <Text style={[styles.timestamp, { color: theme.secondary }]}>
            {new Date(item.created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {!item.is_read && (
          <View
            style={[styles.unreadDot, { backgroundColor: theme.primary }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  let content = null;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = (
      <ErrorMessage
        message={typeof error === "string" ? error : JSON.stringify(error)}
      />
    );
  } else if (!notifications || notifications.length === 0) {
    content = (
      <EmptyState
        icon="notifications-off-outline"
        title="Bildirim Yok"
        message="Henüz hiç bildiriminiz bulunmuyor."
      />
    );
  } else {
    content = (
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme.primary}
            style={{ marginTop: 12 }}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.sectionTitle,
            { marginBottom: 12, color: theme.primary },
          ]}
        >
          Bildirimler
        </Text>
      </View>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: 32,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    marginTop: 24,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: 8,
  },
  listContent: {
    padding: SPACING.lg,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: FONT_SIZE.sm,
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
});

export default NotificationsScreen;
