import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Ekranlar
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case "Ana Sayfa":
            iconName = focused ? "home" : "home-outline";
            break;
          case "Keşfet":
            iconName = focused ? "compass" : "compass-outline";
            break;
          case "Gönderi Oluştur":
            iconName = focused ? "add-circle" : "add-circle-outline";
            break;
          case "Profil":
            iconName = focused ? "person" : "person-outline";
            break;
          default:
            iconName = "help-outline";
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#2563eb",
      tabBarInactiveTintColor: "#64748b",
      tabBarStyle: {
        backgroundColor: "#fff",
        borderTopColor: "#e2e8f0",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
    <Tab.Screen name="Keşfet" component={ExploreScreen} />
    <Tab.Screen name="Gönderi Oluştur" component={CreatePostScreen} />
    <Tab.Screen name="Profil" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {/* Diğer ekranlar buraya eklenecek */}
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
