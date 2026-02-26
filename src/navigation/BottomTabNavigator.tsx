import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import { LoyaltyHomeScreen } from '../screens/loyalty/LoyaltyHomeScreen';
import LoanHomeScreen from '../screens/loan/LoanHomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useCartStore } from '../store/cartStore';
import { colors } from '../styles';

export type TabParamList = {
  HomeTab: undefined;
  ShopTab: undefined;
  LoyaltyTab: undefined;
  LoanTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const TabIcon = ({ icon, label, focused, badge }: { icon: FeatherIconName; label: string; focused: boolean; badge?: number }) => (
  <View style={styles.tabItem} accessible accessibilityRole="tab" accessibilityLabel={label}>
    <Feather name={icon} size={22} color={focused ? colors.primary : colors.onSurfaceVariant} />
    {badge != null && badge > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    ) : null}
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

export const BottomTabNavigator = () => {
  const totalItems = useCartStore(s => s.totalItems());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="home" label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="shopping-bag" label="Shop" focused={focused} badge={totalItems} />,
        }}
      />
      <Tab.Screen
        name="LoyaltyTab"
        component={LoyaltyHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="award" label="Points" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="LoanTab"
        component={LoanHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="credit-card" label="Loan" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="user" label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.select({ ios: 83, android: 65 }),
    paddingBottom: Platform.select({ ios: 34, android: 10 }),
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 44,
    minHeight: 44,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -6,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
