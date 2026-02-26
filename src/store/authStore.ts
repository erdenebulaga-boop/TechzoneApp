import { create } from 'zustand';
import { mockUser, mockLoyalty, mockCreditProfile, mockWallet, mockLoans } from '../data/mockData';
import type { User, LoyaltyProfile, CreditProfile, WalletBalance, Loan } from '../data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  selectedRegionId: string;
  hasSelectedLocation: boolean;
  user: User | null;
  loyalty: LoyaltyProfile;
  credit: CreditProfile;
  wallet: WalletBalance;
  loans: Loan[];

  login: () => void;
  logout: () => void;
  setOnboarded: () => void;
  setRegion: (regionId: string) => void;
  updatePoints: (delta: number) => void;
  dailyCheckIn: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  hasOnboarded: false,
  selectedRegionId: 'ub',
  hasSelectedLocation: false,
  user: null,
  loyalty: mockLoyalty,
  credit: mockCreditProfile,
  wallet: mockWallet,
  loans: mockLoans,

  login: () => set({
    isAuthenticated: true,
    user: mockUser,
    loyalty: mockLoyalty,
    credit: mockCreditProfile,
    wallet: mockWallet,
    loans: mockLoans,
  }),

  logout: () => set({ isAuthenticated: false, user: null }),

  setOnboarded: () => set({ hasOnboarded: true }),

  setRegion: (regionId: string) => set({ selectedRegionId: regionId, hasSelectedLocation: true }),

  updatePoints: (delta: number) => set(state => ({
    loyalty: {
      ...state.loyalty,
      points: state.loyalty.points + delta,
      earnedThisMonth: delta > 0
        ? state.loyalty.earnedThisMonth + delta
        : state.loyalty.earnedThisMonth,
      burnedThisMonth: delta < 0
        ? state.loyalty.burnedThisMonth + Math.abs(delta)
        : state.loyalty.burnedThisMonth,
    },
  })),

  dailyCheckIn: () => set(state => ({
    loyalty: {
      ...state.loyalty,
      dailyStreak: state.loyalty.dailyStreak + 1,
      points: state.loyalty.points + 10,
      earnedThisMonth: state.loyalty.earnedThisMonth + 10,
      lastCheckIn: new Date().toISOString().split('T')[0],
    },
  })),
}));
