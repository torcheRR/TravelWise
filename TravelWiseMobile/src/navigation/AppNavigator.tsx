import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { HomeScreen } from "../screens/HomeScreen";
import { TripsScreen } from "../screens/TripsScreen";
import { SavedScreen } from "../screens/SavedScreen";
import { AIChatScreen } from "../screens/AIChatScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { AuthNavigator } from "./AuthNavigator";
import { DestinationDetailScreen } from "../screens/DestinationDetailScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  DestinationDetail: { destination: { title: string; location: string } };
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Saved: undefined;
  AIChat: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
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
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0.5,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 6,
        },
        headerShown: true,
        headerTitle: "TravelWise",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          color: COLORS.primary,
          fontWeight: "700",
          fontSize: 22,
        },
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

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen
        name="DestinationDetail"
        component={DestinationDetailScreen}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
