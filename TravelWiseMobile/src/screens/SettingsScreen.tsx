import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

type SettingsItemProps = {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

const SettingsItem = ({
  icon,
  title,
  value,
  onPress,
  hasSwitch,
  switchValue,
  onSwitchChange,
}: SettingsItemProps) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={hasSwitch}
  >
    <View style={styles.settingsItemLeft}>
      <Ionicons name={icon as any} size={24} color="#64748b" />
      <Text style={styles.settingsItemTitle}>{title}</Text>
    </View>
    <View style={styles.settingsItemRight}>
      {value && <Text style={styles.settingsItemValue}>{value}</Text>}
      {hasSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e2e8f0", true: "#93c5fd" }}
          thumbColor={switchValue ? "#2563eb" : "#fff"}
        />
      )}
      {!hasSwitch && !value && (
        <Ionicons name="chevron-forward" size={24} color="#64748b" />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }: any) => {
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => {
            // Çıkış işlemleri burada yapılacak
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView>
        <SettingsSection title="Hesap">
          <SettingsItem
            icon="person-outline"
            title="Kişisel Bilgiler"
            onPress={() => navigation.navigate("PersonalInfo")}
          />
          <SettingsItem
            icon="lock-closed-outline"
            title="Güvenlik"
            onPress={() => navigation.navigate("Security")}
          />
          <SettingsItem
            icon="notifications-outline"
            title="Bildirimler"
            onPress={() => navigation.navigate("Notifications")}
          />
          <SettingsItem
            icon="eye-outline"
            title="Gizlilik"
            onPress={() => navigation.navigate("Privacy")}
          />
        </SettingsSection>

        <SettingsSection title="Tercihler">
          <SettingsItem
            icon="moon-outline"
            title="Karanlık Mod"
            hasSwitch
            switchValue={false}
            onSwitchChange={(value) => console.log("Dark mode:", value)}
          />
          <SettingsItem
            icon="language-outline"
            title="Dil"
            value="Türkçe"
            onPress={() => navigation.navigate("Language")}
          />
          <SettingsItem
            icon="location-outline"
            title="Konum Servisleri"
            hasSwitch
            switchValue={true}
            onSwitchChange={(value) => console.log("Location services:", value)}
          />
        </SettingsSection>

        <SettingsSection title="Destek">
          <SettingsItem
            icon="help-circle-outline"
            title="Yardım Merkezi"
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <SettingsItem
            icon="information-circle-outline"
            title="Hakkında"
            onPress={() => navigation.navigate("About")}
          />
          <SettingsItem
            icon="mail-outline"
            title="Bize Ulaşın"
            onPress={() => navigation.navigate("Contact")}
          />
        </SettingsSection>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemTitle: {
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
  },
  settingsItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemValue: {
    fontSize: 16,
    color: "#64748b",
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 8,
  },
});

export default SettingsScreen;
