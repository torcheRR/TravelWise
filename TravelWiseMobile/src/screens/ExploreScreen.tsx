import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

type Destination = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
};

const dummyDestinations: Destination[] = [
  {
    id: "1",
    name: "Paris, Fransa",
    description: "Işıklar şehri, romantik sokaklar ve muhteşem mimari",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    rating: 4.8,
    reviews: 1250,
  },
  {
    id: "2",
    name: "Tokyo, Japonya",
    description: "Modern teknoloji ve geleneksel kültürün mükemmel uyumu",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    rating: 4.9,
    reviews: 980,
  },
  {
    id: "3",
    name: "New York, ABD",
    description: "Dünyanın en dinamik şehirlerinden biri",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    rating: 4.7,
    reviews: 2100,
  },
];

const categories = [
  { id: "all", name: "Tümü" },
  { id: "popular", name: "Popüler" },
  { id: "trending", name: "Trend" },
  { id: "new", name: "Yeni" },
];

const ExploreScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredDestinations = dummyDestinations.filter((destination) => {
    const matchesSearch = destination.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      destination.name.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const renderDestinationCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => navigation.navigate("LocationDetail", { location: item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.destinationImage}
        defaultSource={{ uri: "https://via.placeholder.com/300x200" }}
      />
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationName}>{item.name}</Text>
        <Text style={styles.destinationDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews} değerlendirme)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Destinasyon ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.destinationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#1e293b",
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#2563eb",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  destinationsList: {
    padding: 16,
  },
  destinationCard: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: "100%",
    height: ITEM_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 16,
  },
});

export default ExploreScreen;
