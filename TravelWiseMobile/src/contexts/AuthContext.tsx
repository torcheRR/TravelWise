import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Uygulama başladığında kullanıcı durumunu kontrol et
    const checkUser = async () => {
      try {
        // Sahte kullanıcı kontrolü
        const fakeUser = {
          uid: "1",
          email: "test@example.com",
          displayName: "Test User",
        } as User;
        setUser(fakeUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Sahte giriş işlemi
      if (email === "test@example.com" && password === "123456") {
        const fakeUser = {
          uid: "1",
          email: "test@example.com",
          displayName: "Test User",
        } as User;
        setUser(fakeUser);
        navigation.navigate("Main");
      } else {
        throw new Error("Geçersiz e-posta veya şifre");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      navigation.navigate("Auth");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
