import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: (event: GestureResponderEvent) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    ...typography.headlineMedium,
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
    ...typography.labelLarge,
  },
  actionDefault: {
    color: colors.loanPrimary,
  },
  actionAccent: {
    color: colors.accent,
  },
});

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
}) => {
  const isAccent = actionText?.toLowerCase().includes('view') ? false : true;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionText}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              styles.action,
              isAccent ? styles.actionAccent : styles.actionDefault,
            ]}
          >
            {actionText}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
