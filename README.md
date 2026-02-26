# Technozone Mobile App

A React Native Expo demo app for **Technozone LLC**, Mongolia's leading electronics retailer. This is a fully functional prototype showcasing three interconnected product pillars: E-Commerce, Loyalty/Gamification, and NBFI Micro-Lending.

> **Status**: Demo / Prototype — uses mock data throughout (no backend). Built to run in Expo Go on iOS Simulator or Android emulator.

---

## Quick Start

```bash
# Prerequisites: Node.js 18+, Expo CLI, iOS Simulator (Xcode) or Android emulator

# Install dependencies
cd TechzoneApp
npm install

# Start Expo dev server
npx expo start

# Then press:
#   i — open iOS Simulator
#   a — open Android emulator
#   r — reload
```

**Bundle identifier**: `mn.technozone.app`

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native + Expo (managed) | RN 0.81.5, SDK 54 |
| Language | TypeScript | 5.9 |
| Navigation | React Navigation v7 | native-stack + bottom-tabs |
| State | Zustand | 5.x |
| Icons | @expo/vector-icons (Feather set) | bundled with Expo |
| Animations | react-native-reanimated | 4.1 |
| Safe Area | react-native-safe-area-context | 5.6 |
| Storage | @react-native-async-storage/async-storage | 2.2 |

---

## Architecture Overview

### Three Cores

1. **E-Commerce** — Product catalog (21 items), category/brand filtering, cart with variant selection, 3-step checkout (delivery → payment → review), order confirmation with loyalty points celebration.

2. **Loyalty & Gamification** ("Technozone Point") — 4-tier system (Bronze → Platinum) with earning multipliers, daily spin wheel, challenges, badges, leaderboard, referral program, and a rewards marketplace.

3. **NBFI Loan** — Micro-lending for product purchases (₮100K–₮2M, 3–24 months at 1.5%/month). Credit score dashboard, loan calculator, 5-step application flow, installment tracking with loyalty integration.

### Navigation Structure

```
RootNavigator (NativeStack)
├── Auth Flow
│   ├── SplashScreen
│   ├── OnboardingScreen (3-page swiper)
│   ├── WelcomeScreen (Sign In / Register / Guest)
│   └── SignInScreen
│
└── Main (BottomTabNavigator — 5 tabs)
    ├── Home     — Feed with banners, loyalty card, flash deals, categories
    ├── Shop     — Product grid with category/brand filters
    ├── Points   — Loyalty dashboard, daily check-in, quick actions
    ├── Loan     — Credit score, active loans, quick actions
    └── Profile  — Settings-style grouped list, wallet, orders, settings

    + Modal/Push Screens:
      ProductDetail, Cart, Checkout (modal), OrderConfirmation (modal),
      SpinWheel, Challenges, Rewards, Badges, Leaderboard, Referral,
      LoanCalculator, LoanApplication (modal), Payment,
      Wallet, OrderHistory, Settings, Notifications, Search, TradeIn
```

### State Management

Two Zustand stores:

- **`authStore`** — Authentication state, user profile, loyalty data, credit profile, wallet, active loans, location selection.
- **`cartStore`** — Cart items, points usage, computed totals (subtotal, delivery fee, discounts).

---

## Project Structure

```
TechzoneApp/
├── app.json                          # Expo config
├── package.json
├── index.ts                          # Entry point (registerRootComponent)
├── src/
│   ├── assets/images/
│   │   └── technozone-logo.png       # Company logo (4096×857 PNG)
│   ├── components/
│   │   ├── common/                   # Shared UI components
│   │   │   ├── Icon.tsx              # Feather icon wrapper
│   │   │   ├── AppButton.tsx         # Primary button (44pt min touch)
│   │   │   ├── Card.tsx              # Card with platform shadow
│   │   │   ├── SectionHeader.tsx     # Section title + "See all" link
│   │   │   ├── IconButton.tsx        # Icon button with optional badge
│   │   │   ├── SimpleSlider.tsx      # PanResponder slider (replaces removed RN Slider)
│   │   │   ├── TechnozoneLogo.tsx    # Text-based fallback logo
│   │   │   └── index.ts             # Barrel exports
│   │   └── LocationPickerModal.tsx   # Region/store picker
│   ├── data/
│   │   ├── products.ts              # 21 products, categories, brands, helpers
│   │   ├── locations.ts             # 5 regions, 7 stores, shipping configs
│   │   ├── tradeInData.ts           # Trade-in pricing logic + auto-detect mock
│   │   └── mockData.ts              # User, loyalty, loans, transactions, etc.
│   ├── navigation/
│   │   ├── RootNavigator.tsx         # Root stack (auth flow + main)
│   │   └── BottomTabNavigator.tsx    # 5-tab bottom navigation
│   ├── screens/
│   │   ├── auth/                     # Splash, Onboarding, Welcome, SignIn
│   │   ├── home/                     # Home, Search, Notifications
│   │   ├── shop/                     # Shop, ProductDetail, Cart, Checkout, OrderConfirmation
│   │   ├── loyalty/                  # LoyaltyHome, SpinWheel, Challenges, Rewards, Badges, Leaderboard, Referral
│   │   ├── loan/                     # LoanHome, Calculator, Application, Payment
│   │   ├── profile/                  # Profile, Wallet, OrderHistory, Settings
│   │   └── tradein/                  # TradeIn (manual form + auto-detect)
│   ├── store/
│   │   ├── authStore.ts              # Auth + user + loyalty + credit + wallet
│   │   └── cartStore.ts             # Cart items + computed totals
│   ├── styles/
│   │   ├── colors.ts                # Design tokens (named exports only)
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts                 # Re-exports
│   └── utils/
│       └── formatters.ts            # Price/date formatting helpers
```

