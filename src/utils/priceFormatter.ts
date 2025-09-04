/**
 * Formats a number into a readable price format (10k, 1 Lac, 1 Cr)
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol
 */
export const formatPriceDisplay = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) || 0 : amount || 0;
  
  if (numAmount === 0) return '';
  
  if (numAmount >= 10000000) {
    // Crores (1 Cr = 10,000,000)
    const crores = numAmount / 10000000;
    return `₹ ${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)} Cr`;
  } else if (numAmount >= 100000) {
    // Lacs (1 Lac = 100,000)
    const lacs = numAmount / 100000;
    return `₹ ${lacs % 1 === 0 ? lacs.toFixed(0) : lacs.toFixed(1)} Lac`;
  } else if (numAmount >= 1000) {
    // Thousands (1k = 1,000)
    const thousands = numAmount / 1000;
    return `₹ ${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)} k`;
  } else {
    // Less than 1000, show as is
    return `₹ ${numAmount}`;
  }
};