import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import HomeScreen from "../screens/HomeScreen";
import TripsScreen from "../screens/TripsScreen";
import SavedScreen from "../screens/SavedScreen";
import AIChatScreen from "../screens/AIChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { AuthNavigator } from "./AuthNavigator";
import { DestinationDetailScreen } from "../screens/DestinationDetailScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { CreatePostScreen } from "../screens/CreatePostScreen";
import { PostDetailScreen } from "../screens/PostDetailScreen";
import { useAuth } from "../contexts/AuthContext";
import { CategoryScreen } from "../screens/CategoryScreen";
import { useNavigation } from "@react-navigation/native";
import SettingsScreen from "../screens/SettingsScreen";
import { useTheme } from "../contexts/ThemeContext";

export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Profile: { userId: string };
  PostDetail: {
    postId: string;
    commentId?: string;
  };
  CreatePost: undefined;
  Settings: undefined;
  Notifications: undefined;
  DestinationDetail: { destination: { title: string; location: string } };
  Category: {
    category: { key: string; label: string; icon: string; color: string };
  };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Saved: undefined;
  AIChat: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Explore") {
            return (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Saved") {
            return (
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "AIChat") {
            return (
              <MaterialCommunityIcons
                name={focused ? "robot" : "robot-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Profile") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0.5,
          borderTopColor: theme.border,
          height: 75,
          paddingBottom: 24,
        },
        headerShown: true,
        headerTitle: "TravelWise",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.primary,
          fontWeight: "700",
          fontSize: 22,
        },
        headerLeft: () => null,
        gestureEnabled: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Anasayfa", tabBarLabel: "Anasayfa" }}
      />
      <Tab.Screen
        name="Explore"
        component={TripsScreen}
        options={{ title: "Keşfet" }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{ title: "Kaydedilenler" }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: "AI Chat" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
};

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen
        name="DestinationDetail"
        component={DestinationDetailScreen}
      />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="CreatePost" component={CreatePostScreen} />
      <MainStack.Screen name="PostDetail" component={PostDetailScreen} />
      <MainStack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
    </MainStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      // Ana stack'e geç
      navigation.reset({
        index: 0,
        routes: [{ name: "MainStack" }],
      });
    }
  }, [user]);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <RootStack.Screen name="AuthStack" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="MainStack" component={MainStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};
