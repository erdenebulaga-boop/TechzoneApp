import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, radius, shadow } from '../../styles/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },
  pressable: {
    borderRadius: radius.lg,
  },
});

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  accessibilityLabel,
}) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.pressable,
          {
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.card, style]}>{children}</View>
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};
