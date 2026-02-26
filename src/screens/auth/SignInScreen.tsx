import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius } from '../../styles/spacing';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const technozoneLogo = require('../../assets/images/technozone-logo.png');
const { width: screenWidth } = Dimensions.get('window');

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { login, setOnboarded } = useAuthStore();
  const [phone, setPhone] = useState('+976 ');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePhoneChange = (text: string) => {
    if (!text.startsWith('+976')) {
      setPhone('+976 ');
      return;
    }
    setPhone(text);
  };

  const handleSignIn = async () => {
    if (!phone.trim() || !password.trim()) {
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOnboarded();
      login();
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = phone.length > 5;
  const isFormValid = isPhoneValid && password.length >= 6;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Logo */}
        <View style={styles.header}>
          <Image
            source={technozoneLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Technozone"
          />
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, phone.length > 5 && styles.inputContainerFocused]}>
              <Feather name="phone" size={18} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                placeholder="+976 9999-9999"
                placeholderTextColor={colors.onSurfaceMuted}
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                editable={!loading}
                accessibilityLabel="Phone number"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, password.length > 0 && styles.inputContainerFocused]}>
              <Feather name="lock" size={18} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={colors.onSurfaceMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                editable={!loading}
                accessibilityLabel="Password"
              />
              <Pressable
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.visibilityToggle}
                accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Feather
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </Pressable>
            </View>
          </View>

          {/* Sign In button */}
          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              !isFormValid && styles.signInButtonDisabled,
              pressed && isFormValid && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleSignIn}
            disabled={!isFormValid || loading}
            accessibilityLabel={loading ? 'Signing in' : 'Sign in'}
            accessibilityRole="button"
          >
            {loading ? (
              <Text style={styles.signInButtonText}>Signing in...</Text>
            ) : (
              <>
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Feather name="arrow-right" size={20} color={colors.onPrimary} />
              </>
            )}
          </Pressable>

          {/* Forgot Password */}
          <Pressable
            style={({ pressed }) => [
              styles.forgotButton,
              pressed && { opacity: 0.6 },
            ]}
            accessibilityLabel="Forgot password"
            accessibilityRole="button"
          >
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footerText}>
          <Text style={styles.footerInfo}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },

  // Header / Logo
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    marginTop: spacing.xl,
  },
  logo: {
    width: screenWidth * 0.52,
    height: (screenWidth * 0.52) * (857 / 4096),
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.onSurfaceSecondary,
  },

  // Form
  form: {
    marginVertical: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelLarge,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    ...typography.bodyLarge,
    color: colors.onSurface,
  },
  visibilityToggle: {
    padding: spacing.xs,
  },

  // Sign In
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  signInButtonDisabled: {
    opacity: 0.4,
  },
  signInButtonText: {
    ...typography.titleMedium,
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // Forgot Password
  forgotButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  forgotButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '500',
  },

  // Back button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.bodyLarge,
    color: colors.onSurface,
  },

  // Footer
  footerText: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerInfo: {
    ...typography.bodySmall,
    color: colors.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
