import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { mockNotifications } from '../../data/mockData';
import type { AppNotification } from '../../data/mockData';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius } from '../../styles/spacing';

type NotificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

// Map notification types to icon background colors
const typeColors: Record<string, { bg: string; icon: string }> = {
  order: { bg: colors.primary50, icon: colors.primary },
  loyalty: { bg: colors.loyaltySecondary, icon: '#D4880F' },
  loan: { bg: colors.loanSecondary, icon: colors.loanPrimary },
  promo: { bg: colors.accent50, icon: colors.accent },
};

interface NotificationItemProps {
  item: AppNotification;
  onPress: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress }) => {
  const colorSet = typeColors[item.type] || typeColors.order;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notificationItem,
        !item.read && styles.notificationItemUnread,
        pressed && { backgroundColor: colors.surface },
      ]}
      onPress={() => onPress(item.id)}
    >
      {/* Icon with colored circle */}
      <View style={styles.iconRow}>
        <View style={[styles.iconCircle, { backgroundColor: colorSet.bg }]}>
          <Feather name={item.icon as any} size={20} color={colorSet.icon} />
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </Pressable>
  );
};

export const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNotificationPress = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleClearAll = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Unread info bar */}
      {unreadCount > 0 && (
        <View style={styles.unreadInfo}>
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          <Pressable
            onPress={handleClearAll}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.clearLink}>Mark all as read</Text>
          </Pressable>
        </View>
      )}

      {/* Notification list */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Feather name="bell" size={40} color={colors.onSurfaceVariant} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyDescription}>
              We'll notify you about orders, rewards, and special offers
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    width: 32,
    alignItems: 'center',
  },
  badgeCount: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeCountText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Unread info bar
  unreadInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadText: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
  },
  clearLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },

  // List
  listContent: {
    paddingVertical: spacing.sm,
    paddingBottom: 100,
  },

  // Notification item
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    gap: spacing.md,
  },
  notificationItemUnread: {
    backgroundColor: '#F8FAFC',
  },

  // Icon
  iconRow: {
    position: 'relative',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.background,
  },

  // Content
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
    flex: 1,
  },
  titleUnread: {
    fontWeight: '700',
  },
  body: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
    lineHeight: 18,
  },
  time: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
    flexShrink: 0,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing['5xl'],
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
