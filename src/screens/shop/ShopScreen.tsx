import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useCartStore } from '../../store/cartStore';
import { getProductsByCategory, categories as rawCategories } from '../../data/products';
import { colors } from '../../styles/colors';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 16 * 2 - 12) / 2;

const shopCategories = [
  { id: 'all', label: 'All', icon: 'grid' as const },
  ...rawCategories
    .filter(c => c.id !== 'all')
    .map(c => ({ id: c.id, label: c.name, icon: c.icon as any })),
];

type ShopScreenNavigationProp = NavigationProp<RootStackParamList, 'Shop'>;

const ShopScreen: React.FC = () => {
  const navigation = useNavigation<ShopScreenNavigationProp>();
  const cartStore = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const products = getProductsByCategory(selectedCategory);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const renderProductCard = ({ item }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.productCard,
        pressed && styles.productCardPressed,
      ]}
      onPress={() => handleProductPress(item.id)}
      accessibilityLabel={`Product: ${item.name}, Price: ${item.price.toLocaleString()} tugrik`}
      accessibilityRole="button"
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {item.isFlashDeal && (
          <View style={styles.flashBadge}>
            <Feather name="zap" size={10} color={colors.white} />
            <Text style={styles.badgeText}>Deal</Text>
          </View>
        )}
        {item.isNew && !item.isFlashDeal && (
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>{item.inStock === false ? 'Soon' : 'New'}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {'\u20AE'}{item.price.toLocaleString()}
          </Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>
              {'\u20AE'}{item.originalPrice.toLocaleString()}
            </Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          {item.loanAvailable && (
            <View style={styles.loanBadge}>
              <Feather name="credit-card" size={10} color={colors.loanPrimary} />
              <Text style={styles.loanBadgeText}>Loan</Text>
            </View>
          )}
          <View style={styles.ratingRow}>
            <Feather name="star" size={11} color={colors.loyaltyPrimary} />
            <Text style={styles.ratingText}>{item.rating > 0 ? item.rating : '—'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSearchPress}
            accessibilityLabel="Search products"
            accessibilityRole="button"
          >
            <Feather name="search" size={22} color={colors.onSurface} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCartPress}
            accessibilityLabel={`Cart, ${cartStore.totalItems()} items`}
            accessibilityRole="button"
          >
            <Feather name="shopping-cart" size={22} color={colors.onSurface} />
            {cartStore.totalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartStore.totalItems()}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {shopCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                accessibilityLabel={`${cat.label} category`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Feather
                  name={cat.icon}
                  size={14}
                  color={isActive ? colors.white : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  buttonPressed: {
    backgroundColor: colors.surface,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },

  // Filter Chips
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  // Product Grid
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productCardPressed: {
    opacity: 0.85,
  },

  // Product Image
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: colors.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  flashBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#1B9E77',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // Card Content
  cardContent: {
    padding: 12,
    gap: 4,
  },
  brand: {
    fontSize: 11,
    color: colors.onSurfaceMuted,
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.onSurfaceMuted,
    textDecorationLine: 'line-through',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  loanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.loanSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  loanBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.loanPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
  },
});

export default ShopScreen;
