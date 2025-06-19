import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSavedContext } from "../contexts/SavedContext";
import PostCard from "../components/PostCard";
import { RootStackParamList } from "../navigation/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

export const SavedScreen: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "PostDetail">
    >();
  const { savedPosts = [], loading, refetch } = useSavedContext();

  console.log("SavedScreen savedPosts:", savedPosts);

  useEffect(() => {
    if (!loading && (!savedPosts || savedPosts.length === 0)) {
      refetch();
    }
  }, []);

  if (!loading && (!savedPosts || savedPosts.length === 0)) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[COLORS.primary]}
          />
        }
      >
        <Ionicons
          name="bookmark-outline"
          size={64}
          color={COLORS.primary}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 8,
            color: COLORS.text,
          }}
        >
          Kaydedilen Gönderi Yok
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: COLORS.textSecondary,
            textAlign: "center",
            maxWidth: 260,
          }}
        >
          Henüz kaydettiğiniz bir gönderi bulunmuyor.
        </Text>
      </ScrollView>
    );
  }

  const renderItem = ({ item }: any) => {
    return <PostCard postId={item.posts?.id} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedPosts}
        renderItem={renderItem}
        keyExtractor={(item: any) =>
          item.posts?.id?.toString() || Math.random().toString()
        }
        contentContainerStyle={{ padding: SPACING.lg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
});

export default SavedScreen;
