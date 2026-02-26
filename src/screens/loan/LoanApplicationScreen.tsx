import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LoanApplication'>;

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

interface ProcessingStep {
  label: string;
  completed: boolean;
}

const LoanApplicationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loanAmount, setLoanAmount] = useState(route.params?.amount || 1_500_000);
  const [loanTerm, setLoanTerm] = useState(route.params?.term || 6);
  const [loanPurpose, setLoanPurpose] = useState('Purchase product');
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { label: 'Verifying identity...', completed: false },
    { label: 'Checking credit history...', completed: false },
    { label: 'Evaluating loyalty data...', completed: false },
    { label: 'Finalizing decision...', completed: false },
  ]);

  const monthlyRate = getInterestRateByTier(user?.loyaltyTier);
  const monthlyPayment = Math.round(
    calculateMonthlyPayment(loanAmount, monthlyRate, loanTerm)
  );

  // Calculate first payment date
  const getFirstPaymentDate = () => {
    const today = new Date();
    let firstPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, 28);
    if (firstPaymentDate < today) {
      firstPaymentDate = new Date(today.getFullYear(), today.getMonth() + 2, 28);
    }
    return firstPaymentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (step === 3) {
      // Start processing animation
      processingSteps.forEach((_, index) => {
        setTimeout(() => {
          setProcessingSteps((prev) => {
            const updated = [...prev];
            updated[index].completed = true;
            return updated;
          });
        }, (index + 1) * 1000);
      });
    }
  }, [step]);

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - navigate back
      navigation.navigate('LoanHome');
    }
  };

  const handlePurposeChange = (purpose: string) => {
    setLoanPurpose(purpose);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNum) => (
        <View key={stepNum} style={styles.stepDotContainer}>
          <View
            style={[
              styles.stepDot,
              stepNum === step && styles.stepDotActive,
              stepNum < step && styles.stepDotCompleted,
            ]}
          >
            {stepNum < step && <Feather name="check" size={16} color="#FFFFFF" />}
            {stepNum === step && <Text style={styles.stepDotNumber}>{stepNum}</Text>}
            {stepNum > step && <Text style={styles.stepDotNumber}>{stepNum}</Text>}
          </View>
          {stepNum < 3 && <View style={styles.stepLine} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
      <Text style={styles.stepTitle}>Loan Amount & Term</Text>
      <Text style={styles.stepDescription}>
        Review your loan details. You can adjust the amount and term if needed.
      </Text>

      {/* Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Loan Amount</Text>
        <View style={styles.amountBox}>
          <Text style={styles.amountText}>{formatPrice(loanAmount)}</Text>
        </View>
      </View>

      {/* Term Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Loan Term</Text>
        <View style={styles.termBox}>
          <Text style={styles.termText}>{loanTerm} months</Text>
        </View>
      </View>

      {/* Purpose Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Loan Purpose</Text>
        <TouchableOpacity
          style={[
            styles.purposeOption,
            loanPurpose === 'Purchase product' && styles.purposeOptionActive,
          ]}
          onPress={() => handlePurposeChange('Purchase product')}
        >
          <Text style={styles.purposeText}>Purchase product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.purposeOption,
            loanPurpose === 'General credit' && styles.purposeOptionActive,
          ]}
          onPress={() => handlePurposeChange('General credit')}
        >
          <Text style={styles.purposeText}>General credit</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Payment Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>Monthly Payment</Text>
        <Text style={styles.previewValue}>{formatPrice(monthlyPayment)}</Text>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
      <Text style={styles.stepTitle}>Identity Verification</Text>
      <Text style={styles.stepDescription}>
        Your identity will be verified through DAN.mn system.
      </Text>

      {user?.danVerified ? (
        <View style={styles.verifiedCard}>
          <Feather name="check-circle" size={48} color="#10B981" />
          <Text style={styles.verifiedTitle}>Identity Confirmed</Text>
          <View style={styles.verifiedInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>
                {user?.id ? `${user.id.substring(0, 2)}****${user.id.substring(8)}` : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, { color: '#10B981' }]}>Verified</Text>
            </View>
          </View>
          <Text style={styles.autoVerifyText}>
            You will be automatically approved based on your verified identity and credit history.
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify via DAN.mn</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
      {processingSteps.every((s) => s.completed) ? (
        // Approval Screen
        <View style={styles.approvalContainer}>
          <Feather name="award" size={48} color={colors.loyaltyPrimary} />
          <Text style={styles.approvalTitle}>Congratulations!</Text>
          <Text style={styles.approvalSubtitle}>Your loan has been approved</Text>

          <View style={styles.approvalCard}>
            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>Loan Amount</Text>
              <Text style={styles.approvalValue}>{formatPrice(loanAmount)}</Text>
            </View>
            <View style={styles.approvalDivider} />
            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>Interest Rate</Text>
              <Text style={styles.approvalValue}>
                {(monthlyRate * 100).toFixed(1)}%/mo ({user?.loyaltyTier} discount)
              </Text>
            </View>
            <View style={styles.approvalDivider} />
            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>Monthly Payment</Text>
              <Text style={styles.approvalValue}>{formatPrice(monthlyPayment)}</Text>
            </View>
            <View style={styles.approvalDivider} />
            <View style={styles.approvalRow}>
              <Text style={styles.approvalLabel}>First Payment</Text>
              <Text style={styles.approvalValue}>{getFirstPaymentDate()}</Text>
            </View>
          </View>

          <View style={styles.bonusCard}>
            <Feather name="star" size={20} color={colors.loyaltyPrimary} />
            <Text style={styles.bonusText}>+200 pts earned!</Text>
          </View>
        </View>
      ) : (
        // Processing Screen
        <View style={styles.processingContainer}>
          <Text style={styles.processingTitle}>Processing Your Application</Text>
          <Text style={styles.processingSubtitle}>
            Please wait while we verify your information...
          </Text>

          <View style={styles.stepsList}>
            {processingSteps.map((s, index) => (
              <View key={index} style={styles.processingStep}>
                <View
                  style={[
                    styles.processingIcon,
                    s.completed && styles.processingIconCompleted,
                  ]}
                >
                  {s.completed ? (
                    <Feather name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <ActivityIndicator size="small" color={colors.loanPrimary} />
                  )}
                </View>
                <Text style={[styles.processingLabel, s.completed && styles.processingLabelCompleted]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <View style={styles.contentContainer}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>

      {/* Continue Button */}
      {!(step === 3 && processingSteps.every((s) => s.completed)) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>
              {step === 3 ? 'Go to Loan Dashboard' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Go to Dashboard Button (shown after approval) */}
      {step === 3 && processingSteps.every((s) => s.completed) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('LoanHome')}>
            <Text style={styles.continueButtonText}>Go to Loan Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: '#F9FAFB',
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepDotActive: {
    backgroundColor: colors.loanPrimary,
    borderColor: colors.loanPrimary,
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepDotNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.sm,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  stepContent: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  amountBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.loanPrimary,
  },
  termBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
  },
  termText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.loanPrimary,
  },
  purposeOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#F3F4F6',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  purposeOptionActive: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.loanPrimary,
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  previewCard: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E0F2FE',
    marginBottom: spacing.xs,
  },
  previewValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: spacing.lg,
  },
  verifiedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  verifiedInfo: {
    width: '100%',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  autoVerifyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  processingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  stepsList: {
    width: '100%',
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  processingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  processingIconCompleted: {
    backgroundColor: '#10B981',
  },
  processingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  processingLabelCompleted: {
    color: colors.primary,
    fontWeight: '700',
  },
  approvalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  approvalIconContainer: {
    marginBottom: spacing.md,
  },
  approvalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  approvalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: spacing.lg,
  },
  approvalCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
    marginBottom: spacing.lg,
  },
  approvalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  approvalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  approvalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  approvalDivider: {
    height: 1,
    backgroundColor: '#E0F2FE',
  },
  bonusCard: {
    backgroundColor: '#FFFAEB',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  continueButton: {
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.md,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LoanApplicationScreen;
