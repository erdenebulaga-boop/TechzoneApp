import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius, shadow } from '../../styles/spacing';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const technozoneLogo = require('../../assets/images/technozone-logo.png');
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { setOnboarded, login } = useAuthStore();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleRegister = () => {
    navigation.navigate('SignIn');
  };

  const handleBrowseAsGuest = () => {
    setOnboarded();
    login();
  };

  return (
    <View style={styles.container}>
      {/* Top Section — Navy background with logo and welcome message */}
      <View style={[styles.topSection, { paddingTop: insets.top + 40 }]}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={technozoneLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Technozone"
            tintColor="#FFFFFF"
          />
        </View>

        {/* Welcome text */}
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Technozone</Text>
          <Text style={styles.welcomeSubtitle}>
            Mongolia's leading electronics store — shop the latest tech, earn
            rewards, and access instant loans.
          </Text>
        </View>

        {/* Feature badges */}
        <View style={styles.featureBadges}>
          <View style={styles.badge}>
            <Feather name="shopping-bag" size={16} color={colors.accent} />
            <Text style={styles.badgeText}>Shop</Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Feather name="award" size={16} color={colors.loyaltyPrimary} />
            <Text style={styles.badgeText}>Earn Points</Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Feather name="credit-card" size={16} color={colors.loanPrimary} />
            <Text style={styles.badgeText}>Get Loans</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section — White card with action buttons */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.cardContainer}>
          {/* Sign In button (primary) */}
          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleSignIn}
            accessibilityLabel="Sign in to your account"
            accessibilityRole="button"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
            <Feather name="arrow-right" size={20} color={colors.onPrimary} />
          </Pressable>

          {/* Register + Guest row */}
          <View style={styles.secondaryRow}>
            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleRegister}
              accessibilityLabel="Register a new account"
              accessibilityRole="button"
            >
              <Feather name="user-plus" size={18} color={colors.primary} />
              <Text style={styles.registerButtonText}>Register Free</Text>
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={({ pressed }) => [
                styles.guestButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleBrowseAsGuest}
              accessibilityLabel="Browse as guest without an account"
              accessibilityRole="button"
            >
              <Feather name="eye" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.guestButtonText}>Browse as Guest</Text>
            </Pressable>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  // ── Top Section ──
  topSection: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Decorative circles
  decorCircle1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 40,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  decorCircle3: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    width: screenWidth * 0.55,
    height: (screenWidth * 0.55) * (857 / 4096),
  },

  // Welcome text
  welcomeTextContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    ...typography.displayLarge,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  welcomeSubtitle: {
    ...typography.bodyLarge,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Feature badges
  featureBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    ...typography.labelMedium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  badgeDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // ── Bottom Section ──
  bottomSection: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    paddingTop: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  cardContainer: {
    gap: spacing.base,
  },

  // Sign In (primary button)
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  signInButtonText: {
    ...typography.titleMedium,
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // Register + Guest row
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  registerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primary50,
  },
  registerButtonText: {
    ...typography.titleMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  rowDivider: {
    width: 0,
  },
  guestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  guestButtonText: {
    ...typography.titleMedium,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },

  // Terms
  termsText: {
    ...typography.bodySmall,
    color: colors.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
