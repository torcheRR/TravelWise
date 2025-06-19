import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationSettings } from "../contexts/NotificationsPrefContext";
import { useTheme } from "../contexts/ThemeContext";
import { COLORS, FONT_SIZE } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "../services/profileService";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { notificationsEnabled, toggleNotifications } =
    useNotificationSettings();
  const { isDark, toggleTheme, theme } = useTheme();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const data = await getUserProfile(user.id);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Çıkış yapmak istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8, padding: 4 }}
        >
          <Ionicons name="arrow-back" size={28} color={theme.primary} />
        </TouchableOpacity>
        <Text
          style={[
            styles.sectionTitle,
            { marginBottom: 24, color: theme.primary },
          ]}
        >
          Ayarlar
        </Text>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Hesap</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>E-posta</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Kullanıcı Adı</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          @{profile?.username || "-"}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() =>
          Alert.alert("Şifre Değiştir", "Bu özellik yakında eklenecek!")
        }
      >
        <Text style={styles.buttonText}>Şifre Değiştir</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>
        Uygulama
      </Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Bildirimler</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Karanlık Mod</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          styles.logoutButton,
          { backgroundColor: "#FF3B30" },
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: { fontSize: FONT_SIZE.md },
  value: { fontSize: FONT_SIZE.md },
  button: {
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: FONT_SIZE.md,
  },
  logoutButton: { backgroundColor: "#FF3B30" },
});

export default SettingsScreen;
