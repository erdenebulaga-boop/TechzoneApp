---
name: ui-mobile
description: Mobile UI patterns - React Native Expo, iOS/Android, touch targets, Feather icons, accessibility. Reusable across electronics/retail B2C apps.
---

# Mobile UI Design Skill (React Native / Expo)

*Reusable skill for React Native Expo projects — electronics retailers, B2C apps, loyalty/gamification apps.*
*Battle-tested on the Technozone project and applicable to similar service-provider clients.*

---

## MANDATORY: Mobile Accessibility Standards

**These rules are NON-NEGOTIABLE. Every UI element must pass these checks.**

### 1. Touch Targets (CRITICAL)
```typescript
// MINIMUM 44x44 points for ALL interactive elements
const MINIMUM_TOUCH_SIZE = 44;

// EVERY button, link, icon button must meet this
const styles = StyleSheet.create({
  button: {
    minHeight: MINIMUM_TOUCH_SIZE,
    minWidth: MINIMUM_TOUCH_SIZE,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    width: MINIMUM_TOUCH_SIZE,
    height: MINIMUM_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// NEVER DO THIS:
style={{ height: 30 }}  // TOO SMALL
style={{ padding: 4 }}  // RESULTS IN TINY TARGET
```

### 2. Color Contrast (CRITICAL)
```typescript
// WCAG 2.1 AA: 4.5:1 for text, 3:1 for large text/UI

// SAFE COMBINATIONS:
const colors = {
  // Light mode
  textPrimary: '#000000',     // on white = 21:1
  textSecondary: '#374151',   // gray-700 on white = 9.2:1

  // Dark mode
  textPrimaryDark: '#FFFFFF', // on gray-900 = 16:1
  textSecondaryDark: '#E5E7EB', // gray-200 on gray-900 = 11:1
};

// FORBIDDEN - FAILS CONTRAST:
// '#9CA3AF' (gray-400) on white = 2.6:1
// '#6B7280' (gray-500) on '#111827' = 4.0:1
// Any text below 4.5:1 ratio
```

### 3. Visibility Rules
```typescript
// ALL BUTTONS MUST HAVE visible boundaries

// PRIMARY: Solid background with contrasting text
<Pressable style={styles.primaryButton}>
  <Text style={{ color: '#FFFFFF' }}>Submit</Text>
</Pressable>

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#1F2937', // gray-800
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 44,
  },
});

// SECONDARY: Visible background
<Pressable style={styles.secondaryButton}>
  <Text style={{ color: '#1F2937' }}>Cancel</Text>
</Pressable>

const styles = StyleSheet.create({
  secondaryButton: {
    backgroundColor: '#F3F4F6', // gray-100
    minHeight: 44,
  },
});

// GHOST: MUST have visible border
<Pressable style={styles.ghostButton}>
  <Text style={{ color: '#374151' }}>Skip</Text>
</Pressable>

const styles = StyleSheet.create({
  ghostButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    minHeight: 44,
  },
});

// NEVER CREATE invisible buttons:
// backgroundColor: 'transparent' without border
// Text color matching background
```

### 4. Accessibility Labels (REQUIRED)
```tsx
// EVERY interactive element needs accessibility props

// Buttons
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit your information"
>
  <Text>Submit</Text>
</Pressable>

// Icon buttons (NO visible text = MUST have label)
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Close menu"
>
  <Feather name="x" size={22} color={colors.onSurface} />
</Pressable>

// Images
<Image
  accessible={true}
  accessibilityRole="image"
  accessibilityLabel="User profile photo"
  source={...}
/>
```

### 5. Focus/Selection States
```tsx
// EVERY Pressable needs visible pressed state
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed,
  ]}
>
  {children}
</Pressable>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1F2937',
  },
  buttonPressed: {
    opacity: 0.7,
    // OR
    backgroundColor: '#374151',
  },
});
```

---

## Icons: Use @expo/vector-icons Feather Set

**Do NOT use emojis for icons in the UI.** Use `@expo/vector-icons` Feather set which is bundled with Expo.

