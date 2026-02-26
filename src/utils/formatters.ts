export const formatPrice = (amount: number): string => {
  return `₮${amount.toLocaleString()}`;
};

export const formatPriceShort = (amount: number): string => {
  if (amount >= 1_000_000) return `₮${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₮${(amount / 1_000).toFixed(0)}K`;
  return `₮${amount}`;
};

export const formatPoints = (points: number): string => {
  return `${points.toLocaleString()} pts`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateShort = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const calculateMonthlyPayment = (
  principal: number,
  monthlyRate: number,
  termMonths: number
): number => {
  if (monthlyRate === 0) return principal / termMonths;
  const r = monthlyRate / 100;
  return Math.round(
    (principal * r * Math.pow(1 + r, termMonths)) /
      (Math.pow(1 + r, termMonths) - 1)
  );
};

export const calculateTotalRepayment = (
  monthlyPayment: number,
  termMonths: number
): number => {
  return monthlyPayment * termMonths;
};

export const getInterestRateByTier = (tier: string): number => {
  switch (tier) {
    case 'platinum': return 0.5;
    case 'gold': return 1.0;
    case 'silver': return 1.25;
    case 'bronze':
    default: return 1.5;
  }
};

export const getPointsMultiplierByTier = (tier: string): number => {
  switch (tier) {
    case 'platinum': return 3;
    case 'gold': return 2;
    case 'silver': return 1.5;
    case 'bronze':
    default: return 1;
  }
};
