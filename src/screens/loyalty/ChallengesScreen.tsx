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
import { mockChallenges } from '../../data/mockData';

type ChallengesScreenProps = NativeStackNavigationProp<RootStackParamList, 'Challenges'>;

interface Props {
  navigation: ChallengesScreenProps;
}

type TabType = 'active' | 'completed' | 'upcoming';

export const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const getFilteredChallenges = () => {
    return mockChallenges.filter((challenge) => {
      if (activeTab === 'active') return challenge.status === 'active';
      if (activeTab === 'completed') return challenge.status === 'completed';
      if (activeTab === 'upcoming') return challenge.status === 'upcoming';
      return true;
    });
  };

  const groupedChallenges = () => {
    const filtered = getFilteredChallenges();
    const groups: { [key: string]: typeof filtered } = {
      'Weekly Challenges': [],
      'Monthly Missions': [],
      'Special Events': [],
    };

    filtered.forEach((challenge) => {
      if (challenge.type === 'weekly') {
        groups['Weekly Challenges'].push(challenge);
      } else if (challenge.type === 'monthly') {
        groups['Monthly Missions'].push(challenge);
      } else {
        groups['Special Events'].push(challenge);
      }
    });

    return groups;
  };

  const renderChallengeCard = (challenge: any) => (
    <View key={challenge.id} style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeLeft}>
          <View style={styles.iconCircle}>
            <Feather name={challenge.icon} size={20} color={colors.loyaltyPrimary} />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </View>
        </View>
        {challenge.completed && (
          <View style={styles.completedBadge}>
            <Feather name="check-circle" size={20} color="#4CAF50" />
          </View>
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(challenge.progress / challenge.target) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {challenge.progress} / {challenge.target}
        </Text>
      </View>

      <View style={styles.challengeFooter}>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardLabel}>Reward</Text>
          <Text style={styles.rewardPoints}>+{challenge.reward} pts</Text>
        </View>
        <View style={styles.expiryBox}>
          <Text style={styles.expiryText}>
            {challenge.completed
              ? 'Completed'
              : `${challenge.expiresIn}`}
          </Text>
        </View>
      </View>

      {challenge.completed && (
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Claim Reward</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const groups = groupedChallenges();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['active', 'completed', 'upcoming'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(groups).map(([groupTitle, challenges]) => {
          if (challenges.length === 0) return null;

          return (
            <View key={groupTitle} style={styles.section}>
              <Text style={styles.groupTitle}>{groupTitle}</Text>
              {challenges.map((challenge) => renderChallengeCard(challenge))}
            </View>
          );
        })}

        {getFilteredChallenges().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {activeTab} challenges available
            </Text>
          </View>
        )}

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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.surface,
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
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.loyaltySecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 12,
    color: '#666666',
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#999999',
  },
  challengeFooter: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  rewardBox: {
    flex: 1,
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 8,
    padding: 10,
  },
  rewardLabel: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 2,
  },
  rewardPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  expiryBox: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
  },
  expiryText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '600',
  },
  claimButton: {
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999999',
  },
  bottomSpacer: {
    height: 20,
  },
});