### Icon Usage Rules
```tsx
import { Feather } from '@expo/vector-icons';

// Always use Feather icons, never emojis
<Feather name="home" size={22} color={colors.primary} />

// DO NOT pass strokeWidth — Feather does not support it
// BAD:  <Feather name="home" size={22} strokeWidth={1.5} />
// GOOD: <Feather name="home" size={22} color={colors.primary} />

// Common icon mappings (instead of emojis):
// home, shopping-bag, award, credit-card, user (tab bar)
// search, bell, map-pin, settings, chevron-right
// plus, minus, trash-2, heart, share-2, star
// trending-up, check-circle, alert-circle, info
// gift, target, bar-chart-2, users, zap, clock
// arrow-left, arrow-right, x, menu, filter
// smartphone, monitor, watch, tv, headphones, package
// dollar-sign, percent, tag, truck, shield, lock

// INVALID Feather icons (will crash):
// "flame" — use "trending-up" instead
// "fire" — use "zap" instead
// "coins" — use "dollar-sign" instead
// "wallet" — use "credit-card" instead
// Always verify icon names exist in the Feather set before using
```

### Icon Wrapper Component
```tsx
// Recommended: create a thin wrapper for consistent sizing
import { Feather } from '@expo/vector-icons';

interface IconProps {
  name: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 22, color }) => (
  <Feather name={name} size={size} color={color} />
);
```

---

## CRITICAL: Tab Bar Content Overlap

**When using a bottom tab navigator, ALL tab screens MUST have enough bottom padding to prevent content from being hidden behind the tab bar.**

```tsx
// Tab bar heights:
// iOS: 83pt (includes home indicator)
// Android: 65pt

// ALWAYS add paddingBottom: 100 to tab screen content
// This accounts for tab bar + some breathing room

// For ScrollView screens:
<ScrollView
  contentContainerStyle={{ paddingBottom: 100 }}
  showsVerticalScrollIndicator={false}
>
  {/* content */}
</ScrollView>

// For FlatList screens:
<FlatList
  contentContainerStyle={{ paddingBottom: 100 }}
  data={items}
  renderItem={renderItem}
/>

// For screens with manual spacer:
<ScrollView>
  {/* content */}
  <View style={{ height: 100 }} />
</ScrollView>

// BAD: These values are too small for tab screens
// paddingBottom: 16  — content WILL be hidden
// paddingBottom: 32  — content WILL be hidden
// height: 40 spacer  — content WILL be hidden
```

---

## CRITICAL: Import/Export Consistency

**React Native projects frequently break due to import mismatches. Follow these rules strictly.**

```typescript
// RULE: Always match import style to export style

// Named export:
export const HomeScreen: React.FC = () => { ... };
// Import as:
import { HomeScreen } from './HomeScreen';

// Default export:
const ShopScreen: React.FC = () => { ... };
export default ShopScreen;
// Import as:
import ShopScreen from './ShopScreen';

// NEVER mix them:
// BAD: import { ShopScreen } from './ShopScreen' (when file uses default export)
// BAD: import ShopScreen from './ShopScreen' (when file uses named export)

// Colors module — NAMED exports only, NO default export
// BAD:  import colors from '../../styles/colors'
// GOOD: import { colors } from '../../styles/colors'
```

---

## CRITICAL: Removed/Deprecated React Native APIs

**These APIs have been removed from React Native core. Do NOT import them.**

```typescript
// REMOVED — will crash at runtime:
// import { Slider } from 'react-native';
// import { ProgressBarAndroid } from 'react-native';
// import { ProgressViewIOS } from 'react-native';

// SOLUTION: Build custom components or use community packages
// For Slider: Use PanResponder-based custom component
// For ProgressBar: Use a View with animated width
```

---

## CRITICAL: Data Shape Awareness

**Always verify mock data shapes before rendering. Mismatches cause "Objects are not valid as React child" crashes.**

```typescript
// COMMON MISTAKES:

// 1. Variants are objects, not strings
// BAD:  variants.map(v => <Text>{v}</Text>)
// GOOD: variants.map(v => <Text>{v.label}: {v.options.join(', ')}</Text>)

// 2. Specs are Record<string, string>, not arrays
// BAD:  specs.map(s => <Text>{s.label}</Text>)
// GOOD: Object.entries(specs).map(([label, value]) => <Text>{label}: {value}</Text>)

// 3. Categories are objects, not strings
// BAD:  categories.map(c => <Text>{c}</Text>)
// GOOD: categories.map(c => <Text>{c.name}</Text>)

// 4. Cart items wrap a product object
// BAD:  item.productId, item.name, item.price
// GOOD: item.product.id, item.product.name, item.product.price

// 5. Store methods — check actual API names
// BAD:  cartStore.getSubtotal()
// GOOD: cartStore.subtotal()

// 6. Optional fields — always guard
// BAD:  tx.points.toLocaleString()
// GOOD: tx.points != null ? tx.points.toLocaleString() : ''
```

