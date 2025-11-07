/**
 * Formats a number into a readable price format (10k, 1 Lac, 1 Cr)
 * @param amount - The amount to format
 * @param currencySymbol - Currency symbol to use (default: '₹')
 * @returns Formatted string with currency symbol
 */
export const formatPriceDisplay = (amount: number | string, currencySymbol: string = '₹'): string => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) || 0 : amount || 0;
  
  if (numAmount === 0) return '';
  
  if (numAmount >= 10000000) {
    // Crores (1 Cr = 10,000,000)
    const crores = numAmount / 10000000;
    return `${currencySymbol} ${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)} Cr`;
  } else if (numAmount >= 100000) {
    // Lacs (1 Lac = 100,000)
    const lacs = numAmount / 100000;
    return `${currencySymbol} ${lacs % 1 === 0 ? lacs.toFixed(0) : lacs.toFixed(1)} Lac`;
  } else if (numAmount >= 1000) {
    // Thousands (1k = 1,000)
    const thousands = numAmount / 1000;
    return `${currencySymbol} ${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)} k`;
  } else {
    // Less than 1000, show as is
    return `${currencySymbol} ${numAmount}`;
  }
};

/**
 * Formats a number into exact price format without rounding
 * @param amount - The amount to format
 * @param currencySymbol - Currency symbol to use (default: '₹')
 * @returns Formatted string with currency symbol showing exact amount
 */
export const formatExactPriceDisplay = (amount: number | string, currencySymbol: string = '₹'): string => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) || 0 : amount || 0;
  
  if (numAmount === 0) return '';
  
  // Format with Indian number system (lakhs and crores) but show exact amounts
  if (numAmount >= 10000000) {
    // Crores (1 Cr = 10,000,000)
    const crores = numAmount / 10000000;
    // Use toFixed with more precision to avoid rounding, then trim trailing zeros
    const croresStr = crores.toFixed(6).replace(/\.?0+$/, '');
    return `${currencySymbol} ${croresStr} Cr`;
  } else if (numAmount >= 100000) {
    // Lacs (1 Lac = 100,000)
    const lacs = numAmount / 100000;
    // Use toFixed with more precision to avoid rounding, then trim trailing zeros
    const lacsStr = lacs.toFixed(6).replace(/\.?0+$/, '');
    return `${currencySymbol} ${lacsStr} Lac`;
  } else if (numAmount >= 1000) {
    // Thousands (1k = 1,000)
    const thousands = numAmount / 1000;
    // Use toFixed with more precision to avoid rounding, then trim trailing zeros
    const thousandsStr = thousands.toFixed(6).replace(/\.?0+$/, '');
    return `${currencySymbol} ${thousandsStr} k`;
  } else {
    // Less than 1000, show as is
    return `${currencySymbol} ${numAmount}`;
  }
};