import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { mockTransactions } from '../../data/mockData';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type WalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Wallet'
>;

interface Props {
  navigation: WalletScreenNavigationProp;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  icon: string;
  category: string;
}

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const transactions: Transaction[] = mockTransactions || [
    {
      id: '1',
      icon: 'shopping-bag',
      title: 'Electronics Store Purchase',
      amount: -45000,
      date: '2026-02-24',
      category: 'shopping',
    },
    {
      id: '2',
      icon: 'credit-card',
      title: 'Credit Card Payment',
      amount: -150000,
      date: '2026-02-23',
      category: 'payment',
    },
    {
      id: '3',
      icon: 'star',
      title: 'Loyalty Points Redemption',
      amount: 5000,
      date: '2026-02-22',
      category: 'loyalty',
    },
    {
      id: '4',
      icon: 'dollar-sign',
      title: 'Wallet Top-Up',
      amount: 200000,
      date: '2026-02-20',
      category: 'topup',
    },
    {
      id: '5',
      icon: 'map-pin',
      title: 'Store Purchase',
      amount: -87500,
      date: '2026-02-19',
      category: 'shopping',
    },
  ];

  const handleTopUp = () => {
    // Navigate to top-up screen
  };

  const handleRedeem = () => {
    // Navigate to redeem points screen
  };

  const handleViewCards = () => {
    // Navigate to gift cards screen
  };

  const handlePayNow = () => {
    // Navigate to payment screen
  };

  const renderAccountCard = (
    title: string,
    icon: string,
    balance: string,
    value: string,
    buttonText: string,
    onPress: () => void,
    bgColor: string,
    borderColor: string
  ) => (
    <View style={[styles.accountCard, { borderColor, backgroundColor: bgColor }]}>
      <View style={styles.accountHeader}>
        <View>
          <Feather name={icon as any} size={28} color={borderColor} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountTitle}>{title}</Text>
          <Text style={styles.accountBalance}>{balance}</Text>
        </View>
      </View>
      <Text style={styles.accountValue}>{value}</Text>
      <TouchableOpacity
        style={[styles.accountButton, { borderColor }]}
        onPress={onPress}
      >
        <Text style={[styles.accountButtonText, { color: borderColor }]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const amt = item.amount ?? 0;
    const isPositive = amt > 0;
    const amountColor = isPositive ? colors.success : colors.error;
    const amountText = item.amount != null
      ? `${isPositive ? '+' : ''}${amt.toLocaleString()}`
      : (item.points != null ? `${item.points > 0 ? '+' : ''}${item.points} pts` : '');

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <Feather name={item.icon as any} size={20} color={colors.onSurfaceVariant} />
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {amountText}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Balance Widget */}
        <View style={styles.balanceWidget}>
          <View style={styles.mainBalance}>
            <Text style={styles.balanceLabel}>Main Balance</Text>
            <Text style={styles.balanceAmount}>₮150,000</Text>
          </View>
          <View style={styles.balanceRow}>
            <View style={styles.balanceSmall}>
              <Feather name="star" size={24} color={colors.loyaltyPrimary} style={styles.balanceIconStyle} />
              <Text style={styles.balanceSmallLabel}>Points</Text>
              <Text style={styles.balanceSmallAmount}>₮124,500</Text>
            </View>
            <View style={styles.balanceSmall}>
              <Feather name="gift" size={24} color={colors.primary} style={styles.balanceIconStyle} />
              <Text style={styles.balanceSmallLabel}>Gift Cards</Text>
              <Text style={styles.balanceSmallAmount}>₮50,000</Text>
            </View>
            <View style={styles.balanceSmall}>
              <Feather name="credit-card" size={24} color={colors.loanPrimary} style={styles.balanceIconStyle} />
              <Text style={styles.balanceSmallLabel}>Loan</Text>
              <Text style={[styles.balanceSmallAmount, { color: colors.error }]}>
                -₮487,500
              </Text>
            </View>
          </View>
        </View>

        {/* Account Cards */}
        <View style={styles.accountsSection}>
          <Text style={styles.sectionTitle}>My Accounts</Text>

          {renderAccountCard(
            'Main Wallet',
            'credit-card',
            '₮150,000',
            'Primary Account',
            'Top Up',
            handleTopUp,
            '#FFFFFF',
            colors.primary
          )}

          {renderAccountCard(
            'Loyalty Points',
            'star',
            '12,450 pts',
            'Gold Tier Member',
            'Redeem',
            handleRedeem,
            '#FFFBF0',
            colors.loyaltyPrimary
          )}

          {renderAccountCard(
            'Gift Cards',
            'gift',
            '₮50,000',
            '2 Active Cards',
            'View Cards',
            handleViewCards,
            '#F0F9FF',
            '#F97316'
          )}

          {renderAccountCard(
            'NBFI Loan',
            'credit-card',
            '-₮487,500',
            'Outstanding Balance',
            'Pay Now',
            handlePayNow,
            '#F0F9FF',
            colors.loanPrimary
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Financial Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                -₮850,000
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points Earned</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                +8,500
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Loan Payments</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                ₮265,000
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  balanceWidget: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.md,
  },
  mainBalance: {
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceSmall: {
    flex: 1,
    marginHorizontal: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  balanceIconStyle: {
    marginBottom: spacing.xs,
  },
  balanceSmallLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceSmallAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  accountsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  accountCard: {
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  accountValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  accountButton: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  accountButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  summarySection: {
    paddingHorizontal: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
  },
});

export default WalletScreen;
