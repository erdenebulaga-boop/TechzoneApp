import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { products as mockProducts } from '../../data/products';
import type { Product } from '../../data/products';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, radius, shadow } from '../../styles/spacing';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

const recentSearches = ['Samsung Galaxy', 'iPhone 16', 'Wireless earbuds'];

const trendingProducts = [
  { id: 'trend-1', name: 'MacBook Pro M4', icon: 'monitor' },
  { id: 'trend-2', name: 'iPad Air', icon: 'tablet' },
  { id: 'trend-3', name: 'AirPods Pro', icon: 'headphones' },
  { id: 'trend-4', name: 'Apple Watch', icon: 'watch' },
  { id: 'trend-5', name: '4K Webcam', icon: 'video' },
];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const inputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearchList, setRecentSearchList] = useState(recentSearches);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Auto-focus search input
    inputRef.current?.focus();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const handleClearRecent = () => {
    setRecentSearchList([]);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTrendingClick = (name: string) => {
    handleSearch(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={18} color={colors.onSurfaceVariant} style={styles.searchIconStyle} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Feather name="x" size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        <FlatList
          data={[1]}
          renderItem={() => (
            <View style={styles.content}>
              {/* Recent Searches */}
              {recentSearchList.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={handleClearRecent}>
                      <Text style={styles.clearLink}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearchList.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRecentSearchClick(search)}
                      style={styles.recentItem}
                    >
                      <Feather name="clock" size={16} color={colors.onSurfaceVariant} />
                      <Text style={styles.recentText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Trending */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <View style={styles.trendingGrid}>
                  {trendingProducts.map((trend) => (
                    <TouchableOpacity
                      key={trend.id}
                      onPress={() => handleTrendingClick(trend.name)}
                      style={styles.trendingCard}
                    >
                      <Feather name={trend.icon as any} size={28} color={colors.primary} style={styles.trendingIconStyle} />
                      <Text style={styles.trendingName} numberOfLines={2}>
                        {trend.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
          keyExtractor={() => 'empty'}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleProductPress(item.id)}
              style={styles.resultItem}
            >
              <View style={styles.resultImage}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.resultCategory}>{item.category}</Text>
                <Text style={styles.resultPrice}>₮{item.price.toLocaleString()}</Text>
                <View style={styles.resultRating}>
                  {[...Array(5)].map((_, i) => (
                    <Feather key={i} name="star" size={12} color={colors.loyaltyPrimary} />
                  ))}
                  <Text style={styles.ratingCount}>(234)</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color={colors.onSurfaceVariant} style={styles.emptyIconStyle} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyDescription}>
                Try searching with different keywords
              </Text>
            </View>
          }
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
  },
  searchIconStyle: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.base,
    ...typography.bodyLarge,
    color: colors.onSurface,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginVertical: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
    fontWeight: '600',
  },
  clearLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.base,
  },
  recentText: {
    ...typography.bodyLarge,
    color: colors.onSurface,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  trendingCard: {
    width: '48%',
    backgroundColor: colors.surface,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  trendingIconStyle: {
    marginBottom: spacing.sm,
  },
  trendingName: {
    ...typography.bodySmall,
    color: colors.onSurface,
    textAlign: 'center',
  },
  resultsList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginRight: spacing.base,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resultCategory: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  resultPrice: {
    ...typography.titleMedium,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingCount: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing['3xl'],
  },
  emptyIconStyle: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
});
