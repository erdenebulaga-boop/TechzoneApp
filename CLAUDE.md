# Technozone Mobile App - Project Context

## Company

Technozone LLC is Mongolia's leading electronics retailer, established 2014, with 15 branches across Mongolia. 10-year anniversary in June 2026. Official distributor for Samsung, Huawei, Apple, DJI, Acefast, Oukitel, Ikarao, and Oscal. 11-40 employees. Current platform: Cody.mn (migrating to Dream Platform). Website: technozone.mn. Contact: info@technozone.mn, 7701-1818. Headquartered at Enkhtaivan Avenue 1a, Ulaanbaatar.

## Full Platform Vision (from Proposal)

The Dream Platform PREMIUM package includes 10 modules: Product Engine, Commerce Engine, Payment Engine, Inventory (Odoo ERP), CMS, CRM, Finance, Loyalty (Odoo POS), Marketing, and Logistics. Two channels: B2C (technozone.mn + iOS/Android app) and B2B portal (b2b.technozone.mn). Strategic goals: digital experience upgrade, online revenue growth, "Technozone Point" loyalty ecosystem, mobile-first app, B2B portal, and omni-channel experience.

This demo app focuses on the **B2C mobile app** portion of the full platform.

## Project Overview

A React Native Expo mobile app demo with 3 interconnected cores:

1. **E-Commerce** — Product catalog, cart, checkout, order tracking
2. **Loyalty / Gamification** — Points, tiers, daily spin, challenges, badges, leaderboard, referrals
3. **NBFI Loan** — Micro-lending for product purchases, integrated credit scoring, installment tracking

The app is a demo/prototype running in Expo Go on iOS Simulator. It uses mock data throughout (no backend).

### Proposal Tab Structure vs Demo
The original proposal defines 5 tabs: Home, Shop, Loan, Wallet, Profile. The demo adapts this to: Home, Shop, Points (Loyalty), Loan, Profile — with Wallet as a sub-screen under Profile instead of a top-level tab, and Loyalty/Gamification promoted to a tab for demo showcase purposes.

### Additional Services (from Proposal)
- **Trade-In** — IMPLEMENTED. Two options: manual spec form or auto-detect. Shows estimated value based on brand, condition, storage, battery, screen. See `TradeInScreen.tsx` + `tradeInData.ts`.
- **E-Warranty** — Digital warranty registration, claims, extension (not yet in demo)
- **Pre-Order** — Reserve upcoming products with deposit (Samsung Galaxy S26 Ultra has "Coming Soon" badge)
- **Gift Cards** — Purchase, send, redeem (₮10k–₮500k)
- **Click & Collect** — Same-day in-store pickup (UI in checkout, no full flow)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 + Expo SDK 54 (managed) |
| Language | TypeScript 5.9 |
| Navigation | React Navigation v7 (`@react-navigation/native-stack` + `@react-navigation/bottom-tabs`) |
| State | Zustand v5 |
| Icons | `@expo/vector-icons` (Feather set) — bundled with Expo, no install needed |
| Animations | `react-native-reanimated` 4.1 |
| Safe Area | `react-native-safe-area-context` 5.6 |
| Storage | `@react-native-async-storage/async-storage` 2.2 |

## Project Structure

