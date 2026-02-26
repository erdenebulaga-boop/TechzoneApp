import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getProductById } from '../../data/products';
import { getRegionById, getClosestStore, getShippingForRegion, getStoresForRegion } from '../../data/locations';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius } from '../../styles/spacing';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NavigationProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const cartStore = useCartStore();
  const { selectedRegionId } = useAuthStore();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Location-based data
  const currentRegion = getRegionById(selectedRegionId);
  const closestStore = getClosestStore(selectedRegionId);
  const shipping = getShippingForRegion(selectedRegionId);

  const product = getProductById(route.params.productId);

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={styles.headerBtn}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="chevron-left" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>
          <Pressable
            onPress={() => navigation.navigate('Cart')}
            hitSlop={8}
            style={styles.headerBtn}
            accessibilityLabel="Open cart"
            accessibilityRole="button"
          >
            <Feather name="shopping-cart" size={24} color={colors.onSurface} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={colors.onSurfaceMuted} />
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </View>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const loyaltyPoints = Math.floor(product.price / 100);

  const handleAddToCart = () => {
    cartStore.addItem(product, 1);
  };

  const handleBuyWithLoan = () => {
    navigation.navigate('LoanCalculator', { productPrice: product.price });
  };

  const handleVariantSelect = (variantLabel: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantLabel]: option,
    }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={styles.headerBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <Pressable
          onPress={() => navigation.navigate('Cart')}
          hitSlop={8}
          style={styles.headerBtn}
          accessibilityLabel="Open cart"
          accessibilityRole="button"
        >
          <Feather name="shopping-cart" size={24} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image */}
        <View style={styles.imageSection}>
          <View
            style={styles.imagePlaceholder}
            accessibilityRole="image"
            accessibilityLabel={`Image of ${product.name}`}
          >
            <Feather name="image" size={48} color={colors.onSurfaceMuted} />
            <Text style={styles.imagePlaceholderText}>{product.name}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          {/* Brand */}
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.productNameText}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              {'\u20AE'}{product.price.toLocaleString()}
            </Text>
            {product.originalPrice != null && (
              <>
                <Text style={styles.originalPriceText}>
                  {'\u20AE'}{product.originalPrice.toLocaleString()}
                </Text>
                {discountPercent > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Status badges */}
          {product.badges && product.badges.length > 0 && (
            <View style={styles.badgesRow}>
              {product.badges.map((badge, idx) => (
                <View key={idx} style={styles.badgeTag}>
                  <Text style={styles.badgeTagText}>{badge}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stock */}
          <View style={styles.stockRow}>
            <Feather
              name={product.inStock ? 'check-circle' : 'x-circle'}
              size={14}
              color={product.inStock ? colors.success : colors.error}
            />
            <Text style={[styles.stockText, { color: product.inStock ? colors.success : colors.error }]}>
              {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color={colors.loyaltyPrimary} />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCountText}>({product.reviewCount} reviews)</Text>
          </View>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <View style={styles.variantsSection}>
              {product.variants.map((variantGroup, gIdx) => (
                <View key={gIdx} style={styles.variantGroup}>
                  <Text style={styles.variantLabelText}>{variantGroup.label}</Text>
                  <View style={styles.variantChipsRow}>
                    {variantGroup.options.map((option, oIdx) => {
                      const isSelected =
                        selectedVariants[variantGroup.label] === option ||
                        (oIdx === 0 && !selectedVariants[variantGroup.label]);
                      return (
                        <Pressable
                          key={oIdx}
                          style={({ pressed }) => [
                            styles.variantChip,
                            isSelected && styles.variantChipSelected,
                            pressed && { opacity: 0.7 },
                          ]}
                          onPress={() => handleVariantSelect(variantGroup.label, option)}
                          accessibilityLabel={`Select ${variantGroup.label} ${option}`}
                          accessibilityRole="radio"
                          accessibilityState={{ selected: isSelected }}
                        >
                          <Text
                            style={[
                              styles.variantChipText,
                              isSelected && styles.variantChipTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {product.description ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          ) : null}

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <View style={styles.specsSection}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsTable}>
                {Object.entries(product.specs).map(([label, value], idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.specRow,
                      idx !== Object.entries(product.specs!).length - 1 && styles.specRowBorder,
                    ]}
                  >
                    <Text style={styles.specLabel}>{label}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Loyalty points */}
          <View style={styles.pointsSection}>
            <View style={styles.pointsIconWrap}>
              <Feather name="award" size={18} color={colors.loyaltyPrimary} />
            </View>
            <View>
              <Text style={styles.pointsLabel}>Loyalty points earned with this purchase</Text>
              <Text style={styles.pointsValue}>+{loyaltyPoints.toLocaleString()} pts</Text>
            </View>
          </View>

          {/* Store & Shipping info */}
          <View style={styles.storeShippingCard}>
            <View style={styles.storeShippingRow}>
              <View style={styles.storeShippingIconCircle}>
                <Feather name="map-pin" size={16} color={colors.accent} />
              </View>
              <View style={styles.storeShippingInfo}>
                {closestStore ? (
                  <>
                    <Text style={styles.storeShippingLabel}>Closest store in {currentRegion.nameEn}</Text>
                    <Text style={styles.storeShippingValue}>{closestStore.name}</Text>
                    <Text style={styles.storeShippingDetail}>{closestStore.address}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.storeShippingLabel}>No stores in {currentRegion.nameEn}</Text>
                    <Text style={styles.storeShippingValue}>Ships from Ulaanbaatar warehouse</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.storeShippingDivider} />

            <View style={styles.storeShippingRow}>
              <View style={[styles.storeShippingIconCircle, { backgroundColor: colors.loanSecondary }]}>
                <Feather name="truck" size={16} color={colors.loanPrimary} />
              </View>
              <View style={styles.storeShippingInfo}>
                <Text style={styles.storeShippingLabel}>Delivery to {currentRegion.nameEn}</Text>
                <Text style={styles.storeShippingValue}>
                  {shipping.estimatedDaysMin}–{shipping.estimatedDaysMax} business days
                </Text>
                <Text style={styles.storeShippingDetail}>
                  Shipping: ₮{shipping.costMNT.toLocaleString()}
                  {product.price >= shipping.freeShippingThreshold
                    ? '  (Free for this item)'
                    : `  (Free over ₮${(shipping.freeShippingThreshold / 1000).toFixed(0)}K)`}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>

      {/* Action bar — respects home indicator */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.addToCartButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleAddToCart}
          accessibilityLabel="Add product to cart"
          accessibilityRole="button"
        >
          <Feather name="shopping-cart" size={18} color={colors.white} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>

        {product.loanAvailable && (
          <Pressable
            style={({ pressed }) => [
              styles.loanButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleBuyWithLoan}
            accessibilityLabel="Buy with loan option"
            accessibilityRole="button"
          >
            <Feather name="credit-card" size={18} color={colors.white} />
            <Text style={styles.loanButtonText}>Buy with Loan</Text>
          </Pressable>
        )}
      </View>
    </View>
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    ...typography.titleLarge,
    color: colors.onSurface,
    marginHorizontal: spacing.sm,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 140,
  },

  // Image
  imageSection: {
    height: 280,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  imagePlaceholderText: {
    ...typography.titleMedium,
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
  },

  // Content
  contentSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  brandText: {
    ...typography.labelMedium,
    color: colors.onSurfaceSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productNameText: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  originalPriceText: {
    ...typography.bodyLarge,
    color: colors.onSurfaceMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  discountBadgeText: {
    ...typography.labelSmall,
    fontWeight: '700',
    color: colors.white,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  badgeTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeTagText: {
    ...typography.labelSmall,
    fontWeight: '500',
    color: colors.onSurface,
  },

  // Stock
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stockText: {
    ...typography.labelMedium,
    fontWeight: '600',
  },

  // Rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  ratingText: {
    ...typography.labelLarge,
    fontWeight: '700',
    color: colors.onSurface,
  },
  reviewCountText: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },

  // Variants
  variantsSection: {
    marginBottom: spacing.lg,
  },
  variantGroup: {
    marginBottom: spacing.md,
  },
  variantLabelText: {
    ...typography.labelLarge,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  variantChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  variantChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  variantChipText: {
    ...typography.labelMedium,
    color: colors.onSurfaceSecondary,
  },
  variantChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },

  // Description
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  descriptionText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
    lineHeight: 22,
  },

  // Specs
  specsSection: {
    marginBottom: spacing.lg,
  },
  specsTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  specRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  specLabel: {
    flex: 0.4,
    ...typography.labelMedium,
    fontWeight: '600',
    color: colors.onSurface,
  },
  specValue: {
    flex: 0.6,
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
  },

  // Points
  pointsSection: {
    backgroundColor: colors.loyaltySecondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pointsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsLabel: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
    marginBottom: 2,
  },
  pointsValue: {
    ...typography.titleMedium,
    fontWeight: '700',
    color: colors.loyaltyPrimary,
  },

  // Store & Shipping card
  storeShippingCard: {
    marginTop: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.base,
  },
  storeShippingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  storeShippingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  storeShippingInfo: {
    flex: 1,
  },
  storeShippingLabel: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  storeShippingValue: {
    ...typography.bodyMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  storeShippingDetail: {
    ...typography.bodySmall,
    color: colors.onSurfaceSecondary,
    marginTop: 2,
  },
  storeShippingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 52,
  },
  addToCartText: {
    color: colors.white,
    ...typography.labelLarge,
    fontWeight: '700',
  },
  loanButton: {
    flex: 1,
    backgroundColor: colors.loanPrimary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 52,
  },
  loanButtonText: {
    color: colors.white,
    ...typography.labelLarge,
    fontWeight: '700',
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: {
    ...typography.titleMedium,
    color: colors.onSurfaceVariant,
  },
});

export default ProductDetailScreen;
