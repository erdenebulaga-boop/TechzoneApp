import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SimpleSlider } from '../../components/common/SimpleSlider';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LoanCalculator'>;

const { width } = Dimensions.get('window');

const formatPrice = (n: number) => `₮${n.toLocaleString()}`;

const getInterestRateByTier = (tier: string): number => {
  switch (tier?.toLowerCase()) {
    case 'platinum':
      return 0.005; // 0.5%
    case 'gold':
      return 0.01; // 1.0%
    case 'silver':
      return 0.015; // 1.5%
    default:
      return 0.02; // 2.0%
  }
};

const calculateMonthlyPayment = (
  principal: number,
  monthlyRate: number,
  months: number
): number => {
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  return numerator / denominator;
};

const LoanCalculatorScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState(1_500_000);
  const [term, setTerm] = useState(6);

  const monthlyRate = getInterestRateByTier(user?.loyaltyTier);

  const calculations = useMemo(() => {
    const monthlyPayment = calculateMonthlyPayment(amount, monthlyRate, term);
    const totalRepayment = monthlyPayment * term;
    const totalInterest = totalRepayment - amount;
    const pointsToEarn = term * 100;

    // Calculate first payment date (28th of next month or current month)
    const today = new Date();
    let firstPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, 28);
    if (firstPaymentDate < today) {
      firstPaymentDate = new Date(today.getFullYear(), today.getMonth() + 2, 28);
    }

    const formattedDate = firstPaymentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest),
      pointsToEarn,
      firstPaymentDate: formattedDate,
    };
  }, [amount, term, monthlyRate]);

  const handleQuickSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleApply = () => {
    navigation.navigate('LoanApplication', {
      amount,
      term,
    });
  };

  const rateDisplay = `${(monthlyRate * 100).toFixed(1)}%/mo (${
    user?.loyaltyTier || 'Standard'
  } discount)`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan Calculator</Text>
        </View>

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Amount</Text>
          <View style={styles.amountDisplay}>
            <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <SimpleSlider
              style={styles.slider}
              minimumValue={100_000}
              maximumValue={5_000_000}
              step={100_000}
              value={amount}
              onValueChange={setAmount}
              minimumTrackTintColor={colors.loanPrimary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={colors.loanPrimary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>₮100K</Text>
              <Text style={styles.sliderLabel}>₮5M</Text>
            </View>
          </View>

          {/* Quick Select Buttons */}
          <Text style={styles.quickSelectLabel}>Quick Select:</Text>
          <View style={styles.quickSelectGrid}>
            {[500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickSelectBtn,
                  amount === value && styles.quickSelectBtnActive,
                ]}
                onPress={() => handleQuickSelect(value)}
              >
                <Text
                  style={[
                    styles.quickSelectText,
                    amount === value && styles.quickSelectTextActive,
                  ]}
                >
                  {value === 500_000 ? '₮500K' : `₮${(value / 1_000_000).toFixed(0)}M`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Term Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Term</Text>
          <View style={styles.termGrid}>
            {[3, 6, 12, 24].map((months) => (
              <TouchableOpacity
                key={months}
                style={[styles.termCard, term === months && styles.termCardActive]}
                onPress={() => setTerm(months)}
              >
                <Text style={[styles.termText, term === months && styles.termTextActive]}>
                  {months}
                </Text>
                <Text style={[styles.termSubtext, term === months && styles.termSubtextActive]}>
                  months
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Card */}
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Loan Details</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly Payment</Text>
            <Text style={styles.resultValue}>{formatPrice(calculations.monthlyPayment)}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Interest Rate</Text>
            <Text style={styles.resultValue}>{rateDisplay}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Interest</Text>
            <Text style={styles.resultValue}>{formatPrice(calculations.totalInterest)}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Repayment</Text>
            <Text style={[styles.resultValue, { fontWeight: '700' }]}>
              {formatPrice(calculations.totalRepayment)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Points to Earn</Text>
            <Text style={[styles.resultValue, { color: colors.loyaltyPrimary }]}>
              +{calculations.pointsToEarn} pts
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>First Payment</Text>
            <Text style={styles.resultValue}>{calculations.firstPaymentDate}</Text>
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply with These Terms</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.loanPrimary,
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  amountDisplay: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.loanPrimary,
  },
  sliderContainer: {
    marginBottom: spacing.lg,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  quickSelectLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  quickSelectBtn: {
    width: (width - spacing.md * 2 - spacing.sm * 2) / 3,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickSelectBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.loanPrimary,
  },
  quickSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  quickSelectTextActive: {
    color: colors.loanPrimary,
  },
  termGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  termCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  termCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.loanPrimary,
  },
  termText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  termTextActive: {
    color: colors.loanPrimary,
  },
  termSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  termSubtextActive: {
    color: colors.loanPrimary,
  },
  resultsCard: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E0F2FE',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: spacing.md,
  },
  applyButton: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.md,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LoanCalculatorScreen;
