import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LIGHT_THEME = {
  mode: "light",
  background: "#F8F8F8",
  text: "#222",
  card: "#fff",
  primary: "#FF3B6A",
  secondary: "#1f1f1f",
  border: "#E5E5E5",
};

const DARK_THEME = {
  mode: "dark",
  background: "#181A20",
  text: "#fff",
  card: "#23262F",
  primary: "#FF3B6A",
  secondary: "#FFF",
  border: "#23262F",
};

const ThemeContext = createContext({
  theme: LIGHT_THEME,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(LIGHT_THEME);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored) {
        setIsDark(stored === "dark");
        setTheme(stored === "dark" ? DARK_THEME : LIGHT_THEME);
      } else {
        const sys = Appearance.getColorScheme();
        setIsDark(sys === "dark");
        setTheme(sys === "dark" ? DARK_THEME : LIGHT_THEME);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setTheme(newIsDark ? DARK_THEME : LIGHT_THEME);
    await AsyncStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
