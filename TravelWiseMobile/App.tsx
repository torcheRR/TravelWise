import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { NotificationSettingsProvider } from "./src/contexts/NotificationsPrefContext";
import { PostsProvider } from "./src/contexts/PostsContext";
import { SavedProvider } from "./src/contexts/SavedContext";
import { LikeRefreshProvider } from "./src/contexts/LikeRefreshContext";
import { NotificationsProvider } from "./src/contexts/NotificationContext";
import { PostLikeProvider } from "./src/contexts/PostLikeContext";

export default function App() {
  function ProvidersWithNotificationAndSaved() {
    const { user } = useAuth();
    if (!user) return <AppNavigator />;
    return (
      <NotificationsProvider key={user.id} userId={user.id}>
        <SavedProvider userId={user.id}>
          <PostLikeProvider>
            <AppNavigator />
          </PostLikeProvider>
        </SavedProvider>
      </NotificationsProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ThemeProvider>
          <NotificationSettingsProvider>
            <PostsProvider>
              <LikeRefreshProvider>
                <AuthProvider>
                  <ProvidersWithNotificationAndSaved />
                </AuthProvider>
              </LikeRefreshProvider>
            </PostsProvider>
          </NotificationSettingsProvider>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
