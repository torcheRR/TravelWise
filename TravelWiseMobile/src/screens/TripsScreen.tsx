import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CATEGORY_BOX_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - 12) / 2; // 12px aralık

const CATEGORIES = [
  {
    key: "food",
    label: "Yeme-İçme",
    icon: "restaurant-outline",
    color: "#FF7043",
    description: "En iyi restoranlar ve kafeler",
  },
  {
    key: "museums",
    label: "Müzeler",
    icon: "business-outline",
    color: "#9C27B0",
    description: "Tarihi ve kültürel mekanlar",
  },
  {
    key: "parks",
    label: "Parklar",
    icon: "leaf-outline",
    color: "#43A047",
    description: "Doğal ve şehir parkları",
  },
  {
    key: "other",
    label: "Diğer",
    icon: "ellipsis-horizontal-outline",
    color: "#607D8B",
    description: "Diğer tüm kategoriler",
  },
];

const FEATURED = [
  {
    key: "1",
    title: "Kapadokya",
    location: "Nevşehir, Türkiye",
    color: "#FFF3E0",
  },
  {
    key: "2",
    title: "Pamukkale",
    location: "Denizli, Türkiye",
    color: "#E3F2FD",
  },
  {
    key: "3",
    title: "Ayasofya",
    location: "İstanbul, Türkiye",
    color: "#E8F5E9",
  },
];

export const TripsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState("");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.pageTitle}>Keşfet</Text>
      <Text style={styles.pageSubtitle}>Size en uygun seçenekleri bulun</Text>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.text.secondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Gönderi veya destinasyon ara..."
          placeholderTextColor={COLORS.text.secondary}
          value={search}
          onChangeText={setSearch}
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
                marginRight: idx % 2 === 0 ? 8 : 0,
                marginBottom: 8,
              },
            ]}
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
            <Text style={styles.categoryDesc}>{cat.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Öne Çıkan Destinasyonlar</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginLeft: SPACING.lg }}
      >
        {FEATURED.map((item) => (
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
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
    color: COLORS.text.primary,
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
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  categoryBox: {
    borderRadius: 18,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  categoryLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    textAlign: "center",
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
    color: COLORS.text.primary,
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
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  featuredLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
});