```
TechzoneApp/
  app.json                    # Expo config (bundleId: mn.technozone.app)
  package.json
  index.ts                    # Entry point
  src/
    assets/
      images/
        technozone-logo.png   # Real company logo (4096x857 PNG)
    components/
      common/
        index.ts              # Barrel export
        Icon.tsx              # Feather icon wrapper
        AppButton.tsx         # Pressable button (44pt min)
        Card.tsx              # Card with platform shadow
        SectionHeader.tsx     # Section title + "See all"
        IconButton.tsx        # Icon button with optional badge
        SimpleSlider.tsx      # Custom slider (PanResponder-based, replaces removed RN Slider)
        TechnozoneLogo.tsx    # Text-based logo component (backup, actual PNG preferred)
      LocationPickerModal.tsx # Region/store picker modal (used by Home, Settings)
    data/
      products.ts             # Product catalog (21 items incl S26), categories, brands, helpers, REAL_IMG constants
      locations.ts            # Regions, stores, shipping configs + helpers
      tradeInData.ts          # Trade-in pricing logic, spec options, mock auto-detect
      mockData.ts             # All mock data: user, loyalty, challenges, badges, spin wheel,
                              # loans, credit profile, wallet, transactions, leaderboard,
                              # notifications, rewards
    navigation/
      RootNavigator.tsx       # NativeStackNavigator — auth flow + main stack
      BottomTabNavigator.tsx  # 5 tabs: Home, Shop, Points, Loan, Profile
    screens/
      auth/
        SplashScreen.tsx
        OnboardingScreen.tsx
        WelcomeScreen.tsx       # Welcome landing page — Sign In, Register, Browse as Guest
        SignInScreen.tsx
      home/
        HomeScreen.tsx        # Main feed — logo, banners (ImageBackground), loyalty card, flash deals, categories
        SearchScreen.tsx
        NotificationScreen.tsx
      shop/
        ShopScreen.tsx        # Product grid with category filter (Pressable chips, real images)
        ProductDetailScreen.tsx
        CartScreen.tsx
        CheckoutScreen.tsx    # 3-step modal (delivery → payment → review), location-aware
        OrderConfirmationScreen.tsx  # Uses CommonActions.reset() to exit modal stack
      loyalty/
        LoyaltyHomeScreen.tsx # Points dashboard, daily check-in, quick actions, activity
        SpinWheelScreen.tsx
        ChallengesScreen.tsx
        RewardsScreen.tsx
        BadgesScreen.tsx
        LeaderboardScreen.tsx
        ReferralScreen.tsx
      loan/
        LoanHomeScreen.tsx    # Credit score, active loans, quick actions
        LoanCalculatorScreen.tsx
        LoanApplicationScreen.tsx
        PaymentScreen.tsx
      profile/
        ProfileScreen.tsx     # iOS Settings-style grouped list
        WalletScreen.tsx
        OrderHistoryScreen.tsx
        SettingsScreen.tsx
      tradein/
        TradeInScreen.tsx     # Trade-in flow: manual form + auto-detect + estimate
    store/
      authStore.ts            # Auth, user, loyalty, credit, wallet, loans, location
      cartStore.ts            # Cart items, points, computed totals
    styles/
      colors.ts               # Design tokens (NAMED exports only)
      typography.ts
      spacing.ts
      index.ts                # Re-exports
    utils/
      formatters.ts
```

## Location System

5 regions with location-aware shipping, delivery times, and closest store:

| Region | Stores | Shipping | Free Threshold | Delivery |
|--------|--------|----------|----------------|----------|
| Ulaanbaatar | 5 | ₮10,000 | ₮500K | 1-2 days |
| Darkhan-Uul | 1 | ₮15,000 | ₮500K | 2-3 days |
| Orkhon (Erdenet) | 1 | ₮15,000 | ₮500K | 2-3 days |
| Khentii | 0 | ₮25,000 | ₮800K | 4-6 days |
| Umnugovi | 0 | ₮30,000 | ₮800K | 5-7 days |

- **State**: `authStore.selectedRegionId` + `authStore.hasSelectedLocation`
- **Auto-picker**: LocationPickerModal shows on first HomeScreen visit
- **Changeable**: From Home screen location bar or Settings → Location / Default Store
- **Integration**: ProductDetailScreen shows closest store + shipping info, CheckoutScreen uses dynamic delivery fee/timing
- **Data**: `src/data/locations.ts` exports `regions`, `allStores`, `shippingConfigs`, helpers

## Business Rules (from Proposal)

### Loyalty System — "Technozone Point"
- **Tiers**: Bronze (0–9,999 pts), Silver (10,000–24,999), Gold (25,000–49,999), Platinum (50,000+)
- **Earning multipliers**: Bronze 1x, Silver 1.5x, Gold 2x, Platinum 3x
- **Points earning**: 1 pt per ₮100 spent, Reviews +50 pts, Referrals +500 pts, Birthday +1,000 pts
- **Points redemption**: 100 pts = ₮10 discount
- **Tier benefits**: Silver gets priority support; Gold gets exclusive deals + free shipping; Platinum gets VIP support, early access, special gifts

### NBFI Loan Specs
- **Loan range**: ₮100,000 – ₮2,000,000
- **Terms**: 3, 6, 12, or 24 months
- **Interest rate**: 1.5% per month
- **Eligibility**: Age 18–65, Mongolian citizen/resident, stable income, valid ID
- **Application flow** (5 steps): Loan Amount & Term → Personal Info → Document Upload → Credit Check & Approval → E-Signature & Disbursement
- **Disbursement options**: Apply to current order, transfer to wallet, or bank transfer

### 3-Core Integration Points
- **NBFI × E-commerce**: Loan calculator on product page, loan as checkout payment, auto-link order to loan
- **NBFI × Loyalty**: On-time payment +100 pts, early repayment +500 pts, use points to reduce loan amount, Gold/Platinum get lower interest rates
- **NBFI × Services**: Trade-in credit applied to loan, extended warranty with loan, loan pre-approval for pre-orders

