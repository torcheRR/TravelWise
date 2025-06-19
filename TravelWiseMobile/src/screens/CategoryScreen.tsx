import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/AppNavigator";
import { getPosts } from "../services/supabase";
import PostCard from "../components/PostCard";

const ISTANBUL_DISTRICTS = [
  "Adalar",
  "Ataşehir",
  "Avcılar",
  "Bağcılar",
  "Bahçelievler",
  "Bakırköy",
  "Başakşehir",
  "Bayrampaşa",
  "Beşiktaş",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Büyükçekmece",
  "Çekmeköy",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kağıthane",
  "Kartal",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Şile",
  "Şişli",
  "Sultanbeyli",
  "Sultangazi",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
  "Zeytinburnu",
];

export const CategoryScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute();
  const { category } = route.params as {
    category: { key: string; label: string; icon: string; color: string };
  };
  const [showDistricts, setShowDistricts] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("İstanbul");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Gönderiler çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Kategori ve lokasyona göre filtrele
  const filteredPosts = posts.filter(
    (post) =>
      (selectedLocation === "İstanbul" || post.location === selectedLocation) &&
      post.category === category.key
  );

  const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.categoryInfo}>
          <Ionicons
            name={category.icon as any}
            size={32}
            color={category.color}
            style={styles.categoryIcon}
          />
          <Text style={[styles.categoryTitle, { color: category.color }]}>
            {" "}
            {category.label}{" "}
          </Text>
        </View>
      </View>
      <View style={styles.filterSection}>
        <TouchableOpacity
          onPress={() => setShowDistricts(!showDistricts)}
          style={styles.filterButton}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>{selectedLocation}</Text>
          <Ionicons
            name={showDistricts ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        {showDistricts && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={ISTANBUL_DISTRICTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedLocation(item);
                    setShowDistricts(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 32 }}>
          Yükleniyor...
        </Text>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              Bu kategoride gönderi yok.
            </Text>
          }
        />
      )}
    </View>
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
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: SPACING.xl,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    marginRight: SPACING.sm,
  },
  categoryTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
  },
  listContent: {
    padding: SPACING.md,
  },
  filterSection: {
    padding: SPACING.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  dropdownContainer: {
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  dropdownItem: {
    padding: SPACING.md,
  },
  dropdownItemText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
  },
});

export default CategoryScreen;
