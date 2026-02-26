import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../../styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../store/authStore';
import { getRegionById, getClosestStore } from '../../data/locations';
import { LocationPickerModal } from '../../components/LocationPickerModal';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

interface ToggleSetting {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState<'MN' | 'EN'>('MN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { selectedRegionId } = useAuthStore();
  const currentRegion = getRegionById(selectedRegionId);
  const closestStore = getClosestStore(selectedRegionId);

  const renderSettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    showChevron = true,
  }: SettingItemProps) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Feather name={icon as any} size={20} color={colors.onSurfaceVariant} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showChevron && onPress && (
          <Feather name="chevron-right" size={20} color={colors.onSurfaceVariant} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderToggleSetting = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
  }: ToggleSetting) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Feather name={icon as any} size={20} color={colors.onSurfaceVariant} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.surface : colors.textSecondary}
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        {renderSection(
          'ACCOUNT',
          <>
            {renderSettingItem({
              icon: 'user',
              title: 'Edit Profile',
              subtitle: 'Батзориг Дорж',
              onPress: () => {},
            })}
            {renderSettingItem({
              icon: 'smartphone',
              title: 'Phone Number',
              subtitle: '+976 9999-9999',
              onPress: () => {},
            })}
            {renderSettingItem({
              icon: 'mail',
              title: 'Email',
              subtitle: 'batzorig@email.com',
              onPress: () => {},
            })}
          </>
        )}

        {/* Privacy & Security Section */}
        {renderSection(
          'PRIVACY & SECURITY',
          <>
            {renderSettingItem({
              icon: 'key',
              title: 'Change Password',
              onPress: () => {},
            })}
            {renderToggleSetting({
              icon: 'smartphone',
              title: 'Biometric Login',
              subtitle: 'Fingerprint & Face ID',
              value: biometricLogin,
              onToggle: setBiometricLogin,
            })}
            {renderToggleSetting({
              icon: 'lock',
              title: 'Two-Factor Auth',
              subtitle: 'Enhanced security',
              value: twoFactorAuth,
              onToggle: setTwoFactorAuth,
            })}
            {renderSettingItem({
              icon: 'check-circle',
              title: 'DAN.mn Status',
              value: 'Verified',
              showChevron: false,
            })}
          </>
        )}

        {/* Preferences Section */}
        {renderSection(
          'PREFERENCES',
          <>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setLanguage(language === 'MN' ? 'EN' : 'MN')}
            >
              <View style={styles.settingItemLeft}>
                <Feather name="globe" size={20} color={colors.onSurfaceVariant} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingSubtitle}>
                    {language === 'MN' ? 'Монгол' : 'English'}
                  </Text>
                </View>
              </View>
              <View style={styles.languageToggle}>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'MN' && styles.languageOptionActive,
                  ]}
                  onPress={() => setLanguage('MN')}
                >
                  <Text
                    style={[
                      styles.languageText,
                      language === 'MN' && styles.languageTextActive,
                    ]}
                  >
                    MN
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'EN' && styles.languageOptionActive,
                  ]}
                  onPress={() => setLanguage('EN')}
                >
                  <Text
                    style={[
                      styles.languageText,
                      language === 'EN' && styles.languageTextActive,
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <View style={styles.settingItemLeft}>
                <Feather name="sliders" size={20} color={colors.onSurfaceVariant} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Theme</Text>
                  <Text style={styles.settingSubtitle}>
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </View>
              </View>
              <View style={styles.themeToggle}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'light' && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme('light')}
                >
                  <Feather
                    name="sun"
                    size={16}
                    color={theme === 'light' ? colors.surface : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'dark' && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <Feather
                    name="moon"
                    size={16}
                    color={theme === 'dark' ? colors.surface : colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            {renderSettingItem({
              icon: 'map-pin',
              title: 'Location / Default Store',
              subtitle: `${currentRegion.nameEn}${closestStore ? ` \u00B7 ${closestStore.name}` : ''}`,
              onPress: () => setShowLocationPicker(true),
            })}
          </>
        )}

        {/* Notifications Section */}
        {renderSection(
          'NOTIFICATIONS',
          <>
            {renderToggleSetting({
              icon: 'bell',
              title: 'Push Notifications',
              value: pushNotifications,
              onToggle: setPushNotifications,
            })}
            {renderToggleSetting({
              icon: 'message-square',
              title: 'SMS Notifications',
              value: smsNotifications,
              onToggle: setSmsNotifications,
            })}
            {renderToggleSetting({
              icon: 'mail',
              title: 'Email Notifications',
              value: emailNotifications,
              onToggle: setEmailNotifications,
            })}
          </>
        )}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Technozone v1.0.0</Text>
        </View>
      </ScrollView>

      <LocationPickerModal
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
      />
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
  backButton: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderBottomColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.md,
    width: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  languageOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  languageOptionActive: {
    backgroundColor: colors.primary,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  languageTextActive: {
    color: colors.surface,
  },
  themeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  themeOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  themeOptionActive: {
    backgroundColor: colors.primary,
  },
  versionContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default SettingsScreen;