---

## Design System

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0F2647` | Navy — headers, tab active, primary buttons |
| `accent` | `#EF3C23` | Orange — CTAs, prices, badges |
| `loyaltyPrimary` | `#F5A623` | Gold — points, tier badges, spin wheel |
| `loanPrimary` | `#0EA5E9` | Teal — loan UI, credit score |
| `success` | `#22C55E` | Confirmations, positive states |
| `error` | `#EF4444` | Errors, destructive actions |
| `surface` | `#F5F7FA` | Card backgrounds, sections |
| `border` | `#E2E8F0` | Dividers, card borders |

### Tier Colors (Loyalty)

Bronze `#CD7F32`, Silver `#C0C0C0`, Gold `#FFD700`, Platinum `#E5E4E2`

### Icons

All icons use `@expo/vector-icons` **Feather** set. No emojis in system UI.

```tsx
import { Feather } from '@expo/vector-icons';
<Feather name="home" size={22} color={colors.primary} />
```

### Tab Bar

5 tabs: Home (`home`), Shop (`shopping-bag`), Points (`award`), Loan (`credit-card`), Profile (`user`)

---

## Key Business Rules

### Loyalty System

| Tier | Points Range | Multiplier |
|------|-------------|------------|
| Bronze | 0 – 9,999 | 1x |
| Silver | 10,000 – 24,999 | 1.5x |
| Gold | 25,000 – 49,999 | 2x |
| Platinum | 50,000+ | 3x |

Earning: 1 pt per ₮100 spent. Redemption: 100 pts = ₮10 discount.

### NBFI Loan

- Range: ₮100,000 – ₮2,000,000
- Terms: 3, 6, 12, or 24 months
- Interest: 1.5% per month
- Application: 5-step flow (Amount → Personal Info → Documents → Credit Check → E-Signature)

### Location System

5 regions with differentiated shipping (₮10K–₮30K), delivery times (1–7 days), and free-shipping thresholds (₮500K–₮800K). Auto-picker on first visit; changeable from Home or Settings.

### Trade-In

Two options: manual spec form or auto-detect. Calculates estimated value based on brand, storage, condition, battery health, and screen condition.

---

## Data Models (Key Interfaces)

### Product

```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;                    // MNT (Tugrik)
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  loyaltyPoints: number;
  category: string;                 // smartphones | laptops | wearables | tv | audio | accessories | smarthome
  inStock: boolean;
  stockCount: number;
  loanAvailable: boolean;
  badges: string[];
  variants?: { label: string; options: string[] }[];
  specs?: Record<string, string>;
  isNew?: boolean;
  isFlashDeal?: boolean;
}
```

### CartItem

```typescript
interface CartItem {
  product: Product;               // Full object, NOT productId
  quantity: number;
  selectedVariants?: Record<string, string>;
}
```

---

## Export/Import Convention

The project uses a mix of named and default exports. **This must be followed exactly** to avoid runtime crashes:

| Screen | Export | Import |
|--------|--------|--------|
| `HomeScreen` | named | `import { HomeScreen }` |
| `ShopScreen` | default | `import ShopScreen` |
| `LoyaltyHomeScreen` | named | `import { LoyaltyHomeScreen }` |
| `LoanHomeScreen` | default | `import LoanHomeScreen` |
| `ProfileScreen` | default | `import ProfileScreen` |
| All 6 loyalty sub-screens | named | `import { XxxScreen }` |
| `TradeInScreen` | named | `import { TradeInScreen }` |
| `styles/colors.ts` | named | `import { colors }` (never default) |