### Payment Methods (Full Platform)
QPay, MobiPay, SocialPay, Credit/Debit Card, BNPL partners (Omniway/Sono/LendDy), Technozone NBFI Loan, Loyalty Points, Gift Cards, Cash on Delivery

## Design Tokens

### Colors (from `src/styles/colors.ts`)
```
Brand:        primary=#0F2647 (Navy), accent=#EF3C23 (Orange)
Loyalty:      #F5A623 (Gold), #FFF3D6 (light)
Loan:         #0EA5E9 (Teal), #E0F2FE (light)
Surfaces:     background=#FFFFFF, surface=#F5F7FA, border=#E2E8F0
Text:         onSurface=#0F2647, secondary=#4A5B6E, variant=#6B7A8D, muted=#9EABBA
Feedback:     success=#22C55E, warning=#F59E0B, error=#EF4444, info=#3B82F6
Tiers:        bronze=#CD7F32, silver=#C0C0C0, gold=#FFD700, platinum=#E5E4E2
```

### Tab Bar
- 5 tabs: Home (home), Shop (shopping-bag), Points (award), Loan (credit-card), Profile (user)
- iOS height: 83pt (includes home indicator), Android: 65pt
- Active color: `colors.primary`, Inactive: `colors.onSurfaceVariant`
- Cart badge on Shop tab shows item count

## Data Models

### Product (`data/products.ts`)
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;                              // in MNT (Tugrik)
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  loyaltyPoints: number;
  category: string;                           // 'smartphones'|'laptops'|'wearables'|'tv'|'audio'|'accessories'|'smarthome'
  inStock: boolean;
  stockCount: number;
  loanAvailable: boolean;
  badges: string[];                           // display badges like "New", "Loan"
  variants?: { label: string; options: string[] }[];  // NOT strings — objects with label+options
  description: string;
  specs?: Record<string, string>;             // NOT arrays — key-value pairs
  isNew?: boolean;
  isFlashDeal?: boolean;
}
```

### Cart (`store/cartStore.ts`)
```typescript
interface CartItem {
  product: Product;       // Full product object (NOT just productId)
  quantity: number;
  selectedVariants?: Record<string, string>;
}

// API methods:
// addItem(product, quantity?, variants?) — adds or increments
// removeItem(productId) — removes by product.id
// updateQuantity(productId, quantity) — updates or removes if 0
// subtotal() — computed, NOT getSubtotal()
// totalItems() — computed
// pointsDiscount() — pointsToUse * 10
// deliveryFee() — 0 if subtotal >= 500,000, else 10,000
// total() — subtotal - pointsDiscount + deliveryFee
```

### Auth/User (`store/authStore.ts`)
```typescript
// State: isAuthenticated, hasOnboarded, user, loyalty, credit, wallet, loans, selectedRegionId, hasSelectedLocation
// Actions: login(), logout(), setOnboarded(), updatePoints(delta), dailyCheckIn(), setSelectedRegion(), setSelectedLocation()

