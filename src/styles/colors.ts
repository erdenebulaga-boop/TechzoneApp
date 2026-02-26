// Technozone Design Tokens — Colors
export const colors = {
  // Brand
  primary: '#0F2647',
  accent: '#EF3C23',

  // Primary Scale
  primary50: '#E8EDF4',
  primary100: '#C5D1E3',
  primary200: '#9EB3D0',
  primary300: '#7795BD',
  primary400: '#597EAF',
  primary500: '#3B67A1',
  primary600: '#355F99',
  primary700: '#2D548F',
  primary800: '#264A85',
  primary900: '#193974',

  // Accent Scale
  accent50: '#FDE8E5',
  accent100: '#FBC6BE',
  accent200: '#F8A093',
  accent300: '#F57A68',
  accent400: '#F25E47',
  accent500: '#EF3C23',
  accent600: '#E0361F',
  accent700: '#CD2E1A',
  accent800: '#BB2715',
  accent900: '#9B1A0C',

  // Module Colors
  shopPrimary: '#0F2647',
  loyaltyPrimary: '#F5A623',
  loyaltySecondary: '#FFF3D6',
  loanPrimary: '#0EA5E9',
  loanSecondary: '#E0F2FE',

  // Tier Colors
  tierBronze: '#CD7F32',
  tierSilver: '#C0C0C0',
  tierGold: '#FFD700',
  tierPlatinum: '#E5E4E2',

  // Surfaces
  background: '#FFFFFF',
  surface: '#F5F7FA',
  surfaceVariant: '#EEF1F5',
  surfaceElevated: '#FFFFFF',

  // Text
  onPrimary: '#FFFFFF',
  onAccent: '#FFFFFF',
  onSurface: '#0F2647',
  onSurfaceSecondary: '#4A5B6E',
  onSurfaceVariant: '#6B7A8D',
  onSurfaceMuted: '#9EABBA',

  // Feedback
  success: '#22C55E',
  successBg: '#DCFCE7',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  info: '#3B82F6',
  infoBg: '#DBEAFE',

  // Borders
  border: '#E2E8F0',
  borderFocused: '#0F2647',

  // Misc
  overlay: 'rgba(15, 38, 71, 0.5)',
  skeleton: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Module-specific color sets
export const moduleColors = {
  shop: { primary: colors.shopPrimary, bg: colors.primary50 },
  loyalty: { primary: colors.loyaltyPrimary, bg: colors.loyaltySecondary },
  loan: { primary: colors.loanPrimary, bg: colors.loanSecondary },
};

export const tierColors = {
  bronze: { primary: '#CD7F32', bg: '#FDF5EB', text: '#8B5E20' },
  silver: { primary: '#C0C0C0', bg: '#F5F5F5', text: '#6B6B6B' },
  gold: { primary: '#FFD700', bg: '#FFFBEB', text: '#92720A' },
  platinum: { primary: '#E5E4E2', bg: '#F8F8FF', text: '#4A4A5A' },
};
