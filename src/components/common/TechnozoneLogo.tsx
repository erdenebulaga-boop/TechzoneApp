import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

interface TechnozoneLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
}

/**
 * Technozone brand logo component.
 * Styled text-based logo matching Technozone's navy + orange branding.
 * The logo uses "TECHNO" in navy and "ZONE" in the accent orange,
 * reflecting the brand's identity as Mongolia's leading electronics retailer.
 */
export const TechnozoneLogo: React.FC<TechnozoneLogoProps> = ({
  size = 'medium',
  variant = 'full',
}) => {
  const fontSize = size === 'small' ? 16 : size === 'medium' ? 20 : 28;
  const iconSize = size === 'small' ? 24 : size === 'medium' ? 32 : 44;
  const iconFontSize = size === 'small' ? 12 : size === 'medium' ? 15 : 22;

  if (variant === 'icon') {
    return (
      <View
        style={[styles.iconContainer, { width: iconSize, height: iconSize, borderRadius: iconSize * 0.25 }]}
        accessibilityLabel="Technozone"
        accessibilityRole="image"
      >
        <Text style={[styles.iconText, { fontSize: iconFontSize }]}>TZ</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessibilityLabel="Technozone"
      accessibilityRole="image"
    >
      <View
        style={[styles.logoMark, { width: iconSize, height: iconSize, borderRadius: iconSize * 0.25 }]}
      >
        <Text style={[styles.logoMarkText, { fontSize: iconFontSize }]}>TZ</Text>
      </View>
      <View style={styles.wordmark}>
        <Text style={[styles.techno, { fontSize }]}>TECHNO</Text>
        <Text style={[styles.zone, { fontSize }]}>ZONE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoMarkText: {
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  techno: {
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  zone: {
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  // Icon-only variant
  iconContainer: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
});
