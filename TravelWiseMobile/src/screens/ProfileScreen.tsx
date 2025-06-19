import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import {
  getUser,
  updateUser,
  getUserPosts,
  getUserProfile,
  updateUserProfile,
  pickImage,
  uploadProfileImage,
  DEFAULT_PROFILE_IMAGE,
} from "../services/profileService";
import type { User, Post } from "../services/supabase";
import { supabase } from "../config/supabase";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../contexts/AuthContext";
import { usePostsContext } from "../contexts/PostsContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import UserAvatar from "../components/UserAvatar";
import FollowersModal from "../components/FollowersModal";
import { useTheme } from "../contexts/ThemeContext";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  const { user, logout } = useAuth();
  const { posts, loading: postsLoading, error } = usePostsContext();
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);

  useEffect(() => {
    console.log("ProfileScreen useEffect çalıştı");
    console.log("user:", user);
    console.log("route.params:", route.params);

    if (route.params?.userId) {
      console.log("fetchUserAndPosts çağrılacak");
      fetchUserAndPosts();
    } else if (user?.id) {
      console.log("loadProfile çağrılacak");
      loadProfile();
    }
  }, [route.params?.userId, user?.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={{ marginRight: SPACING.lg }}
        >
          <Ionicons name="settings-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme.primary]);

  const fetchUserAndPosts = async () => {
    try {
      // Kullanıcı bilgilerini al
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", route.params.userId)
        .single();

      if (userError) throw userError;
      setProfile(userData);
      setFullName(userData.full_name || "");
      setUsername(userData.username || "");

      // Kullanıcının gönderilerini al
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", route.params.userId)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      // postsData'yi posts context'ine ekle
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      // loading'i false'a çevir
    }
  };

  const loadProfile = async () => {
    if (!user?.id) {
      console.log("loadProfile: user.id bulunamadı");
      return;
    }

    console.log("loadProfile başladı, user.id:", user.id);
    setIsUpdating(true);

    try {
      const data = await getUserProfile(user.id);
      console.log("loadProfile başarılı, data:", data);

      if (!data) {
        throw new Error("Profil verisi bulunamadı");
      }

      setProfile(data);
      setFullName(data.full_name || "");
      setUsername(data.username || "");
    } catch (error: any) {
      console.error("loadProfile hatası:", error);
      Alert.alert(
        "Hata",
        error.message || "Profil bilgileri yüklenirken bir hata oluştu."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    setIsUpdating(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, {
        full_name: fullName,
        username: username,
      });
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert("Başarılı", "Profil bilgileriniz güncellendi.");
    } catch (error: any) {
      if (error.message === "Bu kullanıcı adı zaten kullanılıyor.") {
        Alert.alert(
          "Hata",
          "Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçin."
        );
      } else {
        Alert.alert("Hata", "Profil güncellenirken bir hata oluştu.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImagePick = async () => {
    if (!user?.id) return;

    try {
      const image = await pickImage();
      if (!image) return;

      const imageUrl = await uploadProfileImage(user.id, image.base64);
      await updateUserProfile(user.id, { profile_image_url: imageUrl });
      await loadProfile();
      Alert.alert("Başarılı", "Profil fotoğrafınız güncellendi.");
    } catch (error) {
      Alert.alert("Hata", "Fotoğraf yüklenirken bir hata oluştu.");
    }
  };

  const userPosts = posts?.filter((post) => post.user_id === user?.id) || [];

  if (postsLoading || isUpdating) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const renderPost = ({ item, index }: any) => (
    <TouchableOpacity
      style={styles.gridPostCard}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <Image source={{ uri: item.image_url }} style={styles.gridPostImage} />
      <View style={styles.gridPostOverlay}>
        <View style={styles.gridPostStats}>
          <View style={styles.gridPostStatItem}>
            <Ionicons name="thumbs-up" size={16} color={COLORS.white} />
            <Text style={styles.gridPostStatText}>{item.likes_count || 0}</Text>
          </View>
          <View style={styles.gridPostStatItem}>
            <Ionicons name="thumbs-down" size={16} color={COLORS.white} />
            <Text style={styles.gridPostStatText}>
              {item.dislikes_count || 0}
            </Text>
          </View>
          <View style={styles.gridPostStatItem}>
            <Ionicons name="chatbubble" size={16} color={COLORS.white} />
            <Text style={styles.gridPostStatText}>
              {item.comments_count || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: theme.card, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.avatarContainer}
        >
          <Image
            source={{
              uri: profile?.profile_image_url || DEFAULT_PROFILE_IMAGE,
            }}
            style={styles.avatar}
          />
          <View
            style={[
              styles.editAvatarButton,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons name="camera" size={20} color={theme.card} />
          </View>
        </TouchableOpacity>

        <Text
          style={[
            styles.username,
            { color: COLORS.primary, fontSize: FONT_SIZE.sm },
          ]}
        >
          @{profile?.username}
        </Text>
        <Text style={[styles.fullName, { color: theme.text }]}>
          {profile?.full_name ? profile.full_name : "Adınızı Ekleyin"}
        </Text>
        {profile?.location && (
          <Text style={[styles.location, { color: theme.text }]}>
            <Ionicons name="location-outline" size={16} color={theme.text} />{" "}
            {profile.location}
          </Text>
        )}

        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setFollowersModalVisible(true)}
          >
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {profile?.followers_count || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>
              Takipçi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setFollowingModalVisible(true)}
          >
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {profile?.following_count || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Takip</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {userPosts.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>
              Gönderi
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="İsim Soyisim"
              placeholderTextColor={theme.text}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="Kullanıcı Adı"
              autoCapitalize="none"
              placeholderTextColor={theme.text}
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateProfile}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Gönderilerim</Text>
        {userPosts.length === 0 ? (
          <EmptyState
            icon="camera-outline"
            title="Henüz Gönderi Yok"
            message="İlk gönderini paylaşmaya ne dersin?"
          />
        ) : (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.postsList}
            columnWrapperStyle={styles.postRow}
          />
        )}
      </View>

      <FollowersModal
        visible={followersModalVisible}
        onClose={() => setFollowersModalVisible(false)}
        userId={user?.id}
        type="followers"
      />
      <FollowersModal
        visible={followingModalVisible}
        onClose={() => setFollowingModalVisible(false)}
        userId={user?.id}
        type="following"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  fullName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  postsList: {
    paddingBottom: SPACING.xl,
  },
  gridPostCard: {
    position: "relative",
    width: "33.33%",
    height: 200,
    marginBottom: SPACING.md,
  },
  gridPostImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.background,
  },
  gridPostOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    justifyContent: "flex-end",
  },
  gridPostStats: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  gridPostStatItem: {
    alignItems: "center",
  },
  gridPostStatText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    marginLeft: 4,
  },
  editContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  postRow: {
    justifyContent: "flex-start",
  },
});

export default ProfileScreen;
