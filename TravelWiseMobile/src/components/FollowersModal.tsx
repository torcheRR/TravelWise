import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { supabase } from "../config/supabase";
import { DEFAULT_PROFILE_IMAGE } from "../services/profileService";
import { COLORS, FONT_SIZE, SPACING } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

interface FollowersModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  visible,
  onClose,
  userId,
  type,
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  const fetchUsers = async () => {
    setLoading(true);
    let query;
    if (type === "followers") {
      query = supabase
        .from("followers")
        .select(
          "follower_id, users:users!followers_follower_id_fkey(full_name, username, profile_image_url)"
        )
        .eq("user_id", userId);
    } else {
      query = supabase
        .from("followers")
        .select(
          "user_id, users:users!followers_user_id_fkey(full_name, username, profile_image_url)"
        )
        .eq("follower_id", userId);
    }
    const { data, error } = await query;
    if (!error) {
      setUsers((data || []).map((item: any) => item.users));
    } else {
      setUsers([]);
    }
    setLoading(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.card, shadowColor: theme.primary },
          ]}
        >
          <Text style={[styles.title, { color: theme.primary }]}>
            {type === "followers" ? "Takipçiler" : "Takip Edilenler"}
          </Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <View
                style={[styles.userRow, { borderBottomColor: theme.border }]}
              >
                <Image
                  source={{
                    uri: item.profile_image_url || DEFAULT_PROFILE_IMAGE,
                  }}
                  style={[styles.avatar, { backgroundColor: theme.background }]}
                />
                <View>
                  <Text style={[styles.name, { color: theme.text }]}>
                    {item.full_name}
                  </Text>
                  <Text style={[styles.username, { color: theme.text }]}>
                    @{item.username}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.text }]}>
                {loading ? "Yükleniyor..." : "Liste boş"}
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 18,
    textAlign: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
    backgroundColor: COLORS.background,
  },
  name: {
    fontWeight: "bold",
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  username: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  closeButton: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: FONT_SIZE.md,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
});

export default FollowersModal;
