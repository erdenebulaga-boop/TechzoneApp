import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles';
import { mockBadges } from '../../data/mockData';

type BadgesScreenProps = NativeStackNavigationProp<RootStackParamList, 'Badges'>;

interface Props {
  navigation: BadgesScreenProps;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 3;

export const BadgesScreen: React.FC<Props> = ({ navigation }) => {
  const totalBadges = mockBadges.length;
  const earnedBadges = mockBadges.filter((b) => b.earned).length;

  const handleBadgePress = (badge: any) => {
    if (badge.earned) {
      Alert.alert(
        badge.name,
        `Earned on: ${badge.earnedDate}\n\nReward: +${badge.reward} pts`,
        [{ text: 'Close' }]
      );
    } else {
      Alert.alert(
        `${badge.name} (Locked)`,
        `Progress: ${badge.progress} / ${badge.target}\n\nReward: +${badge.reward} pts`,
        [{ text: 'Close' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievement Badges</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Progress Summary */}
      <View style={styles.progressSummary}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryTitle}>Badges Earned</Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountNumber}>{earnedBadges}</Text>
            <Text style={styles.badgeCountTotal}>/{totalBadges}</Text>
          </View>
        </View>
        <View style={styles.summaryRight}>
          <View style={styles.donutChart}>
            <View
              style={[
                styles.donutFill,
                {
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                  borderWidth: 12,
                  borderColor: colors.loyaltyPrimary,
                },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 50,
                  backgroundColor: colors.loyaltySecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.donutPercent}>
                  {Math.round((earnedBadges / totalBadges) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Badges Grid */}
      <FlatList
        scrollEnabled={true}
        data={mockBadges}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.badgeCard, { width: COLUMN_WIDTH }]}
            onPress={() => handleBadgePress(item)}
          >
            <View
              style={[
                styles.badgeIconContainer,
                !item.earned && styles.badgeIconContainerLocked,
              ]}
            >
              <Feather name={item.icon as any} size={40} color={colors.loyaltyPrimary} />
              {item.earned && (
                <View style={styles.checkmark}>
                  <Feather name="check" size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={styles.badgeName}>{item.name}</Text>

            {item.earned ? (
              <Text style={styles.earnedDate}>Earned</Text>
            ) : (
              <View style={styles.progressContainer}>
                <View style={styles.lockedBadgeProgress}>
                  <View
                    style={[
                      styles.lockedBadgeProgressFill,
                      {
                        width: `${(item.progress / item.target) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {item.progress}/{item.target}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomSpacer} />
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
  progressSummary: {
    marginHorizontal: 16,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 8,
  },
  badgeCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  badgeCountNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  badgeCountTotal: {
    fontSize: 18,
    color: '#999999',
    marginLeft: 4,
  },
  summaryRight: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutChart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutFill: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutPercent: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    gap: 10,
    marginBottom: 10,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.loyaltySecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeIconContainerLocked: {
    opacity: 0.5,
  },
  checkmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    height: 32,
  },
  earnedDate: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
  },
  lockedBadgeProgress: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  lockedBadgeProgressFill: {
    height: '100%',
    backgroundColor: colors.loyaltyPrimary,
  },
  progressText: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});
