/**
 * Utility functions for GST/VAT calculations
 */

import { getCurrentCountryConfig } from '@/services/domainCountryService';

// Get tax rate based on country (UAE: 5% VAT, India: 18% GST)
export const getTaxRate = (): number => {
  const countryConfig = getCurrentCountryConfig();
  return countryConfig.currency === 'AED' ? 0.05 : 0.18; // 5% VAT for UAE, 18% GST for India
};

export const GST_RATE = getTaxRate(); // Dynamic tax rate based on country

/**
 * Calculate GST/VAT amount from base price
 * @param basePriceInPaise - Base price in paise/fils (₹1 = 100 paise, AED 1 = 100 fils)
 * @returns GST/VAT amount in paise/fils
 */
export const calculateGSTAmount = (basePriceInPaise: number): number => {
  return Math.round(basePriceInPaise * getTaxRate());
};

/**
 * Calculate total amount including GST/VAT
 * @param basePriceInPaise - Base price in paise/fils
 * @returns Total amount including GST/VAT in paise/fils
 */
export const calculateTotalWithGST = (basePriceInPaise: number): number => {
  return basePriceInPaise + calculateGSTAmount(basePriceInPaise);
};

/**
 * Format amount in paise/fils to readable currency string
 * @param amountInPaise - Amount in paise/fils
 * @param currency - Currency code (default: from country config)
 * @returns Formatted currency string (e.g., "AED 1,180" or "₹1,180")
 */
export const formatCurrency = (amountInPaise: number, currency?: string): string => {
  const countryConfig = getCurrentCountryConfig();
  const currencyCode = currency || countryConfig.currency;
  const amountInMainUnit = Math.round(amountInPaise / 100);
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInMainUnit);
};

/**
 * Format amount in paise/fils to detailed currency string with decimals
 * @param amountInPaise - Amount in paise/fils
 * @param currency - Currency code (default: from country config)
 * @returns Formatted currency string (e.g., "AED 1,180.00" or "₹1,180.00")
 */
export const formatCurrencyDetailed = (amountInPaise: number, currency?: string): string => {
  const countryConfig = getCurrentCountryConfig();
  const currencyCode = currency || countryConfig.currency;
  const amountInMainUnit = amountInPaise / 100;
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInMainUnit);
};
