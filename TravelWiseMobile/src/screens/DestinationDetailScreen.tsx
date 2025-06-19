import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { getPosts, Post } from "../services/supabase";
import PostCard from "../components/PostCard";
import { Ionicons } from "@expo/vector-icons";
import { MainStackParamList } from "../navigation/AppNavigator";

export const DestinationDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { destination } = route.params || {
    destination: { title: "Destinasyon", location: "" },
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationPosts = async () => {
      try {
        const allPosts = await getPosts();
        // Sadece bu lokasyona ait postları filtrele
        const locationPosts = allPosts.filter(
          (post) => post.location === destination.title
        );
        setPosts(locationPosts);
      } catch (error) {
        console.error("Lokasyon gönderileri çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationPosts();
  }, [destination.title]);

  const renderPost = ({ item }: { item: Post }) => <PostCard post={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{destination.title}</Text>
          <Text style={styles.location}>{destination.location}</Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : posts.length === 0 ? (
        <Text style={styles.emptyText}>
          Bu lokasyonda henüz gönderi bulunmuyor.
        </Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 12,
  },
  location: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,

  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});
