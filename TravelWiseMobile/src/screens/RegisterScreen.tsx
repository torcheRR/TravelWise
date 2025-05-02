import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Firebase authentication işlemleri burada yapılacak
      console.log("Kayıt yapılıyor:", email);
    } catch (err) {
      setError("Kayıt olurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>TravelWise</Text>
          <Text style={styles.subtitle}>Yeni hesap oluştur</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.nameContainer}>
            <View style={styles.nameInput}>
              <Input
                label="Ad"
                placeholder="Adınız"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameInput}>
              <Input
                label="Soyad"
                placeholder="Soyadınız"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Input
            label="E-posta"
            placeholder="E-posta adresiniz"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Şifre"
            placeholder="Şifreniz"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <Button
            title="Giriş Yap"
            onPress={() => navigation.navigate("Login")}
            variant="outline"
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700" as const,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  formContainer: {
    marginTop: SPACING.xl,
  },
  nameContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  nameInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: SPACING.lg,
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});
 