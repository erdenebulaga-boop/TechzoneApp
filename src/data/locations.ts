// Technozone Location Data — Regions, Stores, Shipping Configs

export interface Region {
  id: string;
  name: string;
  nameEn: string;
  icon: string; // Feather icon name
  storeCount: number;
}

export interface Store {
  id: string;
  regionId: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface ShippingConfig {
  regionId: string;
  costMNT: number;
  freeShippingThreshold: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

// ─── Regions ─────────────────────────────────────────
export const regions: Region[] = [
  { id: 'ub', name: 'Улаанбаатар', nameEn: 'Ulaanbaatar', icon: 'map-pin', storeCount: 5 },
  { id: 'darkhan', name: 'Дархан-Уул', nameEn: 'Darkhan-Uul', icon: 'map-pin', storeCount: 1 },
  { id: 'erdenet', name: 'Орхон (Эрдэнэт)', nameEn: 'Orkhon (Erdenet)', icon: 'map-pin', storeCount: 1 },
  { id: 'khentii', name: 'Хэнтий', nameEn: 'Khentii', icon: 'map-pin', storeCount: 0 },
  { id: 'umnugovi', name: 'Өмнөговь', nameEn: 'Umnugovi', icon: 'map-pin', storeCount: 0 },
];

// ─── Stores ──────────────────────────────────────────
export const allStores: Store[] = [
  // Ulaanbaatar (5 stores)
  { id: 's1', regionId: 'ub', name: 'Баянзүрх салбар', address: 'Баянзүрх дүүрэг, 4-р хороо', phone: '7701-1818', hours: '10:00–20:00' },
  { id: 's2', regionId: 'ub', name: 'Чингэлтэй салбар', address: 'Чингэлтэй дүүрэг, 5-р хороо', phone: '7701-1819', hours: '10:00–20:00' },
  { id: 's3', regionId: 'ub', name: 'Хан-Уул салбар', address: 'Хан-Уул дүүрэг, 11-р хороо', phone: '7701-1820', hours: '10:00–20:00' },
  { id: 's4', regionId: 'ub', name: 'Сүхбаатар салбар', address: 'Сүхбаатар дүүрэг, 1-р хороо', phone: '7701-1821', hours: '10:00–20:00' },
  { id: 's5', regionId: 'ub', name: 'Баянгол салбар', address: 'Баянгол дүүрэг, 16-р хороо', phone: '7701-1822', hours: '10:00–20:00' },
  // Darkhan-Uul (1 store)
  { id: 's6', regionId: 'darkhan', name: 'Дархан салбар', address: 'Дархан хот, 5-р баг', phone: '7701-2001', hours: '10:00–19:00' },
  // Orkhon/Erdenet (1 store)
  { id: 's7', regionId: 'erdenet', name: 'Эрдэнэт салбар', address: 'Эрдэнэт хот, Баян-Өндөр', phone: '7701-3001', hours: '10:00–19:00' },
];

// ─── Shipping Configs ────────────────────────────────
export const shippingConfigs: ShippingConfig[] = [
  { regionId: 'ub', costMNT: 10_000, freeShippingThreshold: 500_000, estimatedDaysMin: 1, estimatedDaysMax: 2 },
  { regionId: 'darkhan', costMNT: 15_000, freeShippingThreshold: 500_000, estimatedDaysMin: 2, estimatedDaysMax: 3 },
  { regionId: 'erdenet', costMNT: 15_000, freeShippingThreshold: 500_000, estimatedDaysMin: 2, estimatedDaysMax: 3 },
  { regionId: 'khentii', costMNT: 25_000, freeShippingThreshold: 800_000, estimatedDaysMin: 4, estimatedDaysMax: 6 },
  { regionId: 'umnugovi', costMNT: 30_000, freeShippingThreshold: 800_000, estimatedDaysMin: 5, estimatedDaysMax: 7 },
];

// ─── Helpers ─────────────────────────────────────────

export const getRegionById = (regionId: string): Region =>
  regions.find(r => r.id === regionId) ?? regions[0];

export const getShippingForRegion = (regionId: string): ShippingConfig =>
  shippingConfigs.find(c => c.regionId === regionId) ?? shippingConfigs[0];

export const getStoresForRegion = (regionId: string): Store[] =>
  allStores.filter(s => s.regionId === regionId);

export const getClosestStore = (regionId: string): Store | null => {
  const regionStores = getStoresForRegion(regionId);
  if (regionStores.length > 0) return regionStores[0];
  // No stores in this region — fall back to first UB store
  return null;
};

export const getDeliveryLabel = (regionId: string): string => {
  const config = getShippingForRegion(regionId);
  return `${config.estimatedDaysMin}–${config.estimatedDaysMax} days`;
};

export const getShippingLabel = (regionId: string, subtotal?: number): string => {
  const config = getShippingForRegion(regionId);
  if (subtotal && subtotal >= config.freeShippingThreshold) {
    return 'Free shipping';
  }
  return `₮${config.costMNT.toLocaleString()}`;
};
