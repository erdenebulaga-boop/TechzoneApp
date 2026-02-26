// Technozone Trade-In — Mock pricing data and estimation logic

export interface TradeInSpecs {
  brand: string;
  model: string;
  storage: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  screenCondition: 'perfect' | 'minor_scratches' | 'cracked' | 'broken';
  batteryHealth: '90+' | '80-90' | '70-80' | 'below70';
}

export interface TradeInEstimate {
  baseValue: number;
  conditionMultiplier: number;
  storageBonus: number;
  batteryAdjustment: number;
  screenAdjustment: number;
  totalEstimate: number;
  specs: TradeInSpecs;
}

// ─── Base Values by Brand ─────────────────────────────────
const brandBaseValues: Record<string, number> = {
  Samsung: 400_000,
  Apple: 500_000,
  Huawei: 300_000,
  Xiaomi: 250_000,
  Other: 150_000,
};

// ─── Condition Multipliers ────────────────────────────────
const conditionMultipliers: Record<string, number> = {
  excellent: 1.0,
  good: 0.8,
  fair: 0.5,
  poor: 0.3,
};

// ─── Storage Bonus ────────────────────────────────────────
const storageBonuses: Record<string, number> = {
  '1TB': 150_000,
  '512GB': 100_000,
  '256GB': 50_000,
  '128GB': 0,
  '64GB': -50_000,
};

// ─── Battery Health Adjustment ────────────────────────────
const batteryAdjustments: Record<string, number> = {
  '90+': 20_000,
  '80-90': 0,
  '70-80': -40_000,
  'below70': -80_000,
};

// ─── Screen Condition Adjustment ──────────────────────────
const screenAdjustments: Record<string, number> = {
  perfect: 0,
  minor_scratches: -20_000,
  cracked: -100_000,
  broken: -200_000,
};

// ─── Picker Options ───────────────────────────────────────
export const brandOptions = ['Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Other'];
export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
export const conditionOptions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'good', label: 'Good', description: 'Minor signs of use' },
  { value: 'fair', label: 'Fair', description: 'Noticeable wear and tear' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, functional issues' },
];
export const screenOptions = [
  { value: 'perfect', label: 'Perfect', description: 'No scratches or damage' },
  { value: 'minor_scratches', label: 'Minor Scratches', description: 'Light surface scratches' },
  { value: 'cracked', label: 'Cracked', description: 'Screen has cracks but works' },
  { value: 'broken', label: 'Broken', description: 'Screen is not functional' },
];
export const batteryOptions = [
  { value: '90+', label: '90%+', description: 'Excellent battery life' },
  { value: '80-90', label: '80–90%', description: 'Good battery life' },
  { value: '70-80', label: '70–80%', description: 'Moderate battery life' },
  { value: 'below70', label: 'Below 70%', description: 'Battery needs replacement' },
];

// ─── Mock Auto-Detect Result ──────────────────────────────
export const mockAutoDetectResult: TradeInSpecs = {
  brand: 'Samsung',
  model: 'Galaxy S23 Ultra',
  storage: '256GB',
  condition: 'good',
  screenCondition: 'minor_scratches',
  batteryHealth: '80-90',
};

// ─── Estimation Function ──────────────────────────────────
export const calculateTradeInValue = (specs: TradeInSpecs): TradeInEstimate => {
  const baseValue = brandBaseValues[specs.brand] ?? brandBaseValues.Other;
  const conditionMultiplier = conditionMultipliers[specs.condition] ?? 0.5;
  const storageBonus = storageBonuses[specs.storage] ?? 0;
  const batteryAdjustment = batteryAdjustments[specs.batteryHealth] ?? 0;
  const screenAdjustment = screenAdjustments[specs.screenCondition] ?? 0;

  const totalEstimate = Math.max(
    0,
    Math.round(baseValue * conditionMultiplier) + storageBonus + batteryAdjustment + screenAdjustment
  );

  return {
    baseValue,
    conditionMultiplier,
    storageBonus,
    batteryAdjustment,
    screenAdjustment,
    totalEstimate,
    specs,
  };
};
