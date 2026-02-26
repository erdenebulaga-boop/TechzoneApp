import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SimpleSlider } from '../../components/common/SimpleSlider';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';

type CartScreenNavigationProp = NavigationProp<RootStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const [pointsUsed, setPointsUsed] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const items = cartStore.items;
  const subtotal = cartStore.subtotal();
  const pointsDiscount = pointsUsed * 10;
  const deliveryFee = subtotal > 0 ? 10000 : 0;
  const total = subtotal - pointsDiscount + deliveryFee;
  const maxPoints = Math.min(
    authStore.loyalty?.points || 0,
    Math.floor(subtotal / 10)
  );
  const pointsToEarn = Math.floor(subtotal / 100);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      cartStore.removeItem(productId);
    } else {
      cartStore.updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout', {});
  };

  const renderCartItem = ({ item }: { item: typeof items[0] }) => {
    const product = item.product;
    if (!product) return null;

    return (
      <View style={styles.cartItem}>
        <View style={styles.itemImage}>
          <Image source={{ uri: product.image }} style={styles.itemImg} />
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.itemPrice}>{'\u20AE'}{product.price.toLocaleString()}</Text>
        </View>

        <View style={styles.quantityControl}>
          <Pressable
            onPress={() => handleQuantityChange(product.id, item.quantity - 1)}
            style={({ pressed }) => [styles.qtyBtn, pressed && { backgroundColor: colors.border }]}
            accessibilityLabel="Decrease quantity"
            accessibilityRole="button"
          >
            <Feather name="minus" size={16} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <Pressable
            onPress={() => handleQuantityChange(product.id, item.quantity + 1)}
            style={({ pressed }) => [styles.qtyBtn, pressed && { backgroundColor: colors.border }]}
            accessibilityLabel="Increase quantity"
            accessibilityRole="button"
          >
            <Feather name="plus" size={16} color={colors.onSurface} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => cartStore.removeItem(product.id)}
          style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.5 }]}
          accessibilityLabel={`Remove ${product.name} from cart`}
          accessibilityRole="button"
        >
          <Feather name="trash-2" size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyState}>
          <Feather name="shopping-cart" size={56} color={colors.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Start shopping to add items</Text>
          <Pressable
            style={({ pressed }) => [styles.shopBtn, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Continue shopping"
            accessibilityRole="button"
          >
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Cart ({items.length})</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product.id}
          scrollEnabled={false}
          contentContainerStyle={styles.cartList}
        />

        {/* Loyalty Points */}
        <View style={styles.loyaltySection}>
          <View style={styles.loyaltyHeader}>
            <Feather name="star" size={16} color={colors.loyaltyPrimary} />
            <Text style={styles.loyaltyTitle}>Use Loyalty Points</Text>
          </View>
          <Text style={styles.availablePoints}>
            Available: {(authStore.loyalty?.points || 0).toLocaleString()} pts
          </Text>
          <SimpleSlider
            minimumValue={0}
            maximumValue={Math.max(maxPoints, 1)}
            value={pointsUsed}
            step={10}
            onValueChange={(value) => setPointsUsed(Math.floor(value))}
            minimumTrackTintColor={colors.loyaltyPrimary}
            maximumTrackTintColor={colors.border}
          />
          <Text style={styles.pointsInfo}>
            Using {pointsUsed} pts = -{'\u20AE'}{pointsDiscount.toLocaleString()} discount
          </Text>
        </View>

        {/* Points to Earn */}
        <View style={styles.earningSection}>
          <Feather name="trending-up" size={16} color={colors.success} />
          <Text style={styles.earningText}>
            You will earn +{pointsToEarn} points from this purchase
          </Text>
        </View>

        {/* Coupon */}
        <View style={styles.couponSection}>
          <TextInput
            style={styles.couponInput}
            placeholder="Coupon code"
            placeholderTextColor={colors.onSurfaceVariant}
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <Pressable
            style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85 }]}
            accessibilityLabel="Apply coupon code"
            accessibilityRole="button"
          >
            <Text style={styles.applyBtnText}>Apply</Text>
          </Pressable>
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{'\u20AE'}{subtotal.toLocaleString()}</Text>
          </View>
          {pointsDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                -{'\u20AE'}{pointsDiscount.toLocaleString()}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>{'\u20AE'}{deliveryFee.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{'\u20AE'}{total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Checkout Button */}
      <View style={styles.stickyBottom}>
        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, pressed && { opacity: 0.85 }]}
          onPress={handleCheckout}
          accessibilityLabel={`Checkout, total ${total.toLocaleString()} tugrik`}
          accessibilityRole="button"
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Feather name="arrow-right" size={18} color={colors.white} />
        </Pressable>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cartList: {
    padding: 16,
    gap: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurface,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
  },
  shopBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  loyaltySection: {
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  loyaltyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  availablePoints: {
    fontSize: 13,
    color: colors.onSurfaceSecondary,
    marginBottom: 8,
  },
  pointsInfo: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
    marginTop: 4,
  },
  earningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.successBg,
    borderRadius: 10,
  },
  earningText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#166534',
    flex: 1,
  },
  couponSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.onSurface,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  applyBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  summary: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;
