import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import {
  getPost,
  getComments,
  addComment,
  deleteComment,
  subscribeToComments,
  addNotification,
} from "../services/supabase";
import type { Post, Comment } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View as ViewType } from "react-native";
import { supabase } from "../config/supabase";
import { usePostsContext } from "../contexts/PostsContext";
import { usePostLike } from "../contexts/PostLikeContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Kategori mapping fonksiyonu
const CATEGORY_LABELS: Record<string, string> = {
  food: "Yeme-İçme",
  museums: "Müze",
  nature: "Doğa",
  other: "Diğer",
};

// Tarih formatı fonksiyonu
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks > 0) {
    return `${diffInWeeks} hafta önce`;
  } else if (diffInDays > 0) {
    return `${diffInDays} gün önce`;
  } else if (diffInHours > 0) {
    return `${diffInHours} saat önce`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} dakika önce`;
  } else {
    return `${diffInSeconds} saniye önce`;
  }
};

type PostDetailScreenRouteProp = RouteProp<MainStackParamList, "PostDetail">;
type PostDetailScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "PostDetail"
>;

export const PostDetailScreen = () => {
  const route = useRoute<PostDetailScreenRouteProp>();
  const navigation = useNavigation<PostDetailScreenNavigationProp>();
  const { postId, commentId } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const commentRefs = useRef<Record<any, ViewType | null>>({});
  const inputRef = useRef<TextInput>(null);
  const { refreshPosts } = usePostsContext();
  const { likeStatus, updateLikeStatus } = usePostLike();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [likes, setLikes] = useState(post?.likes_count || 0);
  const [dislikes, setDislikes] = useState(post?.dislikes_count || 0);
  const [userLikeStatus, setUserLikeStatus] = useState<
    "like" | "dislike" | null
  >(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const { user } = useAuth();

  const commentHeights = useRef<{ [key: string]: number }>({});

  const currentLikeStatus = postId ? likeStatus[postId] : null;

  const [postUser, setPostUser] = useState(null);

  // Yorumları ana yorumlar ve yanıtlar olarak ayır
  const mainComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const openSwipeableRef = useRef<any>(null);

  useEffect(() => {
    const fetchPostUser = async () => {
      if (post?.user_id) {
        const { data, error } = await supabase
          .from("users")
          .select("avatar_url, full_name, username")
          .eq("id", post.user_id)
          .single();
        if (data) setPostUser(data);
      }
    };
    fetchPostUser();
  }, [post?.user_id]);
  useEffect(() => {
    loadPostAndComments();

    const subscription = subscribeToComments(postId, (payload) => {
      if (payload.eventType === "INSERT") {
        setComments((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "DELETE") {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== payload.old.id)
        );
      } else if (payload.eventType === "UPDATE") {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === payload.new.id ? payload.new : comment
          )
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchLikeStatus();
    }
  }, [postId]);

  const fetchLikeStatus = async () => {
    if (!postId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    // Kullanıcının bu post için like/dislike durumu
    const { data: userLike } = await supabase
      .from("post_likes")
      .select("type")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    // Post'un like/dislike sayılarını posts tablosundan al
    const { data: postData } = await supabase
      .from("posts")
      .select("likes_count, dislikes_count")
      .eq("id", postId)
      .single();

    if (postData) {
      updateLikeStatus(
        postId,
        userLike?.type || null,
        postData.likes_count || 0,
        postData.dislikes_count || 0
      );
    }
  };

  // Yorum ID'si varsa, o yoruma scroll yap
  useEffect(() => {
    if (commentId && comments.length > 0) {
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        // Eğer yorum bir yanıtsa, parent yorumun yanıtlarını aç
        if (comment.parent_id) {
          setOpenReplies((prev) => ({
            ...prev,
            [comment.parent_id]: true,
          }));
        }
        // Scroll işlemi için kısa bir gecikme ekle
        setTimeout(() => {
          commentRefs.current[commentId]?.measureLayout(
            scrollViewRef.current?.getScrollableNode() as any,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y, animated: true });
            },
            () => {}
          );
        }, 500);
      }
    }
  }, [commentId, comments]);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        getPost(postId),
        getComments(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error("Veri yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      let content = newComment.trim();
      let parentUserId;
      let parentUsername;
      if (replyingTo) {
        parentUserId = replyingTo.user_id;
        parentUsername = replyingTo.user?.username;
        if (parentUsername) {
          // Yanıtın başına etiket ekle
          content = `@${parentUsername} ${content}`;
        }
      }
      const comment = await addComment(postId, content, replyingTo?.id);
      if (replyingTo && parentUserId) {
        await addNotification(
          parentUserId,
          user.id,
          comment.id,
          "reply",
          content
        );
      }
      setNewComment("");
      setReplyingTo(null);
      await loadPostAndComments();
    } catch (error) {
      console.error("Yorum eklenirken hata:", error);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadPostAndComments();
    } catch (error) {
      console.error("Yorum silinirken hata:", error);
    }
  };

  const handleLike = async () => {
    if (likeLoading || !postId) return;
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
          .eq("post_id", postId);
      } else {
        // Önceki dislike varsa kaldır
        if (currentLikeStatus?.status === "dislike") {
          await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId);
        }
        // Yeni like ekle
        await supabase.from("post_likes").insert({
          user_id: user.id,
          post_id: postId,
          type: "like",
        });
      }
      // Güncel veriyi çek
      await fetchLikeStatus();
      // HomeScreen'i güncelle
      await refreshPosts();
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (dislikeLoading || !postId) return;
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
          .eq("post_id", postId);
      } else {
        // Önceki like varsa kaldır
        if (currentLikeStatus?.status === "like") {
          await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId);
        }
        // Yeni dislike ekle
        await supabase.from("post_likes").insert({
          user_id: user.id,
          post_id: postId,
          type: "dislike",
        });
      }
      // Güncel veriyi çek
      await fetchLikeStatus();
      // HomeScreen'i güncelle
      await refreshPosts();
    } catch (error) {
      console.error("Dislike işlemi sırasında hata:", error);
    } finally {
      setDislikeLoading(false);
    }
  };

  // Recursive yorum render fonksiyonu
  const renderComment = (comment: Comment, level = 0) => {
    const replies = comments.filter((c) => c.parent_id === comment.id);
    const isOpen = openReplies[comment.id];

    const renderRightActions = () => {
      return (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteComment(comment.id)}
        >
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable
        key={comment.id}
        ref={(ref) => {
          if (ref) {
            commentRefs.current[comment.id.toString()] = ref;
          }
        }}
        onSwipeableWillOpen={() => {
          if (
            openSwipeableRef.current &&
            openSwipeableRef.current !==
              commentRefs.current[comment.id.toString()]
          ) {
            openSwipeableRef.current.close();
          }
          openSwipeableRef.current = commentRefs.current[comment.id.toString()];
        }}
        renderRightActions={renderRightActions}
        overshootRight={false}
      >
        <View style={[styles.comment, { marginLeft: level === 1 ? 24 : 0 }]}>
          <View style={styles.commentHeader}>
            <Image
              source={{ uri: comment.user?.avatar_url }}
              style={styles.commentAvatar}
            />
            <View>
              <Text style={styles.commentFullName}>
                {comment.user?.full_name}
              </Text>
              <Text style={styles.commentUsername}>
                @{comment.user?.username}
              </Text>
            </View>
          </View>
          <Text style={styles.commentContent}>{comment.content}</Text>
          <Text style={styles.commentDate}>
            {formatDate(new Date(comment.created_at))}
          </Text>
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => handleReply(comment)}>
              <Text style={styles.replyButton}>Yanıtla</Text>
            </TouchableOpacity>
            {/* Yanıtları göster/gizle butonu sadece ana yorumlarda (level 0) */}
            {level === 0 && replies.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  setOpenReplies((prev) => ({
                    ...prev,
                    [comment.id]: !isOpen,
                  }))
                }
              >
                <Text style={styles.replyButton}>
                  {isOpen ? "Yanıtları gizle" : `Yanıtları göster`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Alt yanıtlar sadece ana yorumlarda (level 0) ve isOpen true ise gösterilir */}
          {level === 0 &&
            isOpen &&
            replies.map((reply) => renderComment(reply, level + 1))}
          {/* Alt yanıtlar (level > 0) otomatik olarak gösterilir */}
          {level > 0 && replies.map((reply) => renderComment(reply, level + 1))}
        </View>
      </Swipeable>
    );
  };

  if (loading || !post) {
    return (
      <View style={styles.centered}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={{ position: "absolute", top: 50, left: 1, zIndex: 100 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 12 }}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{}</Text>
          </View>
          {/* Kullanıcı bilgileri: Fotoğrafın üstünde, sol üstte, başlık ve fotoğraf arasında */}
          {postUser && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 24,
                marginLeft: 8,
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: postUser.avatar_url }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 8,
                }}
              />
              <View>
                <Text style={{ fontWeight: "bold", color: COLORS.text }}>
                  {postUser.full_name}
                </Text>
                <Text style={{ color: COLORS.primary }}>
                  @{postUser.username}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            activeOpacity={1}
          >
            <Image
              source={{ uri: post.image_url }}
              style={[styles.image, { marginTop: 1 }]}
            />
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>{post.title}</Text>
            {post.category && (
              <Text style={styles.category}>
                {CATEGORY_LABELS[post.category] || post.category}
              </Text>
            )}
            <Text style={styles.description}>{post.description}</Text>
            <Text style={styles.location}>{post.location}</Text>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  currentLikeStatus?.status === "like" && styles.activeLike,
                ]}
                onPress={handleLike}
                disabled={likeLoading}
              >
                <Ionicons
                  name={
                    currentLikeStatus?.status === "like"
                      ? "thumbs-up"
                      : "thumbs-up-outline"
                  }
                  size={24}
                  color={
                    currentLikeStatus?.status === "like"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.likeText,
                    currentLikeStatus?.status === "like" && {
                      color: COLORS.primary,
                    },
                  ]}
                >
                  {currentLikeStatus?.likes || 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  currentLikeStatus?.status === "dislike" &&
                    styles.activeDislike,
                ]}
                onPress={handleDislike}
                disabled={dislikeLoading}
              >
                <Ionicons
                  name={
                    currentLikeStatus?.status === "dislike"
                      ? "thumbs-down"
                      : "thumbs-down-outline"
                  }
                  size={24}
                  color={
                    currentLikeStatus?.status === "dislike"
                      ? COLORS.error
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.likeText,
                    currentLikeStatus?.status === "dislike" && {
                      color: COLORS.error,
                    },
                  ]}
                >
                  {currentLikeStatus?.dislikes || 0}
                </Text>
              </TouchableOpacity>
              <View style={styles.commentStat}>
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.likeText}>{comments.length}</Text>
              </View>
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Yorumlar</Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (openSwipeableRef.current) {
                    openSwipeableRef.current.close();
                    openSwipeableRef.current = null;
                  }
                  Keyboard.dismiss();
                }}
              >
                <View>
                  {comments
                    .filter((c) => !c.parent_id)
                    .map((comment) => renderComment(comment))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={
              replyingTo ? `Yanıt ver: ${replyingTo.content}` : "Yorum yaz..."
            }
            value={newComment}
            onChangeText={setNewComment}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleAddComment}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={newComment.trim() ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Fotoğraf Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalImageContainer}
            onPress={() => setImageModalVisible(false)}
            activeOpacity={1}
          >
            <Image
              source={{ uri: post.image_url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: "98%",
    height: 240,
    backgroundColor: COLORS.background,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.xs,
    textTransform: "capitalize",
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  activeLike: {
    backgroundColor: COLORS.primary + "22",
  },
  activeDislike: {
    backgroundColor: COLORS.error + "22",
  },
  likeText: {
    marginLeft: 6,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  commentStat: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  commentsSection: {
    marginTop: SPACING.md,
  },
  commentsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  comment: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    width: "96%",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 30,
    marginRight: 8,
  },
  commentUsername: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.primary,
  },
  commentFullName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "600",
  },
  commentContent: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: 4,
  },
  commentDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  replyButton: {
    color: COLORS.primary,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "100%",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  replyContainer: {
    marginLeft: 56,
    marginTop: 4,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  modalImageContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
});

export default PostDetailScreen;