---

## CRITICAL: Modal Stack Navigation

**Screens presented as modals (`presentation: 'modal'`) require special navigation handling to avoid infinite stacking.**

```typescript
// PROBLEM: Calling navigate() from inside a modal doesn't dismiss the modal.
// Each call stacks another navigation on top, creating infinite bottom-sheet loops.

// BAD — creates infinite modal stacking:
const handleDone = () => {
  navigation.navigate('Main', { screen: 'Shop' });
};

// GOOD — properly resets the stack and dismisses all modals:
import { CommonActions } from '@react-navigation/native';

const handleDone = () => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Shop' } }],
    })
  );
};

// This pattern applies to any screen with presentation: 'modal' that
// needs to navigate back to the main tab structure (Checkout → Shop,
// OrderConfirmation → Shop, LoanApplication → Loan, etc.)
```

---

## Filter Chips Pattern (REUSABLE)

**Consistent filter chip/tab UI used across all screens. Battle-tested to avoid clipping and touch issues.**

```tsx
// STRUCTURE: No maxHeight on container, explicit height on chips
<View style={styles.filterContainer}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterContent}
  >
    {filters.map((filter) => {
      const isActive = selectedFilter === filter.id;
      return (
        <Pressable
          key={filter.id}
          style={({ pressed }) => [
            styles.filterChip,
            isActive && styles.filterChipActive,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => setSelectedFilter(filter.id)}
        >
          {filter.icon && (
            <Feather
              name={filter.icon}
              size={14}
              color={isActive ? '#FFFFFF' : colors.onSurfaceSecondary}
            />
          )}
          <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
            {filter.name}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
</View>

// STYLES:
const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    // NO maxHeight — this causes clipping!
  },
  filterContent: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

// ANTI-PATTERNS (will cause bugs):
// maxHeight: 60 on the container ScrollView — clips chips
// TouchableOpacity instead of Pressable — no press states
// Hardcoded colors instead of design tokens
// Missing gap between chips
```

---

## Product Card Pattern (REUSABLE)

**Product card with real images, ratings, price, and badges.**

```tsx
<Pressable
  style={({ pressed }) => [styles.productCard, pressed && { opacity: 0.9 }]}
  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
>
  <Image
    source={{ uri: item.image }}
    style={styles.productImage}
    resizeMode="cover"
  />
  {item.badges?.length > 0 && (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{item.badges[0]}</Text>
    </View>
  )}
  <View style={styles.productInfo}>
    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
    <View style={styles.ratingRow}>
      <Feather name="star" size={12} color={colors.loyaltyPrimary} />
      <Text style={styles.ratingText}>{item.rating}</Text>
      <Text style={styles.reviewCount}>({item.reviewCount})</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.price}>₮{item.price.toLocaleString()}</Text>
      {item.originalPrice && (
        <Text style={styles.originalPrice}>₮{item.originalPrice.toLocaleString()}</Text>
      )}
    </View>
    {item.loanAvailable && (
      <View style={styles.loanBadge}>
        <Feather name="credit-card" size={10} color={colors.loanPrimary} />
        <Text style={styles.loanText}>Loan available</Text>
      </View>
    )}
  </View>
</Pressable>

// Product card: width ~48% of screen, image aspectRatio: 1, borderRadius: 12
// Price in accent color, original price with textDecorationLine: 'line-through'
```

---

## Banner/Promotional Card Pattern (REUSABLE)

**Image-backed promotional banners with colored overlays.**

```tsx
import { ImageBackground } from 'react-native';

<Pressable onPress={handleBannerPress}>
  <ImageBackground
    source={{ uri: banner.image }}
    style={styles.bannerCard}
    imageStyle={styles.bannerImageStyle}
  >
    <View style={[styles.bannerOverlay, { backgroundColor: `${banner.color}CC` }]}>
      <Text style={styles.bannerTitle}>{banner.title}</Text>
      <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
      <Feather name="arrow-right" size={20} color="#FFFFFF" />
    </View>
  </ImageBackground>
</Pressable>

// Overlay: semi-transparent brand color (CC = 80% opacity)
// Flash deals: wider cards (70% screenWidth), dark gradient, discount badge
// Always use real product images where available
```

