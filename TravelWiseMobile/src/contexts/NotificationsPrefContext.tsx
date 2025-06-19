import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationSettingsContext = createContext({
  notificationsEnabled: true,
  toggleNotifications: () => {},
});

export const useNotificationSettings = () =>
  useContext(NotificationSettingsContext);

export const NotificationSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("notificationsEnabled");
      if (stored !== null) {
        setNotificationsEnabled(stored === "true");
      }
    })();
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem(
      "notificationsEnabled",
      newValue ? "true" : "false"
    );
  };

  return (
    <NotificationSettingsContext.Provider
      value={{ notificationsEnabled, toggleNotifications }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};
