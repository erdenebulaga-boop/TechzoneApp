import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderHistory'
>;

interface Props {
  navigation: OrderHistoryScreenNavigationProp;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing';
  productName: string;
  price: number;
  pointsEarned: number;
  image: string;
}

type TabType = 'active' | 'completed' | 'all';

const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const allOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'TZ-2026-5678',
      date: '2026-02-24',
      status: 'delivered',
      productName: 'Samsung Galaxy A15 Smartphone',
      price: 450000,
      pointsEarned: 4500,
      image: 'smartphone',
    },
    {
      id: '2',
      orderNumber: 'TZ-2026-5677',
      date: '2026-02-20',
      status: 'shipped',
      productName: 'Wireless Earbuds Pro',
      price: 250000,
      pointsEarned: 2500,
      image: 'headphones',
    },
    {
      id: '3',
      orderNumber: 'TZ-2026-5676',
      date: '2026-02-10',
      status: 'processing',
      productName: 'USB-C Fast Charging Cable',
      price: 25000,
      pointsEarned: 250,
      image: 'power',
    },
    {
      id: '4',
      orderNumber: 'TZ-2026-5675',
      date: '2026-01-28',
      status: 'delivered',
      productName: 'Laptop Stand Aluminum',
      price: 85000,
      pointsEarned: 850,
      image: 'monitor',
    },
    {
      id: '5',
      orderNumber: 'TZ-2026-5674',
      date: '2026-01-15',
      status: 'delivered',
      productName: 'Monitor 27 inch 4K',
      price: 1200000,
      pointsEarned: 12000,
      image: 'monitor',
    },
  ];

  const getFilteredOrders = () => {
    if (activeTab === 'active') {
      return allOrders.filter(
        (order) => order.status === 'processing' || order.status === 'shipped'
      );
    }
    if (activeTab === 'completed') {
      return allOrders.filter((order) => order.status === 'delivered');
    }
    return allOrders;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: 'check-circle', text: 'Delivered', bgColor: '#E8F5E9', textColor: '#2E7D32' };
      case 'shipped':
        return { icon: 'truck', text: 'Shipped', bgColor: '#E3F2FD', textColor: '#1565C0' };
      case 'processing':
        return { icon: 'clock', text: 'Processing', bgColor: '#FFF3E0', textColor: '#E65100' };
      default:
        return { icon: 'package', text: 'Pending', bgColor: '#F3E5F5', textColor: '#6A1B9A' };
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const statusBadge = getStatusBadge(item.status);

    return (
      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusBadge.bgColor },
            ]}
          >
            <Feather name={statusBadge.icon as any} size={14} color={statusBadge.textColor} />
            <Text style={[styles.statusText, { color: statusBadge.textColor }]}>
              {statusBadge.text}
            </Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.productImageContainer}>
            <Feather name={item.image as any} size={24} color={colors.primary} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.productName}
            </Text>
            <Text style={styles.productPrice}>
              ₮{item.price.toLocaleString('en-MN')}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.pointsBadge}>
            <Feather name="star" size={14} color={colors.loyaltyPrimary} />
            <Text style={styles.pointsText}>
              Earned +{item.pointsEarned} pts
            </Text>
          </View>
          <TouchableOpacity style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>View Details ›</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={48} color={colors.onSurfaceSecondary} />
      <Text style={styles.emptyText}>No orders yet</Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'active'
          ? 'Your active orders will appear here'
          : 'Your order history will appear here'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['active', 'completed', 'all'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          {renderEmptyState()}
        </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  orderDate: {
    fontSize: 12,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  productImageContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTopWidth: 1,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.loyaltyPrimary,
  },
  viewDetails: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
  },
});

export default OrderHistoryScreen;