interface LoyaltyProfile {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number;         // 0-1
  nextTierPoints: number;
  dailyStreak: number;
  // ... earnedThisMonth, burnedThisMonth, expiringPoints, memberId, referralCode
}
```

### Transaction (`data/mockData.ts`)
```typescript
interface Transaction {
  id: string;
  type: 'purchase' | 'loan_payment' | 'points_earned' | 'points_redeemed' | 'topup' | 'spin' | 'checkin';
  title: string;          // display title
  amount?: number;        // OPTIONAL — monetary amount
  points?: number;        // OPTIONAL — points earned/spent
  date: string;
  icon: string;           // currently emoji in some screens, migrating to Feather names
}
```

## Export/Import Rules (CRITICAL)

These must be followed exactly to avoid runtime crashes:

| File | Export Style | Import As |
|------|-------------|-----------|
| `styles/colors.ts` | `export const colors` (named) | `import { colors } from '../../styles/colors'` |
| `HomeScreen.tsx` | `export const HomeScreen` (named) | `import { HomeScreen } from ...` |
| `LoyaltyHomeScreen.tsx` | `export const LoyaltyHomeScreen` (named) | `import { LoyaltyHomeScreen } from ...` |
| `ShopScreen.tsx` | `export default ShopScreen` | `import ShopScreen from ...` |
| `LoanHomeScreen.tsx` | `export default LoanHomeScreen` | `import LoanHomeScreen from ...` |
| `ProfileScreen.tsx` | `export default ProfileScreen` | `import ProfileScreen from ...` |
| `CartScreen.tsx` | `export default CartScreen` | `import CartScreen from ...` |
| `ProductDetailScreen.tsx` | `export default ProductDetailScreen` | `import ProductDetailScreen from ...` |
| `CheckoutScreen.tsx` | `export default CheckoutScreen` | `import CheckoutScreen from ...` |
| `OrderConfirmationScreen.tsx` | `export default OrderConfirmationScreen` | `import OrderConfirmationScreen from ...` |
| All 6 loyalty sub-screens | `export const XxxScreen` (named) | `import { XxxScreen } from ...` |
| `NotificationScreen.tsx` | `export const NotificationScreen` (named) | `import { NotificationScreen } from ...` |
| `SearchScreen.tsx` | `export const SearchScreen` (named) | `import { SearchScreen } from ...` |
| `WelcomeScreen.tsx` | `export const WelcomeScreen` (named) | `import { WelcomeScreen } from ...` |
| `LocationPickerModal.tsx` | `export const LocationPickerModal` (named) | `import { LocationPickerModal } from ...` |
| `TradeInScreen.tsx` | `export const TradeInScreen` (named) | `import { TradeInScreen } from ...` |

## Known Gotchas

1. **Feather icons**: Do NOT pass `strokeWidth` prop — it causes a warning. Use only `name`, `size`, `color`.
2. **Invalid icon names**: "flame", "fire", "coins" do not exist in Feather. Use "trending-up", "zap", "dollar-sign" respectively.
3. **Slider removed**: `import { Slider } from 'react-native'` crashes. Use `SimpleSlider` custom component.
4. **ProgressBarAndroid removed**: Do not import from react-native.
5. **Tab bar overlap**: All 5 tab screens MUST have `paddingBottom: 100` in their scroll content.
6. **Cart item shape**: `item.product.id` not `item.productId`. `cartStore.subtotal()` not `cartStore.getSubtotal()`.
7. **Variants/specs rendering**: Variants are `{label, options}[]`, specs are `Record<string,string>`. Must iterate properly.
8. **Transaction optional fields**: `tx.points` and `tx.amount` are optional. Always null-check before using.
9. **Navigation package**: Use `@react-navigation/native-stack` (NOT `@react-navigation/stack` which isn't installed).
10. **Logo**: Real logo at `src/assets/images/technozone-logo.png` (275KB, 4096x857). Use `require()` and `resizeMode="contain"`.
11. **Modal stack navigation**: Checkout and OrderConfirmation use `presentation: 'modal'`. To properly exit, use `CommonActions.reset()` — NOT `navigation.navigate()` which creates infinite modal stacking.
12. **Filter chips pattern**: Use `Pressable` with `height: 36-38`, `borderRadius: 18-19`, design token colors. Do NOT use `maxHeight` on ScrollView containers (causes clipping). Use explicit `height` on individual chips.
13. **Color tokens**: Valid text colors are `colors.onSurface`, `colors.onSurfaceSecondary`, `colors.onSurfaceVariant`, `colors.onSurfaceMuted`. There is no `colors.text` or `colors.textSecondary`.
14. **ImageBackground banners**: Promotional banners use `ImageBackground` with semi-transparent colored overlays (`{backgroundColor: \`${color}CC\`}`). Flash deals use dark gradient overlays.
15. **Product images**: 9 key products use real Unsplash URLs stored in `REAL_IMG` constant in `products.ts`. Others use placehold.co.
16. **Pressable over TouchableOpacity**: All new/updated code uses `Pressable` with `({ pressed }) => [style, pressed && { opacity: 0.85 }]` pattern. Do not introduce new `TouchableOpacity` usage.

## Screens Still Using Emojis (Need Migration)

The following screens still use emoji icons in their data/UI and should be migrated to Feather icons:

- `SpinWheelScreen.tsx` — spin segments use emojis
- `ChallengesScreen.tsx` — challenge icons are emojis
- `RewardsScreen.tsx` — reward icons are emojis
- `BadgesScreen.tsx` — badge icons are emojis
- `LeaderboardScreen.tsx` — tier display
- `ReferralScreen.tsx`
- `NotificationScreen.tsx` — notification icons are emojis
- `SearchScreen.tsx`
- `OnboardingScreen.tsx`
- `SignInScreen.tsx`
- `CheckoutScreen.tsx`
- `WalletScreen.tsx`
- `OrderHistoryScreen.tsx`
- `SettingsScreen.tsx`
- `LoanApplicationScreen.tsx`
- `PaymentScreen.tsx`
- `LoanCalculatorScreen.tsx`
- `data/mockData.ts` — transaction/badge/challenge/notification icons are emojis
- `data/products.ts` — category/brand icons are emojis, badge strings contain emojis

