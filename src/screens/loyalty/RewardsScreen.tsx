import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles';
import { mockRewards } from '../../data/mockData';

type RewardsScreenProps = NativeStackNavigationProp<RootStackParamList, 'Rewards'>;

interface Props {
  navigation: RewardsScreenProps;
}

type CategoryType = 'all' | 'vouchers' | 'products' | 'shipping' | 'loan' | 'spins' | 'partners';

const CATEGORIES: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'grid' },
  { key: 'vouchers', label: 'Vouchers', icon: 'tag' },
  { key: 'products', label: 'Products', icon: 'gift' },
  { key: 'shipping', label: 'Shipping', icon: 'truck' },
  { key: 'loan', label: 'Loan Perks', icon: 'credit-card' },
  { key: 'spins', label: 'Spins', icon: 'gift' },
  { key: 'partners', label: 'Partners', icon: 'coffee' },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export const RewardsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const pointsAvailable = 12450;

  const getFilteredRewards = () => {
    if (activeCategory === 'all') return mockRewards;
    return mockRewards.filter((reward) => reward.category === activeCategory);
  };

  const handleRedeem = (reward: any) => {
    const hasEnoughPoints = pointsAvailable >= reward.points;

    if (!hasEnoughPoints) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.points} points but only have ${pointsAvailable}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem "${reward.name}" for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success!', `You've redeemed "${reward.name}"!`, [
              { text: 'OK' },
            ]);
          },
        },
      ]
    );
  };

  const rewards = getFilteredRewards();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Points Display */}
      <View style={styles.pointsDisplay}>
        <Text style={styles.pointsLabel}>Available Points</Text>
        <Text style={styles.pointsAmount}>{pointsAvailable.toLocaleString()} pts</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.key;
            return (
              <Pressable
                key={category.key}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setActiveCategory(category.key)}
              >
                <Feather
                  name={category.icon as any}
                  size={14}
                  color={isActive ? '#FFFFFF' : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Rewards Grid */}
      <FlatList
        scrollEnabled={true}
        data={rewards}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => {
          const hasEnoughPoints = pointsAvailable >= item.points;
          return (
            <View style={[styles.rewardCard, { width: COLUMN_WIDTH }]}>
              <View
                style={[
                  styles.rewardIcon,
                  !hasEnoughPoints && styles.rewardIconDisabled,
                ]}
              >
                <Feather name={item.icon as any} size={28} color={colors.loyaltyPrimary} />
              </View>
              <Text style={styles.rewardName}>{item.name}</Text>
              <View style={styles.rewardPointsBox}>
                <Text style={styles.rewardPoints}>{item.points}</Text>
                <Text style={styles.rewardPointsLabel}>pts</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.redeemButton,
                  !hasEnoughPoints && styles.redeemButtonDisabled,
                ]}
                onPress={() => handleRedeem(item)}
                disabled={!hasEnoughPoints}
              >
                <Text
                  style={[
                    styles.redeemButtonText,
                    !hasEnoughPoints && styles.redeemButtonTextDisabled,
                  ]}
                >
                  Redeem
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  pointsDisplay: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.loyaltyPrimary,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  pointsAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.loyaltyPrimary,
    borderColor: colors.loyaltyPrimary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  rewardIcon: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardIconDisabled: {
    opacity: 0.5,
  },
  rewardName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    height: 36,
  },
  rewardPointsBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  rewardPoints: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  rewardPointsLabel: {
    fontSize: 11,
    color: '#999999',
    marginLeft: 2,
  },
  redeemButton: {
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  redeemButtonTextDisabled: {
    color: '#999999',
  },
  bottomSpacer: {
    height: 20,
  },
});
