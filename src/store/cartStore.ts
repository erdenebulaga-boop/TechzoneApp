import { create } from 'zustand';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  pointsToUse: number;

  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setPointsToUse: (points: number) => void;
  clear: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  pointsDiscount: () => number;
  deliveryFee: () => number;
  total: () => number;
  totalPointsToEarn: (tierMultiplier: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  pointsToUse: 0,

  addItem: (product, quantity = 1, variants) => set(state => {
    const existing = state.items.findIndex(i => i.product.id === product.id);
    if (existing >= 0) {
      const updated = [...state.items];
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + quantity };
      return { items: updated };
    }
    return { items: [...state.items, { product, quantity, selectedVariants: variants }] };
  }),

  removeItem: (productId) => set(state => ({
    items: state.items.filter(i => i.product.id !== productId),
  })),

  updateQuantity: (productId, quantity) => set(state => ({
    items: quantity <= 0
      ? state.items.filter(i => i.product.id !== productId)
      : state.items.map(i => i.product.id === productId ? { ...i, quantity } : i),
  })),

  setPointsToUse: (points) => set({ pointsToUse: points }),

  clear: () => set({ items: [], pointsToUse: 0 }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  pointsDiscount: () => get().pointsToUse * 10, // 100 pts = ₮1,000 → 1 pt = ₮10

  deliveryFee: () => {
    const subtotal = get().subtotal();
    return subtotal >= 500_000 ? 0 : 10_000; // Free over ₮500K
  },

  total: () => {
    const s = get();
    return s.subtotal() - s.pointsDiscount() + s.deliveryFee();
  },

  totalPointsToEarn: (tierMultiplier: number) => {
    const subtotal = get().subtotal();
    const basePoints = Math.floor(subtotal / 100); // 1 pt per ₮100
    return Math.floor(basePoints * tierMultiplier);
  },
}));
