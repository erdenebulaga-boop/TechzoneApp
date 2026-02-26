import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { mockLoans } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const { width } = Dimensions.get('window');

const formatPrice = (n: number) => `₮${n.toLocaleString()}`;

type PaymentOption = 'minimum' | 'custom' | 'early_full';
type PaymentMethod = 'card' | 'qpay' | 'wallet' | 'points';

const PaymentScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('minimum');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const selectedLoan = useMemo(() => mockLoans[0], []);

  const paymentAmounts = useMemo(
    () => ({
      minimum: 265_000,
      early_full: 437_500, // remainingAmount - 50k discount
      discount_early: 50_000,
      bonus_points: 500,
    }),
    []
  );

  const getSelectedAmount = (): number => {
    switch (paymentOption) {
      case 'minimum':
        return paymentAmounts.minimum;
      case 'custom':
        return parseInt(customAmount) || 0;
      case 'early_full':
        return paymentAmounts.early_full;
      default:
        return paymentAmounts.minimum;
    }
  };

  const selectedAmount = getSelectedAmount();

  const handlePayment = () => {
    if (paymentOption === 'custom' && (!customAmount || parseInt(customAmount) <= 0)) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    const pointsBonus = paymentOption === 'early_full' ? paymentAmounts.bonus_points : 100;
    const discountInfo =
      paymentOption === 'early_full'
        ? `Early repayment discount of -₮${paymentAmounts.discount_early.toLocaleString()}`
        : '';

    Alert.alert(
      'Payment Successful',
      `Payment of ${formatPrice(selectedAmount)} confirmed!\n\n` +
        `Payment Method: ${getPaymentMethodLabel()}\n` +
        `Loan ID: ${selectedLoan.id}\n` +
        `${discountInfo}\n\n` +
        `Bonus: +${pointsBonus} pts for on-time payment`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const getPaymentMethodLabel = (): string => {
    switch (paymentMethod) {
      case 'card':
        return 'Saved Card';
      case 'qpay':
        return 'QPay';
      case 'wallet':
        return 'Wallet Balance';
      case 'points':
        return 'Points (5,000 pts = ₮50K)';
      default:
        return 'Saved Card';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
            <Feather name="chevron-left" size={24} color={colors.loanPrimary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make Payment</Text>
        </View>

        {/* Loan Selector */}
        <View style={styles.loanSelector}>
          <View style={styles.loanInfo}>
            <Text style={styles.loanName}>{selectedLoan.productName}</Text>
            <Text style={styles.loanMeta}>Loan ID: {selectedLoan.id}</Text>
          </View>
          <View style={styles.loanAmount}>
            <Text style={styles.loanAmountLabel}>Next Payment</Text>
            <Text style={styles.loanAmountValue}>
              {formatPrice(paymentAmounts.minimum)}
            </Text>
          </View>
        </View>

        {/* Payment Amount Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Amount</Text>

          {/* Minimum Due */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              paymentOption === 'minimum' && styles.optionCardActive,
            ]}
            onPress={() => setPaymentOption('minimum')}
          >
            <View style={styles.optionHeader}>
              <View
                style={[
                  styles.radioButton,
                  paymentOption === 'minimum' && styles.radioButtonActive,
                ]}
              />
              <Text style={styles.optionTitle}>Minimum Due</Text>
            </View>
            <Text style={styles.optionAmount}>{formatPrice(paymentAmounts.minimum)}</Text>
          </TouchableOpacity>

          {/* Custom Amount */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              paymentOption === 'custom' && styles.optionCardActive,
            ]}
            onPress={() => setPaymentOption('custom')}
          >
            <View style={styles.optionHeader}>
              <View
                style={[
                  styles.radioButton,
                  paymentOption === 'custom' && styles.radioButtonActive,
                ]}
              />
              <Text style={styles.optionTitle}>Custom Amount</Text>
            </View>
            <TextInput
              style={styles.customInput}
              placeholder="Enter amount (₮)"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
              editable={paymentOption === 'custom'}
            />
          </TouchableOpacity>

          {/* Early Full Repayment */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              paymentOption === 'early_full' && styles.optionCardActive,
            ]}
            onPress={() => setPaymentOption('early_full')}
          >
            <View style={styles.optionHeader}>
              <View
                style={[
                  styles.radioButton,
                  paymentOption === 'early_full' && styles.radioButtonActive,
                ]}
              />
              <View style={styles.earlyRepaymentInfo}>
                <Text style={styles.optionTitle}>Early Full Repayment</Text>
                <Text style={styles.earlyRepaymentDiscount}>
                  -₮{paymentAmounts.discount_early.toLocaleString()} discount
                </Text>
              </View>
            </View>
            <Text style={styles.optionAmount}>
              {formatPrice(selectedLoan.remainingAmount)} →{' '}
              <Text style={styles.discountedAmount}>
                {formatPrice(paymentAmounts.early_full)}
              </Text>
            </Text>
            <View style={styles.bonusBadge}>
              <Feather name="star" size={14} color={colors.loyaltyPrimary} />
              <Text style={styles.bonusText}>+{paymentAmounts.bonus_points} pts bonus</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'card' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View
              style={[
                styles.methodRadio,
                paymentMethod === 'card' && styles.methodRadioActive,
              ]}
            />
            <View style={styles.methodIconLabel}>
              <Feather name="credit-card" size={16} color={colors.primary} />
              <Text style={styles.methodLabel}>Saved Card</Text>
            </View>
            <Text style={styles.methodDetail}>Visa ending in 4242</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'qpay' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('qpay')}
          >
            <View
              style={[
                styles.methodRadio,
                paymentMethod === 'qpay' && styles.methodRadioActive,
              ]}
            />
            <View style={styles.methodIconLabel}>
              <Feather name="smartphone" size={16} color={colors.primary} />
              <Text style={styles.methodLabel}>QPay</Text>
            </View>
            <Text style={styles.methodDetail}>Mobile payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'wallet' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <View
              style={[
                styles.methodRadio,
                paymentMethod === 'wallet' && styles.methodRadioActive,
              ]}
            />
            <View style={styles.methodIconLabel}>
              <Feather name="dollar-sign" size={16} color={colors.primary} />
              <Text style={styles.methodLabel}>Wallet Balance</Text>
            </View>
            <Text style={styles.methodDetail}>Available: ₮500,000</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === 'points' && styles.methodCardActive,
            ]}
            onPress={() => setPaymentMethod('points')}
          >
            <View
              style={[
                styles.methodRadio,
                paymentMethod === 'points' && styles.methodRadioActive,
              ]}
            />
            <View style={styles.methodIconLabel}>
              <Feather name="star" size={16} color={colors.primary} />
              <Text style={styles.methodLabel}>Partial with Points</Text>
            </View>
            <Text style={styles.methodDetail}>5,000 pts = ₮50,000 off</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{getPaymentMethodLabel()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Amount</Text>
            <Text style={[styles.summaryValue, { fontWeight: '700' }]}>
              {formatPrice(selectedAmount)}
            </Text>
          </View>

          {paymentOption === 'early_full' && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Early Repayment Discount</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                  -{formatPrice(paymentAmounts.discount_early)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, selectedAmount <= 0 && styles.confirmButtonDisabled]}
          onPress={handlePayment}
          disabled={selectedAmount <= 0}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.loanPrimary,
    marginLeft: spacing.xs,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  loanSelector: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
    ...shadow.sm,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  loanMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  loanAmount: {
    alignItems: 'flex-end',
  },
  loanAmountLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  loanAmountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.loanPrimary,
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
  optionCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.loanPrimary,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: spacing.md,
  },
  radioButtonActive: {
    borderColor: colors.loanPrimary,
    backgroundColor: colors.loanPrimary,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  optionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.lg,
  },
  earlyRepaymentInfo: {
    flex: 1,
  },
  earlyRepaymentDiscount: {
    fontSize: 11,
    fontWeight: '500',
    color: '#10B981',
    marginTop: spacing.xs,
  },
  discountedAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  customInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.loanPrimary,
    marginLeft: spacing.lg,
  },
  bonusBadge: {
    backgroundColor: '#FFFAEB',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bonusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.loyaltyPrimary,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  methodCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.loanPrimary,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: spacing.md,
  },
  methodRadioActive: {
    borderColor: colors.loanPrimary,
    backgroundColor: colors.loanPrimary,
  },
  methodIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  methodDetail: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E0F2FE',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.md,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PaymentScreen;
