import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius } from '../../styles/spacing';
import { mockLoans, mockClosedLoans, mockCreditProfile } from '../../data/mockData';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const formatPrice = (n?: number) => {
  if (n == null) return '₮0';
  return `₮${n.toLocaleString()}`;
};

const LoanHomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const creditProfile = useMemo(() => mockCreditProfile, []);
  const activeLoans = useMemo(() => mockLoans, []);
  const closedLoans = useMemo(() => mockClosedLoans, []);

  const handleQuickAction = (action: string) => {
    if (action === 'apply') {
      navigation.navigate('LoanApplication', {});
    } else if (action === 'calculator') {
      navigation.navigate('LoanCalculator', {});
    } else if (action === 'payment') {
      if (activeLoans.length > 0) {
        navigation.navigate('Payment', { loanId: activeLoans[0].id });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerTitle}>Loans</Text>

        {/* Credit Score Card */}
        <View style={styles.creditScoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{creditProfile.creditScore}</Text>
            <Text style={styles.scoreMax}>/{creditProfile.maxScore}</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLevel}>{creditProfile.scoreRating}</Text>
            <Text style={styles.scoreLabel}>Credit Level</Text>
          </View>
          <View style={styles.scoreAvailable}>
            <Text style={styles.availableLabel}>Available Credit</Text>
            <Text style={styles.availableAmount}>{formatPrice(creditProfile.availableCredit)}</Text>
          </View>
        </View>

        {/* Active Loans Section */}
        {activeLoans.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Loans</Text>
            {activeLoans.map((loan) => {
              const progressPercent =
                loan.paidMonths && loan.term ? (loan.paidMonths / loan.term) * 100 : 0;

              return (
                <View key={loan.id} style={styles.loanCard}>
                  <Text style={styles.loanProduct}>{loan.productName}</Text>
                  <Text style={styles.loanAmount}>{formatPrice(loan.originalAmount)}</Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progressPercent}%` }]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {loan.paidMonths}/{loan.term} months paid
                    </Text>
                  </View>

                  <View style={styles.loanDetails}>
                    <View>
                      <Text style={styles.detailLabel}>Monthly Payment</Text>
                      <Text style={styles.detailValue}>{formatPrice(loan.monthlyPayment)}</Text>
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Next Payment</Text>
                      <Text style={styles.detailValue}>{loan.nextDueDate}</Text>
                    </View>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.payButton,
                      pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                    ]}
                    onPress={() => navigation.navigate('Payment', { loanId: loan.id })}
                    accessibilityRole="button"
                    accessibilityLabel={`Pay now for ${loan.productName} loan`}
                  >
                    <Feather name="credit-card" size={16} color={colors.white} />
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </Pressable>
                </View>
              );
            })}
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]}
            onPress={() => handleQuickAction('calculator')}
            accessibilityRole="button"
            accessibilityLabel="Loan calculator"
          >
            <Feather name="sliders" size={24} color={colors.loanPrimary} />
            <Text style={styles.quickActionLabel}>Calculator</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]}
            onPress={() => handleQuickAction('apply')}
            accessibilityRole="button"
            accessibilityLabel="Apply for loan"
          >
            <Feather name="file-plus" size={24} color={colors.loanPrimary} />
            <Text style={styles.quickActionLabel}>Apply</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]}
            onPress={() => handleQuickAction('payment')}
            accessibilityRole="button"
            accessibilityLabel="View loan history"
          >
            <Feather name="clock" size={24} color={colors.loanPrimary} />
            <Text style={styles.quickActionLabel}>History</Text>
          </Pressable>
        </View>

        {/* Closed Loans */}
        {closedLoans.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed Loans</Text>
            {closedLoans.map((loan) => (
              <View key={loan.id} style={styles.closedLoanCard}>
                <View style={styles.closedLoanHeader}>
                  <Text style={styles.closedLoanProduct}>{loan.productName}</Text>
                  <View style={styles.completedBadge}>
                    <Feather name="check-circle" size={12} color={colors.success} />
                    <Text style={styles.closedLoanStatus}>Completed</Text>
                  </View>
                </View>
                <Text style={styles.closedLoanAmount}>{formatPrice(loan.originalAmount)}</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  headerTitle: {
    ...typography.displayLarge,
    color: colors.onSurface,
    marginBottom: spacing.xl,
  },
  creditScoreCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.loanPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  scoreMax: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '500',
  },
  scoreInfo: {
    flex: 1,
    marginRight: spacing.base,
  },
  scoreLevel: {
    ...typography.titleMedium,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  scoreAvailable: {
    alignItems: 'flex-end',
  },
  availableLabel: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  availableAmount: {
    ...typography.labelLarge,
    fontWeight: '700',
    color: colors.loanPrimary,
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  loanCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loanProduct: {
    ...typography.titleMedium,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.loanPrimary,
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.base,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.loanPrimary,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...typography.labelMedium,
    fontWeight: '700',
    color: colors.onSurface,
  },
  payButton: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  payButtonText: {
    ...typography.labelLarge,
    fontWeight: '700',
    color: colors.white,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  closedLoanCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closedLoanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  closedLoanProduct: {
    ...typography.labelLarge,
    fontWeight: '600',
    color: colors.onSurface,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  closedLoanStatus: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.success,
  },
  closedLoanAmount: {
    ...typography.labelLarge,
    fontWeight: '700',
    color: colors.onSurface,
  },
});

export default LoanHomeScreen;
