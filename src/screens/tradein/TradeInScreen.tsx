import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Animated,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius } from '../../styles/spacing';
import {
  brandOptions,
  storageOptions,
  conditionOptions,
  screenOptions,
  batteryOptions,
  mockAutoDetectResult,
  calculateTradeInValue,
} from '../../data/tradeInData';
import type { TradeInSpecs, TradeInEstimate } from '../../data/tradeInData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type ViewState = 'options' | 'manual' | 'detecting' | 'detected' | 'result';

// ─── Picker Component ──────────────────────────────────────
interface OptionPickerProps {
  label: string;
  options: { value: string; label: string; description?: string }[] | string[];
  selected: string;
  onSelect: (value: string) => void;
}

const OptionPicker: React.FC<OptionPickerProps> = ({ label, options, selected, onSelect }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.optionGrid}>
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const display = typeof opt === 'string' ? opt : opt.label;
        const isSelected = selected === value;
        return (
          <Pressable
            key={value}
            style={[styles.optionChip, isSelected && styles.optionChipSelected]}
            onPress={() => onSelect(value)}
          >
            <Text style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
              {display}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

// ─── Main Component ─────────────────────────────────────────
export const TradeInScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [view, setView] = useState<ViewState>('options');
  const [estimate, setEstimate] = useState<TradeInEstimate | null>(null);

  // Manual form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('');
  const [condition, setCondition] = useState('');
  const [screenCond, setScreenCond] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');

  // Auto-detect animation
  const detectProgress = useRef(new Animated.Value(0)).current;
  const [detectedSpecs, setDetectedSpecs] = useState<TradeInSpecs | null>(null);

  const handleBack = () => {
    if (view === 'options') {
      navigation.goBack();
    } else if (view === 'result') {
      setView('options');
      setEstimate(null);
    } else {
      setView('options');
    }
  };

  const isManualFormValid =
    brand !== '' && model.trim() !== '' && storage !== '' &&
    condition !== '' && screenCond !== '' && batteryHealth !== '';

  const handleManualEstimate = () => {
    const specs: TradeInSpecs = {
      brand,
      model: model.trim(),
      storage,
      condition: condition as TradeInSpecs['condition'],
      screenCondition: screenCond as TradeInSpecs['screenCondition'],
      batteryHealth: batteryHealth as TradeInSpecs['batteryHealth'],
    };
    setEstimate(calculateTradeInValue(specs));
    setView('result');
  };

  const handleAutoDetect = () => {
    setView('detecting');
    detectProgress.setValue(0);
    Animated.timing(detectProgress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      setDetectedSpecs(mockAutoDetectResult);
      setView('detected');
    });
  };

  const handleConfirmDetected = () => {
    if (detectedSpecs) {
      setEstimate(calculateTradeInValue(detectedSpecs));
      setView('result');
    }
  };

  const viewTitle: Record<ViewState, string> = {
    options: 'Trade-In Your Device',
    manual: 'Enter Device Specs',
    detecting: 'Detecting Device...',
    detected: 'Device Detected',
    result: 'Trade-In Estimate',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>{viewTitle[view]}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── OPTIONS VIEW ── */}
        {view === 'options' && (
          <>
            {/* Illustration area */}
            <View style={styles.heroSection}>
              <View style={styles.heroIconCircle}>
                <Feather name="refresh-cw" size={40} color={colors.primary} />
              </View>
              <Text style={styles.heroTitle}>Get Value for Your Old Device</Text>
              <Text style={styles.heroSubtitle}>
                Trade in your current phone and get credit toward your next purchase
              </Text>
            </View>

            {/* Option 1: Manual */}
            <Pressable
              style={({ pressed }) => [styles.optionCard, pressed && { opacity: 0.85 }]}
              onPress={() => setView('manual')}
            >
              <View style={[styles.optionIconCircle, { backgroundColor: colors.primary50 }]}>
                <Feather name="edit-3" size={24} color={colors.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Enter Specs Manually</Text>
                <Text style={styles.optionDesc}>Fill in your device details to get an estimate</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.onSurfaceVariant} />
            </Pressable>

            {/* Option 2: Auto-Detect */}
            <Pressable
              style={({ pressed }) => [styles.optionCard, pressed && { opacity: 0.85 }]}
              onPress={handleAutoDetect}
            >
              <View style={[styles.optionIconCircle, { backgroundColor: colors.loanSecondary }]}>
                <Feather name="smartphone" size={24} color={colors.loanPrimary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Auto-Detect Device</Text>
                <Text style={styles.optionDesc}>We'll read your phone's specs automatically</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.onSurfaceVariant} />
            </Pressable>

            {/* How it works */}
            <View style={styles.howItWorks}>
              <Text style={styles.howTitle}>How It Works</Text>
              {[
                { step: '1', icon: 'send' as const, text: 'Send your device specs' },
                { step: '2', icon: 'dollar-sign' as const, text: 'Get an instant estimate' },
                { step: '3', icon: 'map-pin' as const, text: 'Visit a store for final price' },
              ].map((item) => (
                <View key={item.step} style={styles.howStep}>
                  <View style={styles.howStepNum}>
                    <Text style={styles.howStepNumText}>{item.step}</Text>
                  </View>
                  <Feather name={item.icon} size={18} color={colors.onSurfaceSecondary} />
                  <Text style={styles.howStepText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── MANUAL FORM VIEW ── */}
        {view === 'manual' && (
          <>
            <OptionPicker
              label="Brand"
              options={brandOptions}
              selected={brand}
              onSelect={setBrand}
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Model Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Galaxy S23 Ultra"
                placeholderTextColor={colors.onSurfaceMuted}
                value={model}
                onChangeText={setModel}
              />
            </View>

            <OptionPicker
              label="Storage"
              options={storageOptions}
              selected={storage}
              onSelect={setStorage}
            />

            <OptionPicker
              label="Overall Condition"
              options={conditionOptions}
              selected={condition}
              onSelect={setCondition}
            />

            <OptionPicker
              label="Screen Condition"
              options={screenOptions}
              selected={screenCond}
              onSelect={setScreenCond}
            />

            <OptionPicker
              label="Battery Health"
              options={batteryOptions}
              selected={batteryHealth}
              onSelect={setBatteryHealth}
            />

            <Pressable
              style={[styles.primaryBtn, !isManualFormValid && styles.primaryBtnDisabled]}
              onPress={handleManualEstimate}
              disabled={!isManualFormValid}
            >
              <Feather name="dollar-sign" size={18} color={colors.white} />
              <Text style={styles.primaryBtnText}>Get Estimate</Text>
            </Pressable>
          </>
        )}

        {/* ── DETECTING VIEW ── */}
        {view === 'detecting' && (
          <View style={styles.detectingContainer}>
            <View style={styles.detectIconCircle}>
              <Feather name="smartphone" size={48} color={colors.loanPrimary} />
            </View>
            <Text style={styles.detectTitle}>Scanning Your Device...</Text>
            <Text style={styles.detectSubtitle}>
              Reading hardware specs, battery health, and storage info
            </Text>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: detectProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.detectChecklist}>
              {['Hardware info', 'Storage capacity', 'Battery health', 'Screen condition'].map(
                (item, i) => (
                  <DetectCheckItem key={item} label={item} progress={detectProgress} index={i} />
                )
              )}
            </View>
          </View>
        )}

        {/* ── DETECTED VIEW ── */}
        {view === 'detected' && detectedSpecs && (
          <>
            <View style={styles.detectedCard}>
              <View style={styles.detectedIconRow}>
                <View style={styles.detectedIconCircle}>
                  <Feather name="check-circle" size={28} color={colors.success} />
                </View>
                <Text style={styles.detectedLabel}>Device Identified</Text>
              </View>
              <Text style={styles.detectedModel}>
                {detectedSpecs.brand} {detectedSpecs.model}
              </Text>

              <View style={styles.specGrid}>
                <SpecChip icon="hard-drive" label="Storage" value={detectedSpecs.storage} />
                <SpecChip icon="battery" label="Battery" value={batteryOptions.find(b => b.value === detectedSpecs.batteryHealth)?.label ?? detectedSpecs.batteryHealth} />
                <SpecChip icon="monitor" label="Screen" value={screenOptions.find(s => s.value === detectedSpecs.screenCondition)?.label ?? detectedSpecs.screenCondition} />
                <SpecChip icon="star" label="Condition" value={conditionOptions.find(c => c.value === detectedSpecs.condition)?.label ?? detectedSpecs.condition} />
              </View>
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleConfirmDetected}>
              <Feather name="dollar-sign" size={18} color={colors.white} />
              <Text style={styles.primaryBtnText}>Confirm & Get Estimate</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryBtn}
              onPress={() => {
                // Pre-fill manual form with detected specs
                setBrand(detectedSpecs.brand);
                setModel(detectedSpecs.model);
                setStorage(detectedSpecs.storage);
                setCondition(detectedSpecs.condition);
                setScreenCond(detectedSpecs.screenCondition);
                setBatteryHealth(detectedSpecs.batteryHealth);
                setView('manual');
              }}
            >
              <Feather name="edit-3" size={18} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Edit Specs Manually</Text>
            </Pressable>
          </>
        )}

        {/* ── RESULT VIEW ── */}
        {view === 'result' && estimate && (
          <>
            {/* Value Card */}
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Estimated Trade-In Value</Text>
              <Text style={styles.resultValue}>
                {'\u20AE'}{estimate.totalEstimate.toLocaleString()}
              </Text>
              <View style={styles.resultDeviceRow}>
                <Feather name="smartphone" size={16} color={colors.onSurfaceSecondary} />
                <Text style={styles.resultDeviceName}>
                  {estimate.specs.brand} {estimate.specs.model}
                </Text>
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Value Breakdown</Text>
              <BreakdownRow label="Base value" value={estimate.baseValue} />
              <BreakdownRow label={`Condition (${(estimate.conditionMultiplier * 100).toFixed(0)}%)`} value={Math.round(estimate.baseValue * estimate.conditionMultiplier) - estimate.baseValue} />
              <BreakdownRow label="Storage bonus" value={estimate.storageBonus} />
              <BreakdownRow label="Battery adjustment" value={estimate.batteryAdjustment} />
              <BreakdownRow label="Screen adjustment" value={estimate.screenAdjustment} />
              <View style={styles.breakdownDivider} />
              <BreakdownRow label="Total estimate" value={estimate.totalEstimate} bold />
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerCard}>
              <Feather name="info" size={16} color={colors.info} />
              <Text style={styles.disclaimerText}>
                This is a preliminary estimate. The final trade-in value will be determined after a physical examination at your nearest Technozone store.
              </Text>
            </View>

            {/* Actions */}
            <Pressable style={styles.primaryBtn} onPress={() => navigation.goBack()}>
              <Feather name="shopping-bag" size={18} color={colors.white} />
              <Text style={styles.primaryBtnText}>Use for Purchase</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
              <Feather name="map-pin" size={18} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Find Nearest Store</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Sub-Components ──────────────────────────────────────────

const DetectCheckItem: React.FC<{
  label: string;
  progress: Animated.Value;
  index: number;
}> = ({ label, progress, index }) => {
  const opacity = progress.interpolate({
    inputRange: [index * 0.25, (index + 1) * 0.25],
    outputRange: [0.3, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.checkItem, { opacity }]}>
      <Feather name="check" size={16} color={colors.success} />
      <Text style={styles.checkItemText}>{label}</Text>
    </Animated.View>
  );
};

const SpecChip: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.specChip}>
    <Feather name={icon as any} size={14} color={colors.onSurfaceVariant} />
    <View>
      <Text style={styles.specChipLabel}>{label}</Text>
      <Text style={styles.specChipValue}>{value}</Text>
    </View>
  </View>
);

const BreakdownRow: React.FC<{ label: string; value: number; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={styles.breakdownRow}>
    <Text style={[styles.breakdownLabel, bold && styles.breakdownBold]}>{label}</Text>
    <Text style={[
      styles.breakdownValue,
      bold && styles.breakdownBold,
      value > 0 && !bold && styles.breakdownPositive,
      value < 0 && styles.breakdownNegative,
    ]}>
      {value >= 0 ? '+' : ''}{'\u20AE'}{Math.abs(value).toLocaleString()}
    </Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },

  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: spacing.lg,
    paddingBottom: 100,
    gap: spacing.base,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },

  // Option Cards
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.base,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  optionDesc: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
  },

  // How It Works
  howItWorks: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.base,
  },
  howTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  howStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  howStepNumText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '700',
  },
  howStepText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
    flex: 1,
  },

  // Form Fields
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.labelLarge,
    color: colors.onSurface,
    fontWeight: '600',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipSelected: {
    backgroundColor: colors.primary50,
    borderColor: colors.primary,
  },
  optionChipText: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    ...typography.bodyMedium,
    color: colors.onSurface,
  },

  // Buttons
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.onSurfaceMuted,
  },
  primaryBtnText: {
    ...typography.titleMedium,
    color: colors.white,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    ...typography.titleMedium,
    color: colors.primary,
    fontWeight: '600',
  },

  // Detecting
  detectingContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.base,
  },
  detectIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.loanSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detectTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  detectSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  progressBarBg: {
    width: '80%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.loanPrimary,
    borderRadius: 3,
  },
  detectChecklist: {
    marginTop: spacing.xl,
    gap: spacing.md,
    alignSelf: 'stretch',
    paddingHorizontal: spacing['2xl'],
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkItemText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
  },

  // Detected
  detectedCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detectedIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detectedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectedLabel: {
    ...typography.titleMedium,
    color: colors.success,
    fontWeight: '600',
  },
  detectedModel: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specChipLabel: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
  specChipValue: {
    ...typography.labelSmall,
    color: colors.onSurface,
    fontWeight: '600',
  },

  // Result
  resultCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultLabel: {
    ...typography.labelMedium,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  resultDeviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  resultDeviceName: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
  },

  // Breakdown
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  breakdownTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
  },
  breakdownValue: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '500',
  },
  breakdownBold: {
    fontWeight: '700',
    color: colors.onSurface,
  },
  breakdownPositive: {
    color: colors.success,
  },
  breakdownNegative: {
    color: colors.error,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Disclaimer
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.infoBg,
    borderRadius: radius.lg,
    padding: spacing.base,
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
    flex: 1,
    lineHeight: 18,
  },
});

export default TradeInScreen;