Full table in `CLAUDE.md`.

---

## Known Gotchas & Debugging Guide

1. **Feather icons** — Do NOT pass `strokeWidth` prop (causes warning). Invalid names like "flame", "fire", "coins" will crash; use "trending-up", "zap", "dollar-sign".

2. **Removed RN APIs** — `Slider` and `ProgressBarAndroid` are removed from react-native core. Use `SimpleSlider` component instead.

3. **Tab bar overlap** — All 5 tab screens MUST have `paddingBottom: 100` in their scroll content container.

4. **Cart data shape** — Access via `item.product.id`, not `item.productId`. Use `cartStore.subtotal()`, not `getSubtotal()`.

5. **Variants vs Specs** — Variants are `{label, options}[]` objects, specs are `Record<string,string>`. Rendering a variant as a string will crash.

6. **Optional fields** — `tx.points` and `tx.amount` on transactions are optional. Always null-check.

7. **Navigation package** — Use `@react-navigation/native-stack` (not `@react-navigation/stack`).

8. **Modal navigation** — Checkout and OrderConfirmation use `presentation: 'modal'`. To properly exit the modal stack, use `CommonActions.reset()` (not `navigation.navigate()`).

9. **Logo** — Real PNG at `src/assets/images/technozone-logo.png` (275KB, 4096×857). Use `require()` + `resizeMode="contain"`.

---

## Screens Still Using Emojis (Backlog)

These screens use emoji characters for icons and should be migrated to Feather icons for consistency:

SpinWheelScreen, ChallengesScreen, RewardsScreen, BadgesScreen, LeaderboardScreen, ReferralScreen, NotificationScreen, SearchScreen, OnboardingScreen, SignInScreen, CheckoutScreen, OrderConfirmationScreen, WalletScreen, OrderHistoryScreen, SettingsScreen, LoanApplicationScreen, PaymentScreen, LoanCalculatorScreen, `mockData.ts`, `products.ts` (category/brand icons).

---

## Features Not Yet Implemented

These are defined in the proposal but not built in this demo:

- **E-Warranty** — Digital warranty registration, claims, extension
- **Pre-Order** — Reserve upcoming products with deposit
- **Gift Cards** — Purchase, send, redeem (₮10K–₮500K)
- **Click & Collect** — Same-day in-store pickup (UI exists in checkout, no full flow)
- **B2B Portal** — Separate channel (b2b.technozone.mn)
- **Backend integration** — All data is mock; no API layer exists
- **Push notifications** — UI exists, no actual notification system
- **Payment gateway** — QPay, SocialPay, etc. (UI radio buttons only)

---

## Reference Documents

| File | Description |
|------|-------------|
| `CLAUDE.md` | AI context file — complete project context, data models, export rules, gotchas |
| `ui-mobile.md` | Mobile UI skill — React Native patterns, accessibility, Feather rules, spacing |
| `Dreamon_proposal_v1_Technozone_@20260202.md` | Full Dream Platform proposal (Mongolian) |
| `technozone_b2c_nbfi_structure.md` | Complete B2C wireframe structure (1860 lines) |
| `technozone_design_tokens.md` | Design token reference |
| `technozone_development_plan_v2.md` | Development plan |
| `technozone_mobile_app_sitemap_v2.md` | Full app sitemap |

---

## Currency

All prices in **MNT (Mongolian Tugrik)**. Format: `price.toLocaleString()` + unicode tugrik sign `\u20AE` or `₮`.

## Language

App UI is in English. Mock user data and store names use Mongolian (Cyrillic script).

---

## Adapting for Other Clients

This app was built as a reusable template. To adapt for another electronics/retail client:

1. **Brand**: Update `colors.ts` (primary, accent), replace logo in `assets/images/`, update `app.json` (name, bundleId, splash color).
2. **Products**: Replace `data/products.ts` with client's catalog. Keep the `Product` interface.
3. **Locations**: Update `data/locations.ts` with client's regions/stores/shipping.
4. **Trade-In**: Update `data/tradeInData.ts` with brand base values and condition multipliers.
5. **Loyalty rules**: Adjust tier thresholds and multipliers in `data/mockData.ts` and `authStore.ts`.
6. **Loan terms**: Update interest rates and ranges in loan screens and `mockData.ts`.
7. **Context files**: Copy `CLAUDE.md` and `ui-mobile.md` as starting points, update with client-specific details.

See `ui-mobile.md` for reusable mobile UI patterns that apply across all clients.