---

## Multi-View Screen Pattern (REUSABLE)

**Single screen with multiple view states for complex flows (Trade-In, Applications, etc.)**

```typescript
type ViewState = 'options' | 'form' | 'processing' | 'result';
const [viewState, setViewState] = useState<ViewState>('options');

// Render different views based on state
const renderContent = () => {
  switch (viewState) {
    case 'options': return <OptionsView />;
    case 'form': return <FormView />;
    case 'processing': return <ProcessingView />;  // Animated progress
    case 'result': return <ResultView />;
  }
};

// Benefits: Single screen in navigator, smooth transitions, shared state
// Use for: Trade-in flows, loan applications, onboarding sequences
```

---

## Core Philosophy

**Mobile UI is about touch, speed, and focus.** No hover states, smaller screens, thumb-friendly targets. Design for one-handed use and interruption recovery.

## Platform Differences

### iOS vs Android
```typescript
import { Platform } from 'react-native';

// Platform-specific values
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),

  // iOS uses SF Pro, Android uses Roboto
  text: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});
```

### Design Language
```
iOS (Human Interface Guidelines)
- Flat design with subtle depth
- SF Symbols for icons
- Large titles (34pt)
- Rounded corners (10-14pt)
- Blue as default tint

Android (Material Design 3)
- Material You dynamic color
- Outlined/filled icons
- Medium titles (22pt)
- Rounded corners (12-28pt)
- Primary color from theme
```

## Spacing System

### 4px Base Grid
```typescript
// React Native spacing - consistent scale
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// Usage
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
```

### Safe Areas
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Screen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: Math.max(insets.left, 16),
      paddingRight: Math.max(insets.right, 16),
    }}>
      {children}
    </View>
  );
};
```

## Typography

### Type Scale
```typescript
const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.35 },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.41 },
  body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.41, lineHeight: 22 },
  callout: { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32 },
  caption: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
};
```

## Navigation Patterns

### Bottom Tab Bar
```tsx
// Proper bottom tab sizing
const tabBarStyle = {
  height: Platform.OS === 'ios' ? 83 : 65, // Account for home indicator
  paddingBottom: Platform.OS === 'ios' ? 34 : 10,
  paddingTop: 10,
  backgroundColor: '#F8F8F8',
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: '#C6C6C8',
};

// Tab item with Feather icons
const TabItem = ({ icon, label, active }) => (
  <View style={styles.tabItem}>
    <Feather name={icon} size={22} color={active ? colors.primary : colors.onSurfaceVariant} />
    <Text style={[styles.tabLabel, { color: active ? colors.primary : colors.onSurfaceVariant }]}>
      {label}
    </Text>
  </View>
);
```

## Component Patterns

### Cards
```tsx
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
```

### Buttons
```tsx
// Use Pressable, NOT TouchableOpacity
const PrimaryButton = ({ title, onPress, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.primaryButton,
      pressed && styles.primaryButtonPressed,
      disabled && styles.buttonDisabled,
    ]}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </Pressable>
);
```

## Anti-Patterns

### Never Do
```
- Touch targets smaller than 44pt
- Text smaller than 12pt
- Hover states (no hover on mobile)
- Fixed heights that break with large text
- Ignoring safe areas
- Heavy shadows on Android (use elevation)
- White text on light backgrounds without checking contrast
- Non-native animations (JS-driven transforms)
- Ignoring platform conventions (iOS vs Android)
- Inline styles everywhere (use StyleSheet.create)
- Emojis as UI icons (use Feather from @expo/vector-icons)
- TouchableOpacity (use Pressable with press states)
- Importing removed APIs (Slider, ProgressBarAndroid)
- Default imports when module uses named exports
- Assuming optional fields exist without null checks
- Tab screen content without bottom padding (paddingBottom: 100)
- strokeWidth prop on Feather icons (not supported, will warn)
- maxHeight on filter chip ScrollView containers (causes clipping)
- navigation.navigate() from inside modal screens (causes infinite stacking)
- Hardcoded colors instead of design token references
- colors.text or colors.textSecondary (use colors.onSurface, colors.onSurfaceSecondary)
```

### Common Mistakes
```tsx
// Hardcoded dimensions that break accessibility
style={{ height: 40 }}  // Text might be larger
// FIX: Minimum height with padding
style={{ minHeight: 44, paddingVertical: 12 }}

