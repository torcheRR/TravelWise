import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/AppNavigator";
import { getPosts, Post } from "../services/supabase";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 12;
const NUM_COLUMNS = 4;
const CATEGORY_BOX_SIZE =
  (SCREEN_WIDTH - GAP * (NUM_COLUMNS + 3)) / NUM_COLUMNS;

const CATEGORIES = [
  {
    key: "food",
    label: "Yeme-İçme",
    icon: "restaurant-outline",
    color: "#FF7043",
  },
  {
    key: "museums",
    label: "Müze",
    icon: "business-outline",
    color: "#9C27B0",
  },
  {
    key: "nature",
    label: "Doğa",
    icon: "leaf-outline",
    color: "#43A047",
  },
  {
    key: "other",
    label: "Diğer",
    icon: "ellipsis-horizontal-outline",
    color: "#607D8B",
  },
];

export const TripsScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const searchInputRef = useRef<TextInput>(null);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);

        // En çok post girilen 4 lokasyonu bul
        const locationCounts: { [key: string]: number } = {};
        allPosts.forEach((post) => {
          if (post.location) {
            locationCounts[post.location] =
              (locationCounts[post.location] || 0) + 1;
          }
        });

        // Lokasyonları post sayısına göre sırala ve ilk 4'ünü al
        const sortedLocations = Object.entries(locationCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([location, count], index) => ({
            key: index.toString(),
            title: location,
            location: location,
            postCount: count,
            color:
              ["#FFF3E0", "#E3F2FD", "#E8F5E9", "#F3E5F5"][index] || "#FFF3E0",
          }));

        setFeaturedLocations(sortedLocations);
      } catch (error) {
        console.error("Gönderiler çekilirken hata:", error);
      }
    };
    fetchPosts();
  }, []);

  // Arama metnine göre filtrele
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()) ||
          post.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [search, posts]);

  const handleCategoryPress = (category: (typeof CATEGORIES)[0]) => {
    navigation.navigate("Category", { category: category });
  };

  const renderHeader = () => (
    <>
      <Text style={styles.pageTitle}>Keşfet</Text>
      <Text style={styles.pageSubtitle}>Size en uygun seçenekleri bulun</Text>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textSecondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Gönderi veya destinasyon ara..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          blurOnSubmit={false}
          ref={searchInputRef}
          onFocus={() => {}}
          onBlur={() => {}}
          editable={true}
          selectTextOnFocus={false}
        />
      </View>

      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((cat, idx) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryBox,
              {
                backgroundColor: cat.color + "22",
                width: CATEGORY_BOX_SIZE,
                height: CATEGORY_BOX_SIZE,
                marginRight: (idx + 1) % NUM_COLUMNS === 0 ? 0 : GAP,
                marginBottom: GAP,
              },
            ]}
            onPress={() => handleCategoryPress(cat)}
          >
            <Ionicons
              name={cat.icon as any}
              size={32}
              color={cat.color}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.categoryLabel, { color: cat.color }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Öne Çıkan Destinasyonlar</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginLeft: SPACING.lg }}
      >
        {featuredLocations.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.featuredCard, { backgroundColor: item.color }]}
            onPress={() =>
              navigation.navigate("DestinationDetail", {
                destination: { title: item.title, location: item.location },
              })
            }
          >
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredLocation}>{item.location}</Text>
            <Text style={styles.featuredPostCount}>
              {item.postCount} gönderi
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {renderHeader()}
            {filteredPosts.map((item: Post) => (
              <TouchableOpacity
                key={item.id}
                style={styles.postCard}
                onPress={() =>
                  navigation.navigate("PostDetail", { postId: item.id })
                }
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.postImage}
                />
                <View
                  style={[
                    styles.postContent,
                    {
                      paddingTop: 0,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    },
                  ]}
                >
                  <Text
                    style={[styles.postTitle, { marginTop: 0 }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.postDescription, { marginTop: 0 }]}
                    numberOfLines={4}
                  >
                    {item.description}
                  </Text>
                  <View style={[styles.postStatsRow, { marginTop: 8 }]}>
                    <View style={styles.statWithIcon}>
                      <Ionicons
                        name="thumbs-up-outline"
                        size={16}
                        color={COLORS.primary}
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.postStat}>
                        {item.likes_count || 0}
                      </Text>
                    </View>
                    <View style={styles.statWithIcon}>
                      <Ionicons
                        name="thumbs-down-outline"
                        size={16}
                        color={COLORS.primary}
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.postStat}>
                        {item.dislikes_count || 0}
                      </Text>
                    </View>
                    <View style={styles.statWithIcon}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={16}
                        color={COLORS.primary}
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.postStat}>
                        {item.comments_count || 0}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postDate}>
                    {new Date(item.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginTop: 0,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  searchBar: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    paddingVertical: 4,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 0,
    marginBottom: 0,
  },
  categoryBox: {
    width: CATEGORY_BOX_SIZE,
    height: CATEGORY_BOX_SIZE,
    borderRadius: 18,
    padding: SPACING.md,
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  categoryLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: 0,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    paddingRight: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "500",
  },
  featuredCard: {
    width: 180,
    borderRadius: 16,
    padding: SPACING.md,
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  featuredTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  featuredLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  featuredPostCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  postCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginBottom: GAP,
  },
  postImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: SPACING.md,
  },
  postContent: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  postTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  postDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  postStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  postStat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  postDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});

export default TripsScreen;
