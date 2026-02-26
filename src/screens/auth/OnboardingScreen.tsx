import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius, shadow } from '../../styles/spacing';

const technozoneLogo = require('../../assets/images/technozone-logo.png');

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  features: { icon: keyof typeof Feather.glyphMap; text: string }[];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: 'shopping-bag',
    iconColor: colors.primary,
    iconBgColor: colors.primary50,
    title: 'Shop the Latest Tech',
    subtitle:
      'Browse Mongolia\'s top electronics from Samsung, Apple, Huawei and more — delivered fast to your door or ready for pickup at 15 stores nationwide.',
    features: [
      { icon: 'truck', text: 'Fast delivery & Click & Collect' },
      { icon: 'shield', text: 'Official distributor guarantee' },
      { icon: 'tag', text: 'Flash deals & exclusive prices' },
    ],
  },
  {
    id: 2,
    icon: 'dollar-sign',
    iconColor: colors.loanPrimary,
    iconBgColor: colors.loanSecondary,
    title: 'Buy Now, Pay Smart',
    subtitle:
      'Get instant micro-loans from ₮100K to ₮2M with flexible 3–24 month terms. Apply in minutes, get approved fast, and start shopping right away.',
    features: [
      { icon: 'zap', text: 'Instant approval in minutes' },
      { icon: 'sliders', text: 'Flexible 3–24 month terms' },
      { icon: 'percent', text: 'Competitive 1.5% monthly rate' },
    ],
  },
  {
    id: 3,
    icon: 'award',
    iconColor: '#D4880F',
    iconBgColor: colors.loyaltySecondary,
    title: 'Earn Rewards & Level Up',
    subtitle:
      'Join Technozone Point — earn points on every purchase, unlock Bronze to Platinum tiers, spin the wheel, complete challenges, and redeem exclusive rewards.',
    features: [
      { icon: 'star', text: 'Earn 1 point per ₮100 spent' },
      { icon: 'trending-up', text: 'Up to 3x multiplier at Platinum' },
      { icon: 'gift', text: 'Redeem for discounts & rewards' },
    ],
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const isLastSlide = currentPage === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentPage(pageIndex);
  };

  const handleNext = () => {
    if (isLastSlide) {
      navigation.replace('Welcome');
    } else {
      scrollViewRef.current?.scrollTo({
        x: (currentPage + 1) * screenWidth,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    navigation.replace('Welcome');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar: Logo + Skip */}
      <View style={styles.topBar}>
        <Image
          source={technozoneLogo}
          style={styles.topLogo}
          resizeMode="contain"
          accessibilityLabel="Technozone"
        />
        <Pressable
          onPress={handleSkip}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && { opacity: 0.6 },
          ]}
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slideContainer}>
            <View style={styles.slide}>
              {/* Icon circle */}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: slide.iconBgColor },
                ]}
              >
                <Feather
                  name={slide.icon}
                  size={48}
                  color={slide.iconColor}
                />
              </View>

              {/* Title */}
              <Text style={styles.slideTitle}>{slide.title}</Text>

              {/* Subtitle */}
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>

              {/* Feature list */}
              <View style={styles.featuresContainer}>
                {slide.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <View
                      style={[
                        styles.featureIconCircle,
                        { backgroundColor: slide.iconBgColor },
                      ]}
                    >
                      <Feather
                        name={feature.icon}
                        size={16}
                        color={slide.iconColor}
                      />
                    </View>
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer: dots + button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Continue / Get Started button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          accessibilityLabel={isLastSlide ? 'Get Started' : 'Continue'}
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>
            {isLastSlide ? 'Get Started' : 'Continue'}
          </Text>
          {!isLastSlide && (
            <Feather
              name="arrow-right"
              size={20}
              color={colors.onPrimary}
            />
          )}
        </Pressable>

        {/* Terms */}
        <Text style={styles.termsText}>
          Terms of Use · Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topLogo: {
    width: 120,
    height: 26,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
  },
  skipText: {
    ...typography.titleMedium,
    color: colors.onSurfaceVariant,
  },

  // Slide
  slideContainer: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  slide: {
    backgroundColor: colors.white,
    borderRadius: radius['3xl'],
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    width: '100%',
    ...shadow.lg,
  },

  // Icon
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // Text
  slideTitle: {
    ...typography.displayMedium,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    ...typography.bodyLarge,
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },

  // Features
  featuresContainer: {
    width: '100%',
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    flex: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.onSurfaceMuted,
  },

  // Button
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  continueButtonText: {
    ...typography.titleMedium,
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // Terms
  termsText: {
    ...typography.bodySmall,
    color: colors.onSurfaceMuted,
    textAlign: 'center',
  },
});
