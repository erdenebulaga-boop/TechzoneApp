import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../store/authStore';
import { products as allProducts } from '../../data/products';
import { getRegionById, getStoresForRegion, getShippingForRegion } from '../../data/locations';
import { LocationPickerModal } from '../../components/LocationPickerModal';
import { colors, moduleColors, tierColors } from '../../styles/colors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const technozoneLogo = require('../../assets/images/technozone-logo.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PAD = 20;

// ─── Data ────────────────────────────────────────────────
const promotionalBanners = [
  { id: 'flash-sale', title: 'Flash Sale', subtitle: 'Up to 50% off select items', bg: colors.accent, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
  { id: 'new-products', title: 'New Arrivals', subtitle: 'Samsung Galaxy S26 Ultra', bg: '#1B9E77', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80' },
  { id: 'loan-promo', title: '0% Installment', subtitle: 'Pre-approved up to 3M', bg: colors.loanPrimary, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
];

const quickActions = [
  { id: 'loan', label: 'Apply Loan', icon: 'credit-card' as const },
  { id: 'spin', label: 'Daily Spin', icon: 'gift' as const },
  { id: 'gift', label: 'Gift Cards', icon: 'tag' as const },
  { id: 'trade', label: 'Trade-In', icon: 'refresh-cw' as const },
  { id: 'deals', label: 'Deals', icon: 'percent' as const },
];

const categoryList = [
  { id: 'phones', label: 'Phones', icon: 'smartphone' as const },
  { id: 'laptops', label: 'Laptops', icon: 'monitor' as const },
  { id: 'wearables', label: 'Wearables', icon: 'watch' as const },
  { id: 'tv', label: 'TV & Display', icon: 'tv' as const },
  { id: 'audio', label: 'Audio', icon: 'headphones' as const },
  { id: 'accessories', label: 'Accessories', icon: 'package' as const },
];

// ─── Component ───────────────────────────────────────────
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { loyalty, selectedRegionId, hasSelectedLocation } = useAuthStore();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Auto-show location picker on first visit
  useEffect(() => {
    if (!hasSelectedLocation) {
      const timer = setTimeout(() => setShowLocationPicker(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSelectedLocation]);

  const currentRegion = getRegionById(selectedRegionId);
  const regionStores = getStoresForRegion(selectedRegionId);
  const regionShipping = getShippingForRegion(selectedRegionId);

  const flashDealProducts = allProducts.filter(p => p.isFlashDeal);
  const flashDealIds = new Set(flashDealProducts.map(p => p.id));
  const flashDeals = flashDealProducts.slice(0, 5);
  if (flashDeals.length < 5) {
    const fillers = allProducts.filter(p => !flashDealIds.has(p.id)).slice(0, 5 - flashDeals.length);
    flashDeals.push(...fillers);
  }

  const newArrivalProducts = allProducts.filter(p => p.isNew);
  const newArrivalIds = new Set(newArrivalProducts.map(p => p.id));
  const newArrivals = newArrivalProducts.slice(0, 6);
  if (newArrivals.length < 5) {
    const fillers = allProducts.filter(p => !newArrivalIds.has(p.id)).slice(0, 5 - newArrivals.length);
    newArrivals.push(...fillers);
  }

  const tierDisplay = loyalty.tier.charAt(0).toUpperCase() + loyalty.tier.slice(1);
  const tierInfo = tierColors[loyalty.tier as keyof typeof tierColors] || tierColors.gold;

  return (
  <>
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={technozoneLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Technozone"
          />
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => navigation.navigate('Search')}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Search products"
          >
            <Feather name="search" size={22} color={colors.onSurface} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={22} color={colors.onSurface} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>
      </View>

      {/* ── Location Bar ── */}
      <Pressable
        style={({ pressed }) => [styles.locationBar, pressed && { opacity: 0.7 }]}
        onPress={() => setShowLocationPicker(true)}
        accessibilityLabel={`Current location: ${currentRegion.nameEn}. Tap to change.`}
        accessibilityRole="button"
      >
        <Feather name="map-pin" size={16} color={colors.accent} />
        <Text style={styles.locationText} numberOfLines={1}>
          {currentRegion.name}
        </Text>
        <Text style={styles.locationMeta}>
          {regionStores.length > 0
            ? `${regionStores.length} store${regionStores.length !== 1 ? 's' : ''} nearby`
            : `Ships from UB`}
          {' \u00B7 '}
          {regionShipping.estimatedDaysMin}–{regionShipping.estimatedDaysMax} days
        </Text>
        <Feather name="chevron-down" size={16} color={colors.onSurfaceVariant} />
      </Pressable>

      {/* ── Promotional Banners ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerList}
        decelerationRate="fast"
        snapToInterval={screenWidth - HORIZONTAL_PAD * 2 + CARD_GAP}
      >
        {promotionalBanners.map((b) => (
          <Pressable
            key={b.id}
            style={({ pressed }) => [styles.banner, pressed && { opacity: 0.85 }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${b.title}: ${b.subtitle}`}
          >
            <ImageBackground
              source={{ uri: b.image }}
              style={styles.bannerImageBg}
              imageStyle={styles.bannerImageStyle}
              resizeMode="cover"
            >
              {/* Dark gradient overlay */}
              <View style={[styles.bannerOverlay, { backgroundColor: `${b.bg}CC` }]} />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSubtitle}>{b.subtitle}</Text>
              </View>
              <View style={styles.bannerArrow}>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Quick Actions ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsRow}
      >
        {quickActions.map((a) => (
          <Pressable
            key={a.id}
            style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]}
            onPress={() => {
              if (a.id === 'trade') navigation.navigate('TradeIn');
              else if (a.id === 'loan') navigation.navigate('LoanCalculator', {});
              else if (a.id === 'spin') navigation.navigate('SpinWheel');
              else if (a.id === 'deals') navigation.navigate('Search');
            }}
            accessible
            accessibilityRole="button"
            accessibilityLabel={a.label}
          >
            <View style={styles.quickActionIcon}>
              <Feather name={a.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Loyalty Card ── */}
      <Pressable
        style={({ pressed }) => [styles.loyaltyCard, pressed && { opacity: 0.9 }]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${tierDisplay} member, ${loyalty.points.toLocaleString()} points`}
      >
        <View style={styles.loyaltyTop}>
          <View>
            <Text style={styles.loyaltyTierLabel}>{tierDisplay} Member</Text>
            <Text style={styles.loyaltyPointsValue}>{loyalty.points.toLocaleString()}</Text>
            <Text style={styles.loyaltyPointsUnit}>points</Text>
          </View>
          <View style={styles.loyaltyStreakBadge}>
            <Feather name="trending-up" size={14} color={colors.white} />
            <Text style={styles.loyaltyStreakText}>{loyalty.dailyStreak}d streak</Text>
          </View>
        </View>
        <View style={styles.loyaltyProgressWrap}>
          <View style={styles.loyaltyProgressBg}>
            <View style={[styles.loyaltyProgressFill, { width: `${Math.min(loyalty.tierProgress * 100, 100)}%` }]} />
          </View>
          <Text style={styles.loyaltyProgressLabel}>
            {loyalty.nextTierPoints.toLocaleString()} pts to next tier
          </Text>
        </View>
      </Pressable>

      {/* ── Loan Widget ── */}
      <Pressable
        style={({ pressed }) => [styles.loanWidget, pressed && { opacity: 0.85 }]}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Instant loans, pre-approved up to 3 million tugrik"
      >
        <View style={styles.loanLeft}>
          <View style={styles.loanIconWrap}>
            <Feather name="dollar-sign" size={20} color={colors.loanPrimary} />
          </View>
          <View>
            <Text style={styles.loanTitle}>Instant Loans</Text>
            <Text style={styles.loanSubtitle}>Pre-approved up to 3,000,000</Text>
          </View>
        </View>
        <Feather name="arrow-right" size={20} color={colors.loanPrimary} />
      </Pressable>

      {/* ── Flash Deals ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Flash Deals</Text>
          <View style={styles.timerBadge}>
            <Feather name="clock" size={12} color={colors.accent} />
            <Text style={styles.timerText}>02:00:00</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
          {flashDeals.map((product) => (
            <Pressable
              key={product.id}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              style={({ pressed }) => [styles.dealBannerCard, pressed && { opacity: 0.85 }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${product.name}, ${product.price.toLocaleString()} tugrik`}
            >
              <Image source={{ uri: product.image }} style={styles.dealBannerImage} resizeMode="cover" />
              <View style={styles.dealBannerGradient} />
              {product.originalPrice && (
                <View style={styles.dealDiscountBadge}>
                  <Text style={styles.dealDiscountText}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              )}
              <View style={styles.dealBannerInfo}>
                <Text style={styles.dealBannerName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.dealBannerPriceRow}>
                  <Text style={styles.dealBannerPrice}>{'\u20AE'}{product.price.toLocaleString()}</Text>
                  {product.originalPrice && (
                    <Text style={styles.dealBannerOriginal}>{'\u20AE'}{product.originalPrice.toLocaleString()}</Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Categories ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>
        <View style={styles.categoryGrid}>
          {categoryList.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [styles.categoryCard, pressed && { backgroundColor: colors.border }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={cat.label}
            >
              <Feather name={cat.icon} size={24} color={colors.primary} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── New Arrivals ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <Pressable
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            hitSlop={8}
            accessible
            accessibilityRole="button"
            accessibilityLabel="View all new arrivals"
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow}>
          {newArrivals.map((product) => (
            <Pressable
              key={product.id}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              style={({ pressed }) => [styles.dealBannerCard, pressed && { opacity: 0.85 }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${product.name}, ${product.price.toLocaleString()} tugrik`}
            >
              <Image source={{ uri: product.image }} style={styles.dealBannerImage} resizeMode="cover" />
              <View style={styles.dealBannerGradient} />
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>
                  {!product.inStock ? 'COMING SOON' : 'NEW'}
                </Text>
              </View>
              <View style={styles.dealBannerInfo}>
                <Text style={styles.dealBannerName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.dealBannerPrice}>{'\u20AE'}{product.price.toLocaleString()}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>

    <LocationPickerModal
      visible={showLocationPicker}
      onClose={() => setShowLocationPicker(false)}
    />
  </>
  );
};

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PAD,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 28,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnPressed: {
    backgroundColor: colors.surface,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // Location bar
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: HORIZONTAL_PAD,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  locationMeta: {
    flex: 1,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },

  // Banners (image-backed)
  bannerList: {
    paddingHorizontal: HORIZONTAL_PAD,
    gap: CARD_GAP,
    paddingBottom: 4,
  },
  banner: {
    width: screenWidth - HORIZONTAL_PAD * 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerImageStyle: {
    borderRadius: 16,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 40,
    padding: 20,
  },
  bannerArrow: {
    position: 'absolute',
    bottom: 20,
    right: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },

  // Quick Actions
  quickActionsRow: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  quickAction: {
    alignItems: 'center',
    width: 68,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
  },

  // Loyalty Card
  loyaltyCard: {
    marginHorizontal: HORIZONTAL_PAD,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  loyaltyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loyaltyTierLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  loyaltyPointsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  loyaltyPointsUnit: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
  },
  loyaltyStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loyaltyStreakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loyaltyProgressWrap: {
    gap: 6,
  },
  loyaltyProgressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loyaltyProgressFill: {
    height: '100%',
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 3,
  },
  loyaltyProgressLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
  },

  // Loan Widget
  loanWidget: {
    marginHorizontal: HORIZONTAL_PAD,
    backgroundColor: colors.loanSecondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loanIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loanTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  loanSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.onSurfaceSecondary,
    marginTop: 1,
  },

  // Sections
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PAD,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.loanPrimary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },

  // Product Cards
  productRow: {
    paddingHorizontal: HORIZONTAL_PAD,
    gap: CARD_GAP,
  },
  productCard: {
    width: 140,
  },
  productImgWrap: {
    width: 140,
    height: 140,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  productName: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.onSurfaceSecondary,
    marginTop: 2,
    lineHeight: 17,
  },

  // Deal Banner Cards (Flash Deals & New Arrivals)
  dealBannerCard: {
    width: screenWidth * 0.7,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  dealBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  dealBannerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  dealDiscountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dealDiscountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#1B9E77',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealBannerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  dealBannerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dealBannerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dealBannerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealBannerOriginal: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: HORIZONTAL_PAD,
    gap: 10,
  },
  categoryCard: {
    width: (screenWidth - HORIZONTAL_PAD * 2 - 20) / 3,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurface,
    textAlign: 'center',
  },
});
