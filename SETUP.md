# Technozone Mobile App — Setup Guide

## Prerequisites (Mac)

1. **Node.js** (v18+): `brew install node` or download from nodejs.org
2. **Xcode** (latest): Install from App Store
3. **Xcode Command Line Tools**: `xcode-select --install`
4. **CocoaPods**: `sudo gem install cocoapods`

## Quick Start

```bash
# 1. Navigate to the project
cd TechzoneApp

# 2. Install dependencies
npm install

# 3. Install iOS pods
cd ios && pod install && cd ..
# (If no ios folder yet, Expo will create it)

# 4. Run on iOS Simulator
npx expo run:ios
```

## Alternative: Using Expo Go (Fastest)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npx expo start

# 3. Press 'i' to open in iOS Simulator
#    Or scan QR code with Expo Go app on your phone
```

## Troubleshooting

**"expo-router" not found:**
```bash
npx expo install expo-router
```

**Pods not installing:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Clean rebuild:**
```bash
npx expo prebuild --clean
npx expo run:ios
```

**Missing dependencies:**
```bash
npx expo install --fix
```

## Project Structure

```
TechzoneApp/
├── App.tsx                          # Entry point
├── src/
│   ├── navigation/                  # React Navigation setup
│   │   ├── RootNavigator.tsx        # Root stack (auth + main)
│   │   └── BottomTabNavigator.tsx   # 5-tab bottom nav
│   ├── screens/                     # 25 screens
│   │   ├── auth/                    # Splash, Onboarding, SignIn
│   │   ├── home/                    # Home, Notifications, Search
│   │   ├── shop/                    # Shop, ProductDetail, Cart, Checkout, OrderConfirmation
│   │   ├── loyalty/                 # LoyaltyHome, SpinWheel, Challenges, Rewards, Badges, Leaderboard, Referral
│   │   ├── loan/                    # LoanHome, Calculator, Application, Payment
│   │   └── profile/                 # Profile, Wallet, OrderHistory, Settings
│   ├── store/                       # Zustand state (auth, cart)
│   ├── data/                        # Mock data (products, users, loans)
│   ├── styles/                      # Design tokens (colors, typography, spacing)
│   └── utils/                       # Formatters, calculators
├── app.json                         # Expo config
└── package.json                     # Dependencies
```

## Demo Flow for Client

1. **Splash → Onboarding** (3 slides showing 3 cores)
2. **Sign In** (any phone/password works)
3. **Home Tab**: See all 3 cores — loyalty card, loan widget, products
4. **Shop Tab**: Browse products → tap one → Product Detail → Add to Cart → Checkout
5. **Loyalty Tab**: Check-in, spin wheel, challenges, badges, leaderboard
6. **Loan Tab**: Calculator, apply for loan, see approval
7. **Profile Tab**: Full account overview, wallet, settings

## Tech Stack

- React Native + Expo (TypeScript)
- React Navigation v7 (bottom tabs + stacks)
- Zustand (state management)
- Mock data (no real API — all data is hardcoded)

## Brand Colors

- Navy: #0F2647 (primary)
- Orange: #EF3C23 (accent)
- Gold: #F5A623 (loyalty)
- Teal: #0EA5E9 (loan)