## UI/UX Patterns Established

### Filter Chips (consistent across all screens)
```typescript
// Container: no maxHeight, horizontal ScrollView
<View style={styles.filterContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {items.map(item => (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.filterChip,
          isActive && styles.filterChipActive,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => setFilter(item.id)}
      >
        <Feather name={item.icon} size={14} color={isActive ? '#FFFFFF' : colors.onSurfaceSecondary} />
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{item.name}</Text>
      </Pressable>
    ))}
  </ScrollView>
</View>

// Chip styles: height: 36, borderRadius: 18, paddingHorizontal: 14, gap: 6
// Active: backgroundColor: colors.primary, text: #FFFFFF
// Inactive: backgroundColor: colors.surface, borderColor: colors.border, text: colors.onSurfaceSecondary
```

### Product Cards (ShopScreen pattern)
```typescript
// Real Image component with fallback, star ratings, loan badge, original price strikethrough
// Uses item.image URL, dimensions: width 48%, aspectRatio: 1, borderRadius: 12
// Price in accent color, original price with strikethrough in muted color
```

### Banner Cards (HomeScreen pattern)
```typescript
// ImageBackground with colored overlay, promotional text, arrow icon
// Flash deals: screenWidth * 0.7, height: 180, dark gradient, discount badge
// New arrivals: same treatment with NEW/COMING SOON badges
```

### Modal Exit Pattern
```typescript
// For screens presented as modals (presentation: 'modal'), always use:
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Main', params: { screen: 'TargetTab' } }],
  })
);
// NEVER use navigation.navigate() from inside a modal — it stacks infinitely
```

### Trade-In Flow Pattern
```typescript
// Multi-view state machine within a single screen
type ViewState = 'options' | 'manual' | 'detecting' | 'detected' | 'result';
// Options: hero + 2 option cards + "How it works"
// Manual: picker components for brand/storage/condition/screen/battery + model input
// Detecting: animated progress bar with checklist items
// Detected: device info card with spec chips
// Result: value card + breakdown table + disclaimer + action buttons
```

## How to Run

```bash
cd ~/Desktop/Technozone/TechzoneApp
npx expo start
# Press 'i' for iOS Simulator
# Press 'a' for Android emulator
# Press 'r' to reload
```

## Currency

All prices are in MNT (Mongolian Tugrik). Symbol: tugrik sign or "Tr". Format: `price.toLocaleString()` + " Tr" or unicode tugrik sign `\u20AE`.

## Language

The app UI is in English. Mock user data and some product descriptions use Mongolian (Cyrillic script). Store names and some challenge titles are in Mongolian.

## Reference Documents

- `Dreamon_proposal_v1_Technozone_@20260202.md` — Full Dream Platform proposal (PREMIUM package, 10 modules, B2C+B2B channels, strategic goals, pricing). Written in Mongolian.
- `technozone_b2c_nbfi_structure.md` — Complete B2C app + website wireframe structure (1860 lines). Covers all mobile tabs, loan application 5-step flow, wallet multi-currency, e-warranty, trade-in, pre-order, notification strategy, website pages, data models, and integration points.
- `technozone_design_tokens.md` — Design token reference with full color palette, typography scale, and spacing system.
- `technozone_development_plan_v2.md` — Development plan with phases and milestones.
- `technozone_mobile_app_sitemap_v2.md` — Full mobile app sitemap with all screens and navigation flows.
- `ui-mobile.md` — Mobile UI skill file with React Native patterns, accessibility standards, Feather icon rules, and known gotchas. Reusable across similar projects.
- `TechzoneApp/README.md` — Developer hand-off README with quick start, architecture, and adaptation guide.

## Adapting for Other Clients

This project serves as a **reusable template** for electronics/retail B2C apps. Key customization points:

1. **Brand identity**: `src/styles/colors.ts` (primary, accent), logo PNG, `app.json` (name, bundleId, splash)
2. **Product catalog**: `src/data/products.ts` — swap products, keep interface
3. **Location system**: `src/data/locations.ts` — swap regions, stores, shipping configs
4. **Trade-in values**: `src/data/tradeInData.ts` — adjust brand base values, condition multipliers
5. **Loyalty rules**: Tier thresholds, multipliers, point earning rates in `mockData.ts` + `authStore.ts`
6. **Loan terms**: Interest rates, ranges, eligibility in loan screens + `mockData.ts`
7. **Context files**: Use this `CLAUDE.md` and `ui-mobile.md` as starting templates
