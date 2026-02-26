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
  Share,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles';

type ReferralScreenProps = NativeStackNavigationProp<RootStackParamList, 'Referral'>;

interface Props {
  navigation: ReferralScreenProps;
}

interface ReferralItem {
  id: string;
  name: string;
  status: 'pending' | 'completed';
  earned: number;
  date: string;
}

const mockReferrals: ReferralItem[] = [
  { id: '1', name: 'Мөнх-Өрөг', status: 'completed', earned: 1500, date: '2 weeks ago' },
  { id: '2', name: 'Нэмүүн', status: 'completed', earned: 1500, date: '3 weeks ago' },
  { id: '3', name: 'Сүхбатар', status: 'pending', earned: 500, date: '1 day ago' },
];

export const ReferralScreen: React.FC<Props> = ({ navigation }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'BATD2026';
  const friendsReferred = 3;
  const totalEarned = 4500;

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShare = async (type: 'messenger' | 'sms' | 'link') => {
    const message = `Join Technozone and get 500 bonus points! Use my referral code: ${referralCode}`;

    if (type === 'link') {
      try {
        await Share.share({
          message: message,
          url: 'https://technozone.mn',
          title: 'Technozone Referral',
        });
      } catch (error) {
        Alert.alert('Error', 'Could not share');
      }
    } else {
      Alert.alert('Share via ' + (type === 'messenger' ? 'Messenger' : 'SMS'), message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Program</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Referral Code Section */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Text style={styles.copyButtonText}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Buttons */}
        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Share With Friends</Text>
          <View style={styles.shareGrid}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('messenger')}
            >
              <Feather name="message-square" size={28} color={colors.loyaltyPrimary} style={styles.shareButtonIcon} />
              <Text style={styles.shareLabel}>Messenger</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('sms')}
            >
              <Feather name="smartphone" size={28} color={colors.loyaltyPrimary} style={styles.shareButtonIcon} />
              <Text style={styles.shareLabel}>SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('link')}
            >
              <Feather name="link" size={28} color={colors.loyaltyPrimary} style={styles.shareButtonIcon} />
              <Text style={styles.shareLabel}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Explanation */}
        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>How It Works</Text>
          <View style={styles.rewardItem}>
            <View style={styles.rewardIcon}>
              <Feather name="edit-3" size={24} color={colors.loyaltyPrimary} />
            </View>
            <View style={styles.rewardContent}>
              <Text style={styles.rewardItemTitle}>Friend Signs Up</Text>
              <Text style={styles.rewardItemDesc}>
                Your friend creates account with your code
              </Text>
              <Text style={styles.rewardAmount}>+500 pts</Text>
            </View>
          </View>

          <View style={styles.rewardItem}>
            <View style={styles.rewardIcon}>
              <Feather name="shopping-cart" size={24} color={colors.loyaltyPrimary} />
            </View>
            <View style={styles.rewardContent}>
              <Text style={styles.rewardItemTitle}>First Purchase</Text>
              <Text style={styles.rewardItemDesc}>
                Friend makes their first order
              </Text>
              <Text style={styles.rewardAmount}>+1,000 pts</Text>
            </View>
          </View>

          <View style={styles.rewardItem}>
            <View style={styles.rewardIcon}>
              <Feather name="gift" size={24} color={colors.loyaltyPrimary} />
            </View>
            <View style={styles.rewardContent}>
              <Text style={styles.rewardItemTitle}>Friend's Welcome Bonus</Text>
              <Text style={styles.rewardItemDesc}>
                Your friend receives sign-up bonus
              </Text>
              <Text style={styles.rewardAmount}>+500 pts</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Feather name="users" size={32} color={colors.loyaltyPrimary} style={{ marginBottom: 8 }} />
            <Text style={styles.statLabel}>Friends Referred</Text>
            <Text style={styles.statValue}>{friendsReferred}</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="award" size={32} color={colors.loyaltyPrimary} style={{ marginBottom: 8 }} />
            <Text style={styles.statLabel}>Total Earned</Text>
            <Text style={styles.statValue}>{totalEarned.toLocaleString()}</Text>
            <Text style={styles.statUnit}>pts</Text>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Referral History</Text>
          <FlatList
            scrollEnabled={false}
            data={mockReferrals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.historyItem,
                  item.status === 'pending' && styles.historyItemPending,
                ]}
              >
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === 'completed'
                            ? '#E8F5E9'
                            : 'rgba(255, 152, 0, 0.1)',
                      },
                    ]}
                  >
                    {item.status === 'completed' ? (
                      <Feather name="check" size={16} color="#4CAF50" />
                    ) : (
                      <Feather name="clock" size={16} color="#FF9800" />
                    )}
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{item.name}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyEarned}>+{item.earned} pts</Text>
                  <Text style={styles.historyStatus}>
                    {item.status === 'completed' ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </View>
            )}
          />
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
  codeSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: colors.loyaltySecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.loyaltyPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
    letterSpacing: 4,
  },
  copyButton: {
    backgroundColor: colors.loyaltyPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shareSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  shareTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  shareGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.loyaltySecondary,
  },
  shareButtonIcon: {
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  rewardsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.loyaltySecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardContent: {
    flex: 1,
  },
  rewardItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  rewardItemDesc: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  rewardAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  statUnit: {
    fontSize: 11,
    color: '#999999',
  },
  historySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  historyItemPending: {
    backgroundColor: 'rgba(255, 193, 7, 0.05)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  historyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 11,
    color: '#999999',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyEarned: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 11,
    color: '#999999',
  },
  bottomSpacer: {
    height: 20,
  },
});
