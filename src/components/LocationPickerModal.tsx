import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, radius, shadow } from '../styles/spacing';
import { regions, getShippingForRegion, getStoresForRegion } from '../data/locations';
import { useAuthStore } from '../store/authStore';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { selectedRegionId, setRegion } = useAuthStore();
  const [tempSelection, setTempSelection] = useState(selectedRegionId);

  const handleConfirm = () => {
    setRegion(tempSelection);
    onClose();
  };

  const handleOpen = () => {
    setTempSelection(selectedRegionId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerHandle} />
          <Text style={styles.headerTitle}>Select Your Location</Text>
          <Text style={styles.headerSubtitle}>
            Shipping prices and delivery times vary by region
          </Text>
        </View>

        {/* Region List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {regions.map((region) => {
            const isSelected = tempSelection === region.id;
            const shipping = getShippingForRegion(region.id);
            const stores = getStoresForRegion(region.id);
            const hasStores = stores.length > 0;

            return (
              <Pressable
                key={region.id}
                style={({ pressed }) => [
                  styles.regionCard,
                  isSelected && styles.regionCardSelected,
                  pressed && !isSelected && { backgroundColor: colors.surface },
                ]}
                onPress={() => setTempSelection(region.id)}
                accessibilityLabel={`Select ${region.nameEn}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                {/* Left: Icon + Info */}
                <View style={[
                  styles.regionIcon,
                  isSelected ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface },
                ]}>
                  <Feather
                    name="map-pin"
                    size={20}
                    color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                  />
                </View>

                <View style={styles.regionInfo}>
                  <Text style={[styles.regionName, isSelected && styles.regionNameSelected]}>
                    {region.name}
                  </Text>
                  <Text style={styles.regionNameEn}>{region.nameEn}</Text>
                  <View style={styles.regionMeta}>
                    {hasStores ? (
                      <View style={styles.metaChip}>
                        <Feather name="home" size={12} color={colors.success} />
                        <Text style={[styles.metaText, { color: colors.success }]}>
                          {stores.length} store{stores.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.metaChip}>
                        <Feather name="truck" size={12} color={colors.onSurfaceVariant} />
                        <Text style={styles.metaText}>Ships from UB</Text>
                      </View>
                    )}
                    <View style={styles.metaChip}>
                      <Feather name="clock" size={12} color={colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>
                        {shipping.estimatedDaysMin}–{shipping.estimatedDaysMax} days
                      </Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Feather name="tag" size={12} color={colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>
                        ₮{shipping.costMNT.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right: Checkmark */}
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Feather name="check" size={16} color={colors.onPrimary} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleConfirm}
            accessibilityLabel="Confirm location selection"
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && { opacity: 0.6 },
            ]}
            onPress={onClose}
            accessibilityLabel="Close location picker"
            accessibilityRole="button"
          >
            <Text style={styles.skipButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.headlineLarge,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceSecondary,
    textAlign: 'center',
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },

  // Region card
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  regionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary50,
  },

  // Icon
  regionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info
  regionInfo: {
    flex: 1,
  },
  regionName: {
    ...typography.titleMedium,
    color: colors.onSurface,
    fontWeight: '600',
  },
  regionNameSelected: {
    color: colors.primary,
  },
  regionNameEn: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  regionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },

  // Check
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    ...typography.titleMedium,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
});
