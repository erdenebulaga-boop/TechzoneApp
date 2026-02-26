import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles/colors';
import { mockTransactions } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';

type LoyaltyHomeScreenProps = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: LoyaltyHomeScreenProps;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  screen: keyof RootStackParamList;
}

export const LoyaltyHomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [checkInToday, setCheckInToday] = useState(false);
  const [streak, setStreak] = useState(7);

  const pointsBalance = 12450;
  const cashValue = 124500;
  const expiringPoints = 2000;
  const tierProgress = 42450;
  const tierTarget = 50000;
  const pointsToNextTier = tierTarget - tierProgress;

  const handleCheckIn = () => {
    setCheckInToday(true);
    setStreak(streak + 1);
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = 2;

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Daily Spin', icon: 'gift', screen: 'SpinWheel' },
    { id: '2', title: 'Challenges', icon: 'target', screen: 'Challenges' },
    { id: '3', title: 'Rewards', icon: 'star', screen: 'Rewards' },
    { id: '4', title: 'Badges', icon: 'award', screen: 'Badges' },
    { id: '5', title: 'Leaderboard', icon: 'bar-chart-2', screen: 'Leaderboard' },
    { id: '6', title: 'Referrals', icon: 'users', screen: 'Referral' },
  ];

  const transactionHistory = mockTransactions.slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'points_earned':
        return 'plus-circle';
      case 'spin':
        return 'zap';
      case 'checkin':
        return 'check-circle';
      case 'purchase':
        return 'shopping-bag';
      case 'reward':
        return 'gift';
      default:
        return 'activity';
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Technozone Points</Text>
      </View>

      {/* Member Card Widget */}
      <View style={styles.memberCard}>
        <View style={styles.memberCardHeader}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{user?.name || 'Member'}</Text>
            <View style={styles.tierBadge}>
              <Feather name="award" size={14} color={colors.loyaltyPrimary} />
              <Text style={styles.memberTier}>Gold Member</Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.qrButton,
              pressed && styles.qrButtonPressed,
            ]}
            accessibilityLabel="View membership QR code"
            accessibilityRole="button"
          >
            <Feather name="maximize" size={22} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.pointsRow}>
          <View style={styles.pointsMain}>
            <Text style={styles.pointsValue}>{pointsBalance.toLocaleString()}</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>
          <View style={styles.cashValueBadge}>
            <Text style={styles.cashValueText}>= {cashValue.toLocaleString()} MNT</Text>
          </View>
        </View>

        {expiringPoints > 0 && (
          <View style={styles.warningBanner}>
            <Feather name="alert-circle" size={16} color={colors.loyaltyPrimary} />
            <Text style={styles.warningText}>
              {expiringPoints.toLocaleString()} points expiring in 30 days
            </Text>
          </View>
        )}
      </View>

      {/* Tier Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tier Progress</Text>
        <View style={styles.tierCard}>
          <View style={styles.tierLabels}>
            <Text style={styles.tierLabelCurrent}>Gold</Text>
            <Text style={styles.tierLabelNext}>Platinum</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(tierProgress / tierTarget) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.tierProgressText}>
            {pointsToNextTier.toLocaleString()} points to Platinum
          </Text>
        </View>
      </View>

      {/* Daily Check-in */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Check-in</Text>
        <View style={styles.checkInCard}>
          <View style={styles.streakContainer}>
            <Feather name="trending-up" size={20} color={colors.accent} />
            <Text style={styles.streakText}>{streak}-day streak</Text>
          </View>

          <View style={styles.daysContainer}>
            {daysOfWeek.map((day, idx) => {
              const isCompleted = idx < todayIndex;
              const isToday = idx === todayIndex;
              const isTodayCompleted = isToday && checkInToday;

              return (
                <View
                  key={`${day}-${idx}`}
                  style={[
                    styles.dayCircle,
                    (isCompleted || isTodayCompleted) && styles.dayCircleCompleted,
                    isToday && !isTodayCompleted && styles.dayCircleActive,
                  ]}
                  accessibilityLabel={`${day}${isCompleted || isTodayCompleted ? ' completed' : ''}`}
                >
                  {isCompleted || isTodayCompleted ? (
                    <Feather name="check" size={16} color={colors.white} />
                  ) : (
                    <Text style={styles.dayText}>{day}</Text>
                  )}
                </View>
              );
            })}
          </View>

          {!checkInToday ? (
            <Pressable
              onPress={handleCheckIn}
              style={({ pressed }) => [
                styles.checkInButton,
                pressed && styles.checkInButtonPressed,
              ]}
              accessibilityLabel="Check in daily, earn 10 points"
              accessibilityRole="button"
            >
              <Text style={styles.checkInButtonText}>Check In</Text>
              <Text style={styles.checkInButtonSubtext}>+10 pts</Text>
            </Pressable>
          ) : (
            <View style={styles.checkedInBanner}>
              <Feather name="check-circle" size={18} color={colors.success} />
              <Text style={styles.checkedInText}>Checked in today</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earn & Redeem</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => navigation.navigate(action.screen)}
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.actionCardPressed,
              ]}
              accessibilityLabel={action.title}
              accessibilityRole="button"
            >
              <Feather
                name={action.icon}
                size={28}
                color={colors.primary}
                             />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          {transactionHistory.length > 0 ? (
            transactionHistory.map((tx, idx) => {
              const isEarned =
                tx.type === 'points_earned' ||
                tx.type === 'spin' ||
                tx.type === 'checkin' ||
                tx.type === 'reward';
              const displayValue = tx.points != null
                ? `${tx.points > 0 ? '+' : ''}${tx.points.toLocaleString()} pts`
                : tx.amount != null
                  ? `${tx.amount.toLocaleString()} MNT`
                  : '';

              const iconName = getTransactionIcon(tx.type);

              return (
                <View
                  key={tx.id}
                  style={[
                    styles.transactionRow,
                    idx !== transactionHistory.length - 1 && styles.transactionRowBorder,
                  ]}
                >
                  <View style={styles.transactionIconContainer}>
                    <Feather
                      name={iconName as React.ComponentProps<typeof Feather>['name']}
                      size={20}
                      color={isEarned ? colors.success : colors.accent}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{tx.title}</Text>
                    <Text style={styles.transactionDate}>{tx.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      isEarned ? styles.amountEarned : styles.amountSpent,
                    ]}
                  >
                    {displayValue}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyStateText}>No recent activity</Text>
          )}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  memberCard: {
    marginHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  memberCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberTier: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.loyaltyPrimary,
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  qrButtonPressed: {
    opacity: 0.8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pointsMain: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 44,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  cashValueBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cashValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.loyaltyPrimary,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 12,
  },
  tierCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tierLabelCurrent: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.loyaltyPrimary,
  },
  tierLabelNext: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 4,
  },
  tierProgressText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
  },
  checkInCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  dayCircleCompleted: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayCircleActive: {
    borderColor: colors.accent,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceSecondary,
  },
  checkInButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  checkInButtonPressed: {
    opacity: 0.85,
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  checkInButtonSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  checkedInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  checkedInText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  actionCardPressed: {
    opacity: 0.75,
    backgroundColor: colors.border,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
  activityContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurface,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.onSurfaceSecondary,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  amountEarned: {
    color: colors.success,
  },
  amountSpent: {
    color: colors.accent,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
