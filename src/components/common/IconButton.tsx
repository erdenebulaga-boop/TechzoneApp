import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { spacing, radius } from '../../styles/spacing';

interface IconButtonProps {
  name: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: string;
  onPress: (event: GestureResponderEvent) => void;
  badge?: number;
  accessibilityLabel: string;
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: radius.full,
    minWidth: 20,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
});

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 24,
  color = colors.onSurface,
  onPress,
  badge,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Feather name={name} size={size} color={color} />
      {badge !== undefined && badge > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
