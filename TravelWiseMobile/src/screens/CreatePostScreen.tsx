import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { createPost, uploadPostImage } from "../services/supabase";
import { supabase } from "../config/supabase";
import { SPACING } from "@/constants/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { KeyboardAwareScrollView as KeyboardAwareScrollViewType } from "react-native-keyboard-aware-scroll-view";

type CreatePostScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

const CATEGORIES = [
  { id: "food", name: "Yeme-İçme", icon: "restaurant-outline" },
  { id: "museums", name: "Müzeler", icon: "business-outline" },
  { id: "nature", name: "Doğa", icon: "leaf-outline" },
  { id: "other", name: "Diğer", icon: "ellipsis-horizontal-outline" },
];

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

export const CreatePostScreen = () => {
  const navigation = useNavigation<CreatePostScreenNavigationProp>();
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showDistricts, setShowDistricts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);

  const scrollViewRef = useRef<KeyboardAwareScrollViewType>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("Kullanıcı ID:", user.id);
      } else {
        console.log("Kullanıcı bulunamadı");
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (location.trim().length > 0) {
      const filtered = ISTANBUL_DISTRICTS.filter((district) =>
        district.toLowerCase().includes(location.trim().toLowerCase())
      ).slice(0, 3);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [location]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Hata", "Galeriye erişim izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim()) {
      Alert.alert("Hata", "Başlık gereklidir.");
      return;
    }

    if (!image || !imageBase64) {
      Alert.alert("Hata", "Lütfen bir fotoğraf seçin.");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");
      const image_url = await uploadPostImage(imageBase64, user.id);
      const postObj = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        image_url,
        user_id: user.id,
        category: selectedCategory || "",
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
      };
      await createPost(postObj);
      Alert.alert("Başarılı", "Gönderi başarıyla oluşturuldu.");
      navigation.goBack();
    } catch (error: any) {
      console.error("Gönderi oluşturulurken hata:", error);
      Alert.alert(
        "Hata",
        `Gönderi oluşturulurken bir hata oluştu: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="close"
              size={28}
              color={theme.primary}
              style={{ marginTop: 16 }}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.primary }]}>
            Yeni Gönderi Oluştur
          </Text>
          <TouchableOpacity
            style={[styles.imagePicker, { backgroundColor: theme.card }]}
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: theme.card },
                ]}
              >
                <Ionicons name="camera" size={32} color={theme.text} />
                <Text
                  style={[styles.imagePlaceholderText, { color: theme.text }]}
                >
                  Fotoğraf Seç
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Kategori
          </Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => {
              const selected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selected ? theme.primary : theme.card,
                      borderColor: selected ? theme.primary : theme.border,
                      shadowColor: theme.primary,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={selected ? theme.card : theme.text}
                  />
                  <Text
                    style={{
                      color: selected ? theme.card : theme.text,
                      marginLeft: 6,
                      fontWeight: selected ? "bold" : "normal",
                    }}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Başlık
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.card,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Başlık"
            placeholderTextColor={theme.text + "1"}
          />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Açıklama
          </Text>
          <TextInput
            ref={descriptionInputRef}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.card,
                height: 80,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Açıklama"
            placeholderTextColor={theme.text + "1"}
            multiline
            onFocus={() => {
              if (scrollViewRef.current && descriptionInputRef.current) {
                // @ts-ignore
                scrollViewRef.current.scrollToFocusedInput?.(
                  descriptionInputRef.current
                );
              }
            }}
          />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Lokasyon
          </Text>
          <View style={{ position: "relative" }}>
            {filteredDistricts.length > 0 && (
              <View
                style={[
                  styles.districtsContainer,
                  {
                    backgroundColor: theme.card,
                    position: "absolute",
                    bottom: 44,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    borderWidth: 2,
                    borderColor: theme.border,
                    borderRadius: 8,
                  },
                ]}
              >
                {filteredDistricts.map((district) => (
                  <TouchableOpacity
                    key={district}
                    style={styles.districtItem}
                    onPress={() => {
                      setLocation(String(district));
                      setFilteredDistricts([]);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.districtText, { color: theme.text }]}>
                      {district}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Lokasyon"
              placeholderTextColor={theme.text + "1"}
            />
          </View>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={handleCreatePost}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={theme.card} />
            ) : (
              <Text style={[styles.createButtonText, { color: theme.card }]}>
                Gönderiyi Oluştur
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  districtsContainer: {
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  districtItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  districtText: {
    color: "#000",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreatePostScreen;
