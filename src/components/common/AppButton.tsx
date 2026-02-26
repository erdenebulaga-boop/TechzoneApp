import React from 'react';
import {
  Pressable,
  Text,
  View,
  ViewStyle,
  StyleSheet,
  AccessibilityRole,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Feather>['name'];
  size?: 'sm' | 'md' | 'lg';
  accessibilityLabel?: string;
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    minHeight: 44,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  secondary: {
    backgroundColor: colors.surface,
  },
  secondaryPressed: {
    backgroundColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostPressed: {
    backgroundColor: colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.onSurface,
  },
  textGhost: {
    color: colors.onSurface,
  },
  // Size-specific padding
  smPadding: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mdPadding: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  lgPadding: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  // Size-specific font styles
  smText: typography.labelMedium,
  mdText: typography.labelLarge,
  lgText: typography.titleMedium,
  iconSpacing: {
    marginRight: spacing.xs,
  },
});

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  size = 'md',
  accessibilityLabel,
}) => {
  const isPressed = React.useRef(false);

  const getPaddingStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.smPadding;
      case 'lg':
        return styles.lgPadding;
      case 'md':
      default:
        return styles.mdPadding;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smText;
      case 'lg':
        return styles.lgText;
      case 'md':
      default:
        return styles.mdText;
    }
  };

  const getBackgroundStyle = (pressed: boolean): ViewStyle => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return { ...styles.primary, ...styles.disabled };
        case 'secondary':
          return { ...styles.secondary, ...styles.disabled };
        case 'ghost':
          return { ...styles.ghost, ...styles.disabled };
        default:
          return styles.primary;
      }
    }

    switch (variant) {
      case 'primary':
        return pressed ? styles.primaryPressed : styles.primary;
      case 'secondary':
        return pressed ? styles.secondaryPressed : styles.secondary;
      case 'ghost':
        return pressed ? styles.ghostPressed : styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return styles.textPrimary.color as string;
      case 'secondary':
        return styles.textSecondary.color as string;
      case 'ghost':
        return styles.textGhost.color as string;
      default:
        return colors.white;
    }
  };

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.button,
        getPaddingStyle(),
        getBackgroundStyle(pressed),
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <Feather
            name={icon}
            size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
            color={getTextColor()}
            style={styles.iconSpacing}
          />
        )}
        <Text
          style={[
            getTextStyle(),
            {
              color: getTextColor(),
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
