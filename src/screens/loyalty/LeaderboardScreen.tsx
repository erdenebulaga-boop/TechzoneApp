import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles';
import { mockLeaderboard } from '../../data/mockData';

type LeaderboardScreenProps = NativeStackNavigationProp<RootStackParamList, 'Leaderboard'>;

interface Props {
  navigation: LeaderboardScreenProps;
}

type TimePeriodType = 'weekly' | 'monthly' | 'alltime';

export const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriodType>('weekly');

  const currentUserId = '2026001234';
  const getAdjustedPoints = (points: number) => {
    if (timePeriod === 'weekly') return Math.floor(points * 0.3);
    if (timePeriod === 'monthly') return Math.floor(points * 0.7);
    return points;
  };

  const leaderboardData = mockLeaderboard
    .map((user) => ({
      ...user,
      points: getAdjustedPoints(user.points),
    }))
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  const currentUserData = leaderboardData.find((u) => u.id === currentUserId);
  const top3 = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GOLD':
        return colors.loyaltyPrimary;
      case 'SILVER':
        return '#C0C0C0';
      case 'BRONZE':
        return '#CD7F32';
      default:
        return '#999999';
    }
  };

  const prizes = [
    { rank: 1, iconName: 'award', tierColor: '#FFD700', reward: '+10,000 pts' },
    { rank: '2-10', iconName: 'award', tierColor: '#C0C0C0', reward: '+5,000 pts' },
    { rank: '11-50', iconName: 'award', tierColor: '#CD7F32', reward: '+1,000 pts' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Period Tabs */}
        <View style={styles.tabsContainer}>
          {(['weekly', 'monthly', 'alltime'] as TimePeriodType[]).map((tab) => {
            const isActive = timePeriod === tab;
            return (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => setTimePeriod(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab === 'weekly'
                  ? 'Weekly'
                  : tab === 'monthly'
                  ? 'Monthly'
                  : 'All-Time'}
              </Text>
            </Pressable>
            );
          })}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {top3.length >= 2 && (
            <View style={styles.podiumSecond}>
              <View style={[styles.podiumMedal, { backgroundColor: '#C0C0C0' }]}>
                <Text style={styles.medalRank}>2</Text>
              </View>
              <Text style={styles.podiumRank}>#2</Text>
              <Text style={styles.podiumName}>{top3[1].name}</Text>
              <Text style={styles.podiumPoints}>{top3[1].points.toLocaleString()} pts</Text>
              <View style={styles.tierBadge}>
                <View
                  style={[
                    styles.tierDot,
                    { backgroundColor: getTierColor(top3[1].tier) },
                  ]}
                />
                <Text style={styles.tierText}>{top3[1].tier}</Text>
              </View>
            </View>
          )}

          {top3.length >= 1 && (
            <View style={styles.podiumFirst}>
              <View style={[styles.podiumMedal, { backgroundColor: '#FFD700' }]}>
                <Text style={styles.medalRank}>1</Text>
              </View>
              <Text style={styles.podiumRank}>#1</Text>
              <Text style={styles.podiumName}>{top3[0].name}</Text>
              <Text style={styles.podiumPoints}>{top3[0].points.toLocaleString()} pts</Text>
              <View style={styles.tierBadge}>
                <View
                  style={[
                    styles.tierDot,
                    { backgroundColor: getTierColor(top3[0].tier) },
                  ]}
                />
                <Text style={styles.tierText}>{top3[0].tier}</Text>
              </View>
            </View>
          )}

          {top3.length >= 3 && (
            <View style={styles.podiumThird}>
              <View style={[styles.podiumMedal, { backgroundColor: '#CD7F32' }]}>
                <Text style={styles.medalRank}>3</Text>
              </View>
              <Text style={styles.podiumRank}>#3</Text>
              <Text style={styles.podiumName}>{top3[2].name}</Text>
              <Text style={styles.podiumPoints}>{top3[2].points.toLocaleString()} pts</Text>
              <View style={styles.tierBadge}>
                <View
                  style={[
                    styles.tierDot,
                    { backgroundColor: getTierColor(top3[2].tier) },
                  ]}
                />
                <Text style={styles.tierText}>{top3[2].tier}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          <FlatList
            scrollEnabled={false}
            data={remaining}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isCurrentUser = item.id === currentUserId;
              return (
                <View
                  style={[
                    styles.leaderboardItem,
                    isCurrentUser && styles.leaderboardItemHighlight,
                  ]}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{item.rank}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <View style={styles.userMeta}>
                      <View
                        style={[
                          styles.tierDotSmall,
                          { backgroundColor: getTierColor(item.tier) },
                        ]}
                      />
                      <Text style={styles.tierLabel}>{item.tier}</Text>
                    </View>
                  </View>
                  <Text style={styles.pointsAmount}>
                    {item.points.toLocaleString()} pts
                  </Text>
                </View>
              );
            }}
          />
        </View>

        {/* Current User Position */}
        {currentUserData && !top3.find((u) => u.id === currentUserId) && (
          <View style={styles.currentUserSection}>
            <Text style={styles.currentUserLabel}>Your Position</Text>
            <View style={styles.currentUserCard}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{currentUserData.rank}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Батзориг Дорж (You)</Text>
                <View style={styles.userMeta}>
                  <View
                    style={[
                      styles.tierDotSmall,
                      { backgroundColor: getTierColor(currentUserData.tier) },
                    ]}
                  />
                  <Text style={styles.tierLabel}>{currentUserData.tier}</Text>
                </View>
              </View>
              <Text style={styles.pointsAmount}>
                {currentUserData.points.toLocaleString()} pts
              </Text>
            </View>
          </View>
        )}

        {/* Prizes Section */}
        <View style={styles.prizesSection}>
          <Text style={styles.sectionTitle}>Weekly Prizes</Text>
          <View style={styles.prizesGrid}>
            {prizes.map((prize, idx) => (
              <View key={idx} style={styles.prizeCard}>
                <View style={[styles.prizeIconCircle, { backgroundColor: prize.tierColor }]}>
                  <Feather name={prize.iconName} size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.prizeRank}>
                  {typeof prize.rank === 'number' ? `#${prize.rank}` : prize.rank}
                </Text>
                <Text style={styles.prizeReward}>{prize.reward}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.loyaltyPrimary,
    borderColor: colors.loyaltyPrimary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 280,
  },
  podiumSecond: {
    width: '28%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
    height: 220,
    justifyContent: 'space-between',
  },
  podiumFirst: {
    width: '28%',
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.loyaltyPrimary,
    height: 260,
    justifyContent: 'space-between',
  },
  podiumThird: {
    width: '28%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
    height: 200,
    justifyContent: 'space-between',
  },
  podiumMedal: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalRank: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  podiumRank: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 166, 35, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  tierDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
  },
  tierLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
  },
  listContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  leaderboardItemHighlight: {
    backgroundColor: 'rgba(245, 166, 35, 0.05)',
    borderColor: colors.loyaltyPrimary,
    borderWidth: 2,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.loyaltySecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  currentUserSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  currentUserLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  currentUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.loyaltyPrimary,
  },
  prizesSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  prizesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  prizeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  prizeIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  prizeRank: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  prizeReward: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.loyaltyPrimary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});
