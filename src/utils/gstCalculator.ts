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