// Shadow on Android
shadowColor: '#000'  // Won't work
// FIX: Platform-specific
...Platform.select({
  ios: { shadowColor: '#000', ... },
  android: { elevation: 4 },
})

// Fixed status bar height
paddingTop: 44
// FIX: Use safe area
paddingTop: insets.top

// Tab screen without bottom padding
paddingBottom: 32  // Content hidden behind tab bar
// FIX: Account for tab bar
paddingBottom: 100

// Modal navigation stacking
navigation.navigate('Main')  // From modal — creates loops
// FIX: Reset the stack
navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }))

// Filter chips clipped by container
maxHeight: 60  // Clips chips
// FIX: Remove maxHeight, use explicit height on chips
height: 36, borderRadius: 18
```

## Quick Reference

### Mobile Defaults
```
Touch targets: 44pt minimum
Font sizes: 12pt min, 17pt body, 34pt large title
Border radius: 10-14pt (iOS), 12-28pt (Android)
Spacing: 4/8/16/24/32 grid
Animations: 200-300ms, native driver
Shadow: iOS shadowOpacity 0.08-0.15, Android elevation 2-8
Icons: Feather from @expo/vector-icons (no emojis)
Tab bar: iOS 83pt, Android 65pt
Content padding under tab bar: 100pt minimum
Filter chips: height 36, borderRadius 18, Pressable, gap 8
Banners: ImageBackground + semi-transparent overlay (CC opacity)
Modal exit: CommonActions.reset() (never navigate())
```

### Section Spacing Rules (CRITICAL for consistency)
```
Section gaps (between major blocks):    marginTop: 28
Section header to content:              marginBottom: 16
Card-to-card within same section:       marginBottom: 12–16
Widget spacing (loyalty, loan, etc):    marginBottom: 16 (loyalty), marginBottom: 4 (loan)
Quick actions row:                      paddingTop: 20, paddingBottom: 8
Section titles must always use the sectionHeader wrapper (paddingHorizontal: 20)
  — never apply paddingHorizontal inline on the Text
Category/Shop by grids:                 no extra marginTop (sectionHeader gap is enough)
Product rows:                           paddingHorizontal: 20, gap: 12
```

### Mock Data Property Names (guard against mismatches)
```
CreditProfile: creditScore, maxScore, scoreRating, availableCredit, usedCredit, creditLimit
Loan: originalAmount, remainingAmount, monthlyPayment, term, paidMonths, nextDueDate, status
  — NOT: amount, score, level, available, nextPaymentDate
Always use formatPrice() with null guard: (n?: number) => n == null ? '₮0' : `₮${n.toLocaleString()}`
```

### Premium Feel Checklist
```
All touch targets 44pt+
Consistent spacing (4pt grid, section gaps: 28pt)
Platform-appropriate styling
Safe area handling
Native animations (60fps)
Proper loading states
Accessibility labels on all interactive elements
Pull-to-refresh where appropriate
Feather icons (no emojis)
Pressable with press states (not TouchableOpacity)
Bottom padding on tab screens (100pt)
Null guards on optional data fields
Correct import/export style matching
Real product images where available (Unsplash, CDN)
Filter chips: consistent height/radius across all screens
Modal screens: CommonActions.reset() for clean exits
Banners: ImageBackground with colored overlays
Design token colors throughout (no hardcoded hex in components)
```

### Client Adaptation Checklist
```
When adapting this project for a new client:

1. Brand Colors
   - Update src/styles/colors.ts (primary, accent, loyalty, loan)
   - Update app.json splash backgroundColor
   - Replace logo PNG in src/assets/images/

2. Products & Data
   - Replace src/data/products.ts with client catalog
   - Update product images (REAL_IMG constant or equivalent)
   - Adjust categories and brands to client's portfolio

3. Location System
   - Replace src/data/locations.ts with client regions/stores
   - Adjust shipping costs, delivery times, free thresholds
   - Update store names and addresses

4. Business Rules
   - Loyalty: tier thresholds, multipliers, point rates
   - Loan: interest rates, min/max amounts, terms
   - Trade-in: brand base values, condition multipliers

5. App Identity
   - app.json: name, slug, bundleIdentifier, package
   - Update onboarding screens content
   - Replace promotional banner content

6. Context Files
   - Update CLAUDE.md with client-specific details
   - Keep ui-mobile.md as-is (generic patterns)
```
