// ============ USER & AUTH ============
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  memberSince: string;
  danVerified: boolean;
  preferredStore: string;
}

export const mockUser: User = {
  id: 'user-001',
  name: 'Батзориг Дорж',
  phone: '+976 9999-9999',
  email: 'batzorigdorj@email.com',
  avatar: 'https://placehold.co/100x100/0F2647/FFFFFF?text=БД',
  memberSince: '2025-01-15',
  danVerified: true,
  preferredStore: 'Баянзүрх салбар',
};

// ============ LOYALTY ============
export interface LoyaltyProfile {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lifetimePoints: number;
  tierProgress: number; // 0-1
  nextTierPoints: number;
  dailyStreak: number;
  lastCheckIn: string;
  earnedThisMonth: number;
  burnedThisMonth: number;
  expiringPoints: number;
  expiringDate: string;
  memberId: string;
  referralCode: string;
  referralCount: number;
}

export const mockLoyalty: LoyaltyProfile = {
  points: 12_450,
  tier: 'gold',
  lifetimePoints: 42_450,
  tierProgress: 42_450 / 50_000,
  nextTierPoints: 50_000 - 42_450,
  dailyStreak: 7,
  lastCheckIn: '2026-02-24',
  earnedThisMonth: 3_500,
  burnedThisMonth: 1_000,
  expiringPoints: 2_000,
  expiringDate: '2026-03-25',
  memberId: 'TZ-M-00001',
  referralCode: 'BATD2026',
  referralCount: 3,
};

// ============ CHALLENGES ============
export interface Challenge {
  id: string;
  type: 'weekly' | 'monthly' | 'special';
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  expiresIn: string;
  icon: string;
  completed: boolean;
}

export const mockChallenges: Challenge[] = [
  { id: 'ch1', type: 'weekly', title: 'Samsung бүтээгдэхүүн авах', description: 'Buy any Samsung product', reward: 500, progress: 0, target: 1, expiresIn: '5 days', icon: 'target', completed: false },
  { id: 'ch2', type: 'weekly', title: '₮500,000 зарцуулах', description: 'Spend ₮500,000 this week', reward: 1000, progress: 200_000, target: 500_000, expiresIn: '5 days', icon: 'dollar-sign', completed: false },
  { id: 'ch3', type: 'weekly', title: '2 бүтээгдэхүүн сэтгэгдэл бичих', description: 'Write 2 product reviews', reward: 200, progress: 1, target: 2, expiresIn: '5 days', icon: 'edit-3', completed: false },
  { id: 'ch4', type: 'monthly', title: '3 худалдан авалт хийх', description: 'Make 3 purchases this month', reward: 2000, progress: 1, target: 3, expiresIn: '12 days', icon: 'shopping-bag', completed: false },
  { id: 'ch5', type: 'monthly', title: '2 найзаа урих', description: 'Refer 2 friends', reward: 3000, progress: 0, target: 2, expiresIn: '12 days', icon: 'users', completed: false },
  { id: 'ch6', type: 'monthly', title: 'Зээл цагтаа төлөх', description: 'Pay loan on time', reward: 500, progress: 1, target: 1, expiresIn: '12 days', icon: 'credit-card', completed: true },
  { id: 'ch7', type: 'special', title: 'Anniversary Sale Marathon', description: 'Complete all tasks for bonus', reward: 10000, progress: 1, target: 4, expiresIn: '18 days', icon: 'star', completed: false },
];

// ============ BADGES ============
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  target?: number;
  reward: number;
}

