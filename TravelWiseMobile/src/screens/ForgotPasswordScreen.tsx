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

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Lütfen e-posta adresinizi girin");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Firebase şifre sıfırlama işlemleri burada yapılacak
      console.log("Şifre sıfırlama:", email);
      setSuccess(true);
    } catch (err) {
      setError("Şifre sıfırlama işlemi sırasında bir hata oluştu");
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
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? (
            <Text style={styles.successText}>
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi
            </Text>
          ) : null}

          <Button
            title="Şifremi Sıfırla"
            onPress={handleResetPassword}
            loading={loading}
            style={styles.resetButton}
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
  resetButton: {
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
  successText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});
