import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { BottomTabNavigator } from './BottomTabNavigator';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import CheckoutScreen from '../screens/shop/CheckoutScreen';
import OrderConfirmationScreen from '../screens/shop/OrderConfirmationScreen';
import { SpinWheelScreen } from '../screens/loyalty/SpinWheelScreen';
import { ChallengesScreen } from '../screens/loyalty/ChallengesScreen';
import { RewardsScreen } from '../screens/loyalty/RewardsScreen';
import { BadgesScreen } from '../screens/loyalty/BadgesScreen';
import { LeaderboardScreen } from '../screens/loyalty/LeaderboardScreen';
import { ReferralScreen } from '../screens/loyalty/ReferralScreen';
import LoanCalculatorScreen from '../screens/loan/LoanCalculatorScreen';
import LoanApplicationScreen from '../screens/loan/LoanApplicationScreen';
import PaymentScreen from '../screens/loan/PaymentScreen';
import WalletScreen from '../screens/profile/WalletScreen';
import OrderHistoryScreen from '../screens/profile/OrderHistoryScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import { NotificationScreen } from '../screens/home/NotificationScreen';
import { SearchScreen } from '../screens/home/SearchScreen';
import { TradeInScreen } from '../screens/tradein/TradeInScreen';
import { colors } from '../styles';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  SignIn: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  SpinWheel: undefined;
  Challenges: undefined;
  Rewards: undefined;
  Badges: undefined;
  Leaderboard: undefined;
  Referral: undefined;
  LoanCalculator: { productPrice?: number };
  LoanApplication: { amount?: number; term?: number };
  Payment: { loanId: string };
  Wallet: undefined;
  OrderHistory: undefined;
  Settings: undefined;
  Notifications: undefined;
  Search: undefined;
  TradeIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, hasOnboarded } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <>
            {!hasOnboarded ? (
              <>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              </>
            ) : null}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ presentation: 'modal', gestureEnabled: false }} />
            <Stack.Screen name="SpinWheel" component={SpinWheelScreen} />
            <Stack.Screen name="Challenges" component={ChallengesScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="Badges" component={BadgesScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
            <Stack.Screen name="LoanCalculator" component={LoanCalculatorScreen} />
            <Stack.Screen name="LoanApplication" component={LoanApplicationScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="TradeIn" component={TradeInScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