export const mockBadges: Badge[] = [
  { id: 'b1', name: 'Эхний худалдан авалт', icon: 'shopping-cart', description: 'Make your first purchase', earned: true, earnedDate: '2025-01-20', reward: 100 },
  { id: 'b2', name: '7 хоногийн streak', icon: 'trending-up', description: '7-day check-in streak', earned: true, earnedDate: '2025-02-01', reward: 200 },
  { id: 'b3', name: 'Gold Member', icon: 'award', description: 'Reach Gold tier', earned: true, earnedDate: '2025-06-15', reward: 500 },
  { id: 'b4', name: 'Эхний зээл', icon: 'credit-card', description: 'Get your first loan', earned: true, earnedDate: '2025-08-01', reward: 300 },
  { id: 'b5', name: 'Review Master', icon: 'edit-3', description: 'Write 10 reviews', earned: false, progress: 7, target: 10, reward: 500 },
  { id: 'b6', name: 'Social Butterfly', icon: 'users', description: 'Refer 5 friends', earned: false, progress: 3, target: 5, reward: 1000 },
  { id: 'b7', name: 'Big Spender', icon: 'award', description: 'Spend ₮5M total', earned: false, progress: 3_200_000, target: 5_000_000, reward: 2000 },
  { id: 'b8', name: 'Perfect Payer', icon: 'check-circle', description: '12 on-time loan payments', earned: false, progress: 3, target: 12, reward: 3000 },
  { id: 'b9', name: 'Lucky Spinner', icon: 'gift', description: 'Win the jackpot', earned: false, reward: 5000 },
  { id: 'b10', name: 'Anniversary', icon: 'calendar', description: '1 year member', earned: false, reward: 2000 },
];

// ============ SPIN WHEEL ============
export interface SpinSegment {
  id: number;
  label: string;
  value: number;
  type: 'points' | 'coupon' | 'shipping' | 'jackpot';
  color: string;
  probability: number;
}

export const spinWheelSegments: SpinSegment[] = [
  { id: 1, label: '+50 pts', value: 50, type: 'points', color: '#F5A623', probability: 25 },
  { id: 2, label: '+100 pts', value: 100, type: 'points', color: '#0F2647', probability: 25 },
  { id: 3, label: '+200 pts', value: 200, type: 'points', color: '#F5A623', probability: 20 },
  { id: 4, label: '+500 pts', value: 500, type: 'points', color: '#0EA5E9', probability: 15 },
  { id: 5, label: '5% OFF', value: 5, type: 'coupon', color: '#EF3C23', probability: 8 },
  { id: 6, label: 'Free Ship', value: 0, type: 'shipping', color: '#22C55E', probability: 5 },
  { id: 7, label: '5000 pts', value: 5000, type: 'jackpot', color: '#FFD700', probability: 2 },
];

// ============ LOANS ============
export interface Loan {
  id: string;
  productName: string;
  productImage: string;
  originalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  term: number;
  paidMonths: number;
  interestRate: number;
  nextDueDate: string;
  status: 'active' | 'closed' | 'overdue';
  pointsEarned: number;
}

export const mockLoans: Loan[] = [
  {
    id: 'TZ-NBFI-2026-00123',
    productName: 'iPhone 16 Pro Max',
    productImage: 'https://placehold.co/100x100/EEF1F5/0F2647?text=iPhone',
    originalAmount: 1_500_000,
    remainingAmount: 487_500,
    monthlyPayment: 265_000,
    term: 6,
    paidMonths: 3,
    interestRate: 1.0,
    nextDueDate: '2026-02-28',
    status: 'active',
    pointsEarned: 300,
  },
];

export const mockClosedLoans: Loan[] = [
  {
    id: 'TZ-NBFI-2025-00098',
    productName: 'MacBook Pro 14"',
    productImage: 'https://placehold.co/100x100/EEF1F5/0F2647?text=MacBook',
    originalAmount: 3_500_000,
    remainingAmount: 0,
    monthlyPayment: 310_000,
    term: 12,
    paidMonths: 12,
    interestRate: 1.0,
    nextDueDate: '2026-01-15',
    status: 'closed',
    pointsEarned: 1200,
  },
];

export interface CreditProfile {
  creditLimit: number;
  availableCredit: number;
  usedCredit: number;
  creditScore: number;
  maxScore: number;
  scoreRating: string;
  factors: { label: string; rating: string; icon: string }[];
}

