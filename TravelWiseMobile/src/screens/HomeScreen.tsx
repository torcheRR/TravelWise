import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import EmptyState from "../components/EmptyState";
import { usePostsContext } from "../contexts/PostsContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PostCard from "../components/PostCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { posts, loading, error, refreshPosts } = usePostsContext();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications" as never)}
          style={{ marginRight: SPACING.lg }}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
      headerTitle: "TravelWise",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshPosts();
    });
    return unsubscribe;
  }, [navigation, refreshPosts]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  }, [refreshPosts]);

  const renderItem = ({ item }: { item: any }) => <PostCard post={item} />;

  let content = null;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorMessage message={error.message || String(error)} />;
  } else if (!posts || posts.length === 0) {
    content = (
      <EmptyState
        icon="newspaper-outline"
        title="Gönderi Bulunamadı"
        message="Henüz hiç gönderi paylaşılmamış."
      />
    );
  } else {
    content = (
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {content}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost" as never)}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  listContent: {
    padding: SPACING.lg,
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
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    padding: SPACING.sm,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: SPACING.xs,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  statText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginLeft: 2,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.xl,
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
    zIndex: 10,
  },
});

export default HomeScreen;
