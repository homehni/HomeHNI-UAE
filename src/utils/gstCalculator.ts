/**
 * Utility functions for GST calculations
 */

export const GST_RATE = 0.18; // 18% GST

/**
 * Calculate GST amount from base price
 * @param basePriceInPaise - Base price in paise (₹1 = 100 paise)
 * @returns GST amount in paise
 */
export const calculateGSTAmount = (basePriceInPaise: number): number => {
  return Math.round(basePriceInPaise * GST_RATE);
};

/**
 * Calculate total amount including GST
 * @param basePriceInPaise - Base price in paise
 * @returns Total amount including GST in paise
 */
export const calculateTotalWithGST = (basePriceInPaise: number): number => {
  return basePriceInPaise + calculateGSTAmount(basePriceInPaise);
};

/**
 * Calculate base price from total price including GST
 * @param totalPriceInPaise - Total price including GST in paise
 * @returns Base price in paise
 */
export const calculateBasePriceFromTotal = (totalPriceInPaise: number): number => {
  // If total = base + (base * 0.18), then base = total / 1.18
  return Math.round(totalPriceInPaise / (1 + GST_RATE));
};

/**
 * Calculate GST amount from total price
 * @param totalPriceInPaise - Total price including GST in paise
 * @returns GST amount in paise
 */
export const calculateGSTFromTotal = (totalPriceInPaise: number): number => {
  const basePriceInPaise = calculateBasePriceFromTotal(totalPriceInPaise);
  return totalPriceInPaise - basePriceInPaise;
};

/**
 * Format amount in paise to readable currency string
 * @param amountInPaise - Amount in paise
 * @returns Formatted currency string (e.g., "₹1,180")
 */
export const formatCurrency = (amountInPaise: number): string => {
  const amountInRupees = Math.round(amountInPaise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInRupees);
};

/**
 * Format amount in paise to detailed currency string with decimals
 * @param amountInPaise - Amount in paise
 * @returns Formatted currency string (e.g., "₹1,180.00")
 */
export const formatCurrencyDetailed = (amountInPaise: number): string => {
  const amountInRupees = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInRupees);
};