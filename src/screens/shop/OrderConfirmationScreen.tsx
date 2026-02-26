import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getProductById } from '../../data/products';
import { colors } from '../../styles/colors';

type OrderConfirmationScreenNavigationProp = NavigationProp<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Generate order number
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    setOrderNumber(`TZ-2026-${randomNum}`);

    // Calculate points earned
    const subtotal = cartStore.subtotal();
    const earned = Math.floor(subtotal / 100) * 10;
    setPointsEarned(earned);

    // Animate checkmark
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinueShopping = () => {
    cartStore.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Shop' } }],
      })
    );
  };

  const handleTrackOrder = () => {
    cartStore.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      })
    );
    // In a real app, this would navigate to an order tracking screen
    alert(`Tracking order ${orderNumber}`);
  };

  const items = cartStore.items;
  const subtotal = cartStore.subtotal();
  const deliveryFee = 10000;
  const total = subtotal + deliveryFee;
  const pointsTowardNextTier = 7550;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.successSection}>
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.checkmarkCircle}>
              <Feather name="check-circle" size={60} color={colors.success} />
            </View>
          </Animated.View>

          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
        </View>

        <View style={styles.itemsSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
              <View key={item.product.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{'\u20AE'}{(item.product.price * item.quantity).toLocaleString()}</Text>
              </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₮{subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₮{deliveryFee.toLocaleString()}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₮{total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.pointsCelebration}>
          <View style={styles.awardCircle}>
            <Feather name="award" size={40} color={colors.loyaltyPrimary} />
          </View>
          <Text style={styles.pointsEarnedText}>+{pointsEarned} pts</Text>
          <Text style={styles.pointsDescription}>Points earned from this purchase</Text>
        </View>

        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>
            You're {pointsTowardNextTier.toLocaleString()} pts away from Platinum!
          </Text>
        </View>

        <View style={styles.deliveryInfo}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryLabel}>Delivery Address</Text>
            <Text style={styles.deliveryValue}>{authStore.user?.address || '123 Peace Avenue, Ulaanbaatar'}</Text>
            <Text style={styles.deliveryEstimate}>Estimated Delivery: 1-3 business days</Text>
          </View>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Order Confirmation</Text>
              <Text style={styles.stepDescription}>Check your email for order details</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Processing</Text>
              <Text style={styles.stepDescription}>Your order is being prepared</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Shipped</Text>
              <Text style={styles.stepDescription}>You'll get a tracking number</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.stickyBottom}>
        <Pressable
          style={({ pressed }) => [styles.trackButton, pressed && { opacity: 0.85 }]}
          onPress={handleTrackOrder}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.continueButton, pressed && { opacity: 0.85 }]}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  successSection: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
  },
  itemsSummary: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 11,
    color: '#888888',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  pointsCelebration: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    alignItems: 'center',
  },
  awardCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.loyaltyPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsEarnedText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
    marginBottom: 4,
  },
  pointsDescription: {
    fontSize: 12,
    color: colors.loyaltyPrimary,
    fontWeight: '500',
  },
  tierBadge: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.loanPrimary,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.loanPrimary,
  },
  deliveryInfo: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  deliveryCard: {
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  deliveryLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  deliveryEstimate: {
    fontSize: 11,
    color: '#666666',
  },
  nextSteps: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
    marginRight: 12,
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#888888',
  },
  bottomSpacer: {
    height: 20,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default OrderConfirmationScreen;
