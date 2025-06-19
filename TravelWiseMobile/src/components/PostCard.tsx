import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type {
  RootStackParamList,
  MainStackParamList,
} from "../navigation/AppNavigator";
import UserAvatar from "./UserAvatar";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../config/supabase";
import { useSavedContext } from "../contexts/SavedContext";
import { usePostLike } from "../contexts/PostLikeContext";
import { COLORS } from "@/constants/theme";

type PostCardProps = {
  post?: any;
  postId?: string;
  onPress?: () => void;
};

type PostCardNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "PostDetail"
>;

// Kategori mapping fonksiyonu
const CATEGORY_LABELS: Record<string, string> = {
  food: "Yeme-İçme",
  museums: "Müze",
  nature: "Doğa",
  other: "Diğer",
};

export default function PostCard({
  post: propPost,
  postId,
  onPress,
}: PostCardProps) {
  const navigation = useNavigation<PostCardNavigationProp>();
  const { refetch: refetchSaved, savedPostIds } = useSavedContext
    ? useSavedContext()
    : { refetch: undefined, savedPostIds: [] as any[] };
  const { likeStatus, updateLikeStatus } = usePostLike();
  const [post, setPost] = useState<any>(propPost || null);
  const [saved, setSaved] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);

  const currentPostId = postId || post?.id;
  const currentLikeStatus = currentPostId ? likeStatus[currentPostId] : null;

  useEffect(() => {
    if (!propPost && postId) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from("posts")
          .select("*, user:user_id(*)")
          .eq("id", postId)
          .single();
        if (!error) setPost(data);
      };
      fetchPost();
    } else if (propPost) {
      setPost(propPost);
    }
  }, [propPost, postId]);

  // saved durumunu context'ten belirle
  useEffect(() => {
    setSaved(savedPostIds && savedPostIds.includes(postId || post?.id));
  }, [savedPostIds, postId, post?.id]);

  useEffect(() => {
    if (currentPostId) {
      fetchLikeStatus();
    }
  }, [currentPostId]);

  const fetchLikeStatus = async () => {
    if (!currentPostId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    // Kullanıcının bu post için like/dislike durumu
    const { data: userLike } = await supabase
      .from("post_likes")
      .select("type")
      .eq("user_id", user.id)
      .eq("post_id", currentPostId)
      .single();

    // Post'un like/dislike sayılarını posts tablosundan al
    const { data: postData } = await supabase
      .from("posts")
      .select("likes_count, dislikes_count")
      .eq("id", currentPostId)
      .single();

    if (postData) {
      updateLikeStatus(
        currentPostId,
        userLike?.type || null,
        postData.likes_count || 0,
        postData.dislikes_count || 0
      );
    }
  };

  const handleSave = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      if (saved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId || post?.id);
        if (!error && refetchSaved) refetchSaved();
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert({ user_id: user.id, post_id: postId || post?.id });
        if (!error && refetchSaved) refetchSaved();
      }
    } catch (e) {
      // Hata yönetimi eklenebilir
    }
  };

  const handleLike = async () => {
    if (likeLoading || !currentPostId) return;
    setLikeLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      if (currentLikeStatus?.status === "like") {
        // Beğeniyi kaldır
        await supabase
          .from("post_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", currentPostId);
      } else {
        // Önceki dislike varsa kaldır
        if (currentLikeStatus?.status === "dislike") {
          await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", currentPostId);
        }
        // Yeni like ekle
        await supabase.from("post_likes").insert({
          user_id: user.id,
          post_id: currentPostId,
          type: "like",
        });
      }
      // Güncel veriyi çek
      await fetchLikeStatus();
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (dislikeLoading || !currentPostId) return;
    setDislikeLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      if (currentLikeStatus?.status === "dislike") {
        // Dislike'ı kaldır
        await supabase
          .from("post_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", currentPostId);
      } else {
        // Önceki like varsa kaldır
        if (currentLikeStatus?.status === "like") {
          await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", currentPostId);
        }
        // Yeni dislike ekle
        await supabase.from("post_likes").insert({
          user_id: user.id,
          post_id: currentPostId,
          type: "dislike",
        });
      }
      // Güncel veriyi çek
      await fetchLikeStatus();
    } catch (error) {
      console.error("Dislike işlemi sırasında hata:", error);
    } finally {
      setDislikeLoading(false);
    }
  };

  if (!post) return null;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={
        onPress ||
        (() =>
          navigation.navigate("PostDetail", { postId: postId || post?.id }))
      }
    >
      <View style={styles.headerRow}>
        <UserAvatar
          user={{
            avatar_url: post.user?.avatar_url,
            username: post.user?.username,
          }}
          size={40}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.username}>{post.user?.full_name}</Text>
          <Text style={styles.userHandle}>@{post.user?.username}</Text>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#FF3B6A"
          />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: post.image_url }} style={styles.image} />
      <View style={styles.content}>
        {post.category && (
          <Text style={styles.category}>
            {CATEGORY_LABELS[post.category] || post.category}
          </Text>
        )}
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {post.description}
        </Text>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={handleLike}
            disabled={likeLoading}
          >
            <Ionicons
              name="thumbs-up-outline"
              size={20}
              color={currentLikeStatus?.status === "like" ? "#FF3B6A" : "#888"}
            />
            <Text style={styles.statText}>{currentLikeStatus?.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={handleDislike}
            disabled={dislikeLoading}
          >
            <Ionicons
              name="thumbs-down-outline"
              size={20}
              color={
                currentLikeStatus?.status === "dislike" ? "#FF3B6A" : "#888"
              }
            />
            <Text style={styles.statText}>
              {currentLikeStatus?.dislikes || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => console.log("Yorum")}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#FF3B6A" />
            <Text style={styles.statText}>{post.comments_count}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={{ alignItems: "flex-end" }}>
            {post.location && (
              <Text style={styles.location}>{post.location}</Text>
            )}
            <Text style={styles.date}>
              {new Date(post.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.text,
  },
  userHandle: {
    fontSize: 13,
    color: COLORS.primary,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 15,
    color: "#FF3B6A",
    marginLeft: 4,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    color: "#888",
  },
  location: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
  },
  category: {
    fontSize: 13,
    color: "#FF3B6A",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "capitalize",
  },
});