export const mockCreditProfile: CreditProfile = {
  creditLimit: 3_000_000,
  availableCredit: 1_512_500,
  usedCredit: 1_487_500,
  creditScore: 750,
  maxScore: 1000,
  scoreRating: 'Good',
  factors: [
    { label: 'Payment history', rating: 'Excellent', icon: 'check-circle' },
    { label: 'Loyalty tier', rating: 'Gold', icon: 'award' },
    { label: 'Account age', rating: '18 months', icon: 'calendar' },
    { label: 'Purchase frequency', rating: 'High', icon: 'trending-up' },
  ],
};

// ============ WALLET ============
export interface WalletBalance {
  mainBalance: number;
  pointsValue: number;
  giftCardBalance: number;
  loanOutstanding: number;
}

export const mockWallet: WalletBalance = {
  mainBalance: 150_000,
  pointsValue: 124_500,
  giftCardBalance: 50_000,
  loanOutstanding: 487_500,
};

// ============ TRANSACTIONS ============
export interface Transaction {
  id: string;
  type: 'purchase' | 'loan_payment' | 'points_earned' | 'points_redeemed' | 'topup' | 'spin' | 'checkin';
  title: string;
  amount?: number;
  points?: number;
  date: string;
  icon: string;
}

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'loan_payment', title: 'Loan Payment', amount: -265_000, date: '2026-02-25', icon: 'credit-card' },
  { id: 't2', type: 'purchase', title: 'Phone Case Purchase', amount: -45_000, points: 450, date: '2026-02-24', icon: 'shopping-bag' },
  { id: 't3', type: 'points_redeemed', title: 'Points Redeemed', points: -5000, date: '2026-02-23', icon: 'award' },
  { id: 't4', type: 'spin', title: 'Daily Spin Win', points: 100, date: '2026-02-22', icon: 'gift' },
  { id: 't5', type: 'topup', title: 'Wallet Top-up', amount: 100_000, date: '2026-02-20', icon: 'plus-circle' },
  { id: 't6', type: 'checkin', title: 'Daily Check-in', points: 10, date: '2026-02-19', icon: 'calendar' },
  { id: 't7', type: 'points_earned', title: 'Loan On-Time Bonus', points: 100, date: '2026-02-18', icon: 'check-circle' },
  { id: 't8', type: 'purchase', title: 'Samsung Charger', amount: -35_000, points: 350, date: '2026-02-17', icon: 'shopping-bag' },
];

// ============ LEADERBOARD ============
export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  tier: string;
  isCurrentUser?: boolean;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Б.Тэмүүлэн', points: 45_000, tier: 'platinum' },
  { rank: 2, name: 'Д.Мөнхбат', points: 38_000, tier: 'platinum' },
  { rank: 3, name: 'Э.Болормаа', points: 35_200, tier: 'gold' },
  { rank: 4, name: 'С.Ганбаатар', points: 31_000, tier: 'gold' },
  { rank: 5, name: 'Ж.Оюунтуяа', points: 28_500, tier: 'gold' },
  { rank: 6, name: 'Г.Баатар', points: 25_300, tier: 'gold' },
  { rank: 7, name: 'Н.Сарантуяа', points: 22_100, tier: 'silver' },
  { rank: 8, name: 'Б.Энхбаяр', points: 19_800, tier: 'silver' },
  { rank: 9, name: 'А.Мандах', points: 17_500, tier: 'silver' },
  { rank: 10, name: 'Д.Номин', points: 15_200, tier: 'silver' },
  { rank: 47, name: 'Б.Дорж', points: 12_450, tier: 'gold', isCurrentUser: true },
];

