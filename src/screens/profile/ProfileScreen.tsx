import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/RootNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface MenuRow {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

interface Section {
  title: string;
  rows: MenuRow[];
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, loyalty, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    const parts = user.name.split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }, [user?.name]);

  const memberSinceDate = useMemo(() => {
    const now = new Date();
    const monthYear = now.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    return monthYear;
  }, []);

  const sections: Section[] = useMemo(
    () => [
      {
        title: 'ACCOUNT',
        rows: [
          {
            id: 'wallet',
            icon: 'credit-card',
            label: 'Wallet',
            onPress: () => navigation.navigate('Wallet'),
          },
          {
            id: 'orders',
            icon: 'package',
            label: 'Order History',
            onPress: () => navigation.navigate('OrderHistory'),
          },
          {
            id: 'addresses',
            icon: 'map-pin',
            label: 'Addresses',
            onPress: () => {},
          },
          {
            id: 'payments',
            icon: 'dollar-sign',
            label: 'Payment Methods',
            onPress: () => {},
          },
        ],
      },
      {
        title: 'LOYALTY',
        rows: [
          {
            id: 'membership',
            icon: 'award',
            label: `Membership Tier: ${loyalty?.tier || 'Standard'}`,
            onPress: () => {},
          },
          {
            id: 'points',
            icon: 'star',
            label: `Points Balance: ${loyalty?.points || 0}`,
            onPress: () => {},
          },
          {
            id: 'referral',
            icon: 'users',
            label: 'Referral Program',
            onPress: () => {},
          },
        ],
      },
      {
        title: 'APP',
        rows: [
          {
            id: 'settings',
            icon: 'settings',
            label: 'Settings',
            onPress: () => navigation.navigate('Settings'),
          },
          {
            id: 'help',
            icon: 'help-circle',
            label: 'Help & Support',
            onPress: () => {},
          },
          {
            id: 'about',
            icon: 'info',
            label: 'About',
            onPress: () => {},
          },
        ],
      },
    ],
    [navigation, loyalty]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Text
              style={styles.avatar}
              accessibilityLabel={`User avatar with initials ${initials}`}
            >
              {initials}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text
              style={styles.userName}
              accessibilityLabel={`User name: ${user?.name || 'User'}`}
            >
              {user?.name || 'User'}
            </Text>
            <Text
              style={styles.userEmail}
              accessibilityLabel={`Email: ${user?.email || 'Not provided'}`}
            >
              {user?.email || 'Not provided'}
            </Text>
            <Text
              style={styles.memberSince}
              accessibilityLabel={`Member since ${memberSinceDate}`}
            >
              Member since {memberSinceDate}
            </Text>
          </View>
        </View>

        {/* Menu Sections */}
        {sections.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.groupedList}>
              {section.rows.map((row, index) => (
                <View
                  key={row.id}
                  style={[
                    styles.rowWrapper,
                    index < section.rows.length - 1 && styles.rowBorder,
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.row,
                      pressed && styles.rowPressed,
                    ]}
                    onPress={row.onPress}
                    accessibilityRole="menuitem"
                    accessibilityLabel={row.label}
                  >
                    <Feather
                      name={row.icon}
                      size={20}
                      color={colors.onSurface}
                      style={styles.rowIcon}
                    />
                    <Text
                      style={styles.rowLabel}
                      numberOfLines={1}
                      accessibilityLabel={row.label}
                    >
                      {row.label}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={colors.onSurfaceVariant}
                      style={styles.chevron}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sign out button"
          >
            <Feather
              name="log-out"
              size={18}
              color={colors.accent}
              style={styles.signOutIcon}
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.onSurfaceSecondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  sectionContainer: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  groupedList: {
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowWrapper: {
    backgroundColor: colors.white,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowPressed: {
    backgroundColor: colors.surface,
  },
  rowIcon: {
    marginRight: 12,
    width: 24,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '400',
  },
  chevron: {
    marginLeft: 8,
  },
  signOutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signOutButtonPressed: {
    opacity: 0.7,
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
});

export default ProfileScreen;
