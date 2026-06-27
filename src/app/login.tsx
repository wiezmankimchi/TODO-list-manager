import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/hooks/use-theme";
import { KeyRound, Mail, Sparkles } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length === 0) {
      if (sanitizedEmail !== "demo@example.com" || password !== "password123") {
        newErrors.email = "Invalid email or password";
        newErrors.password = "Invalid email or password";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        signIn(email.trim().toLowerCase());
      }, 1000);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Brand */}
          <View style={styles.brandContainer}>
            <View
              style={[
                styles.logoOutline,
                { borderColor: theme.border, backgroundColor: theme.secondary },
              ]}
            >
              <Sparkles size={28} color={theme.text} />
            </View>
            <ThemedText type="subtitle" style={styles.brandText}>
              QRScanner
            </ThemedText>
            <ThemedText
              type="small"
              style={{
                color: theme.textSecondary,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              A premium grayscale mobile experience
            </ThemedText>
          </View>

          {/* Login Card */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Use mock account:{" "}
                <ThemedText type="code">demo@example.com</ThemedText> with
                password <ThemedText type="code">password123</ThemedText>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                label="Email"
                placeholder="demo@example.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={<Mail size={16} color={theme.textSecondary} />}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                leftIcon={<KeyRound size={16} color={theme.textSecondary} />}
              />
            </CardContent>
            <CardFooter style={styles.footer}>
              <Button
                label="Continue"
                loading={isLoading}
                onPress={handleLogin}
                style={styles.button}
              />
            </CardFooter>
          </Card>

          {/* Footer Info */}
          <View style={styles.footerNote}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              By continuing, you agree to our Terms and Privacy Policy.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoOutline: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandText: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -1,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  footer: {
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 48,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 24,
  },
});