// ============ NOTIFICATIONS ============
export interface AppNotification {
  id: string;
  type: 'order' | 'loyalty' | 'loan' | 'promo';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'loan', title: 'Зээлийн төлбөр маргааш', body: 'Loan payment due tomorrow — ₮265,000', time: '2 min ago', read: false, icon: 'credit-card' },
  { id: 'n2', type: 'order', title: 'Захиалга илгээгдлээ', body: 'Your order has shipped — Track now', time: '1 hour ago', read: false, icon: 'truck' },
  { id: 'n3', type: 'loyalty', title: 'Өдрийн эргүүлэг бэлэн!', body: 'Daily spin ready! Come get your points', time: '3 hours ago', read: false, icon: 'gift' },
  { id: 'n4', type: 'loyalty', title: 'Challenge дууслаа!', body: 'Challenge completed! +500 pts earned', time: '5 hours ago', read: true, icon: 'award' },
  { id: 'n5', type: 'loyalty', title: '7 хоногийн streak!', body: 'Your 7-day streak! +100 bonus pts', time: 'Yesterday', read: true, icon: 'trending-up' },
  { id: 'n6', type: 'promo', title: 'Flash Sale!', body: '30% off Accessories — 2h left', time: 'Yesterday', read: true, icon: 'zap' },
  { id: 'n7', type: 'loan', title: 'Зээл баталгаажлаа!', body: 'Loan approved! ₮1,500,000 available', time: '2 days ago', read: true, icon: 'check-circle' },
  { id: 'n8', type: 'loyalty', title: 'Platinum ойрхон!', body: "You're 7,550 pts from Platinum!", time: '3 days ago', read: true, icon: 'target' },
];

// ============ STORES ============
export const stores = [
  { id: 's1', name: 'Баянзүрх салбар', address: 'Баянзүрх дүүрэг, 4-р хороо', distance: '1.2 km' },
  { id: 's2', name: 'Чингэлтэй салбар', address: 'Чингэлтэй дүүрэг, 5-р хороо', distance: '2.5 km' },
  { id: 's3', name: 'Хан-Уул салбар', address: 'Хан-Уул дүүрэг, 11-р хороо', distance: '4.8 km' },
  { id: 's4', name: 'Сүхбаатар салбар', address: 'Сүхбаатар дүүрэг, 1-р хороо', distance: '3.1 km' },
  { id: 's5', name: 'Баянгол салбар', address: 'Баянгол дүүрэг, 16-р хороо', distance: '5.3 km' },
];

// ============ REWARDS ============
export interface Reward {
  id: string;
  name: string;
  category: 'voucher' | 'product' | 'shipping' | 'loan_perk' | 'spin' | 'partner';
  pointsCost: number;
  description: string;
  icon: string;
}

export const mockRewards: Reward[] = [
  { id: 'rw1', name: '5% хямдрал', category: 'voucher', pointsCost: 500, description: '5% discount on next purchase', icon: 'tag' },
  { id: 'rw2', name: '10% хямдрал', category: 'voucher', pointsCost: 1000, description: '10% discount on next purchase', icon: 'tag' },
  { id: 'rw3', name: '20% хямдрал', category: 'voucher', pointsCost: 2000, description: '20% discount on next purchase', icon: 'tag' },
  { id: 'rw4', name: 'Утасны гэр', category: 'product', pointsCost: 500, description: 'Technozone brand phone case', icon: 'smartphone' },
  { id: 'rw5', name: 'Дэлгэцний хамгаалалт', category: 'product', pointsCost: 300, description: 'Premium screen protector', icon: 'shield' },
  { id: 'rw6', name: 'Чихэвч', category: 'product', pointsCost: 5000, description: 'Wireless earbuds', icon: 'headphones' },
  { id: 'rw7', name: 'Үнэгүй хүргэлт', category: 'shipping', pointsCost: 200, description: 'Free shipping voucher', icon: 'truck' },
  { id: 'rw8', name: 'Хүүгийн хөнгөлөлт 0.5%', category: 'loan_perk', pointsCost: 5000, description: '0.5% interest rate reduction', icon: 'percent' },
  { id: 'rw9', name: 'Нэмэлт эргүүлэг', category: 'spin', pointsCost: 100, description: '1 extra daily spin', icon: 'gift' },
  { id: 'rw10', name: 'Кофе хөнгөлөлт', category: 'partner', pointsCost: 500, description: 'Coffee voucher', icon: 'coffee' },
];
