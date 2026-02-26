import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getRegionById, getShippingForRegion, getClosestStore } from '../../data/locations';
import { colors } from '../../styles/colors';

type CheckoutScreenNavigationProp = NavigationProp<RootStackParamList, 'Checkout'>;

const { width } = Dimensions.get('window');

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('home');
  const [paymentMethod, setPaymentMethod] = useState('full');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const subtotal = cartStore.subtotal();
  const regionId = authStore.selectedRegionId;
  const currentRegion = getRegionById(regionId);
  const shippingConfig = getShippingForRegion(regionId);
  const closestStore = getClosestStore(regionId);
  const isFreeShipping = subtotal >= shippingConfig.freeShippingThreshold;
  const deliveryFee = deliveryMethod === 'home' ? (isFreeShipping ? 0 : shippingConfig.costMNT) : 0;
  const total = subtotal + deliveryFee;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePlaceOrder = () => {
    if (termsAccepted && policyAccepted) {
      navigation.navigate('OrderConfirmation', {});
    } else {
      alert('Please accept all terms and conditions');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View
        style={[
          styles.stepDot,
          currentStep >= 1 && styles.stepDotActive,
        ]}
      />
      <View
        style={[
          styles.stepLine,
          currentStep >= 2 && styles.stepLineActive,
        ]}
      />
      <View
        style={[
          styles.stepDot,
          currentStep >= 2 && styles.stepDotActive,
        ]}
      />
      <View
        style={[
          styles.stepLine,
          currentStep >= 3 && styles.stepLineActive,
        ]}
      />
      <View
        style={[
          styles.stepDot,
          currentStep >= 3 && styles.stepDotActive,
        ]}
      />
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Delivery Method</Text>

      <TouchableOpacity
        style={[
          styles.optionCard,
          deliveryMethod === 'home' && styles.optionCardActive,
        ]}
        onPress={() => setDeliveryMethod('home')}
      >
        <View style={styles.radioButton}>
          {deliveryMethod === 'home' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Home Delivery to {currentRegion.nameEn}</Text>
          <Text style={styles.optionPrice}>
            {isFreeShipping ? 'Free' : `₮${shippingConfig.costMNT.toLocaleString()}`}
          </Text>
          <Text style={styles.optionDescription}>
            Delivery in {shippingConfig.estimatedDaysMin}–{shippingConfig.estimatedDaysMax} business days
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          deliveryMethod === 'pickup' && styles.optionCardActive,
        ]}
        onPress={() => setDeliveryMethod('pickup')}
      >
        <View style={styles.radioButton}>
          {deliveryMethod === 'pickup' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Click & Collect</Text>
          <Text style={styles.optionPrice}>Free</Text>
          <Text style={styles.optionDescription}>
            Pick up at {closestStore ? closestStore.name : 'Баянзүрх салбар (UB)'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.addressCard}>
        <Text style={styles.addressTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>{authStore.user?.address || `123 Peace Avenue, ${currentRegion.nameEn}`}</Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Method</Text>

      <TouchableOpacity
        style={[
          styles.optionCard,
          paymentMethod === 'full' && styles.optionCardActive,
        ]}
        onPress={() => setPaymentMethod('full')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'full' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Full Payment</Text>
          <Text style={styles.optionPrice}>₮{subtotal.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          paymentMethod === 'loan' && styles.optionCardActive,
        ]}
        onPress={() => setPaymentMethod('loan')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'loan' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>NBFI Loan</Text>
          <Text style={styles.optionPrice}>₮{(subtotal / 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo × 12 months</Text>
          <Text style={styles.optionDescription}>Gold = 1.0%/month</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          paymentMethod === 'points' && styles.optionCardActive,
        ]}
        onPress={() => setPaymentMethod('points')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'points' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Pay with Points</Text>
          <Text style={styles.optionPrice}>{authStore.user?.loyaltyPoints || 0} pts available</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          paymentMethod === 'card' && styles.optionCardActive,
        ]}
        onPress={() => setPaymentMethod('card')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'card' && <View style={styles.radioDot} />}
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>QPay Card</Text>
          <Text style={styles.optionPrice}>Secure payment</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review Order</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items</Text>
          <Text style={styles.summaryValue}>₮{subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>₮{deliveryFee.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.summaryLabelTotal}>Total</Text>
          <Text style={styles.summaryValueTotal}>₮{total.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.checkboxSection}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Feather name="check" size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setPolicyAccepted(!policyAccepted)}
        >
          <View style={[styles.checkbox, policyAccepted && styles.checkboxChecked]}>
            {policyAccepted && <Feather name="check" size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Feather name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 50 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.stickyBottom}>
        {currentStep < 3 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Continue to Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F8FF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 11,
    color: '#888888',
  },
  addressCard: {
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginTop: 12,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#666666',
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
  },
  summaryLabelTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  summaryValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  checkboxSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  placeOrderButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
