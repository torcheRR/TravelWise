import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

export const AIChatScreen: React.FC = () => {
  // Şimdilik boş durum
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Seyahat Asistanı</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          Henüz mesaj yok. Seyahat planınız hakkında sorular sorabilirsiniz!
        </Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={COLORS.text.secondary}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  emptyBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.lg,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});
