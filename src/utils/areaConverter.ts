/**
 * Area Unit Conversion Utilities
 * Provides functions to convert between different area units for Land/Plot properties
 */

// Conversion factors relative to square feet
export const areaConversionFactors = {
  'sq.ft': 1,
  'sq.m': 10.764, // 1 sq.m = 10.764 sq.ft
  'sq.yards': 9, // 1 sq.yard = 9 sq.ft
  'acres': 43560, // 1 acre = 43,560 sq.ft
  'hectare': 107639, // 1 hectare = 107,639 sq.ft
  'bigha': 27225, // standard bigha, can vary by region
  'marla': 272.25, // 1 marla = 272.25 sq.ft
  'kanal': 5445, // 1 kanal = 5,445 sq.ft
  'cents': 435.6, // 1 cent = 435.6 sq.ft
  'grounds': 2400, // 1 ground = 2,400 sq.ft
  'guntha': 1089, // 1 guntha = 1,089 sq.ft
};

export type AreaUnit = keyof typeof areaConversionFactors;

/**
 * Convert an area value from one unit to another
 * @param value - The area value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns The converted value
 */
export function convertArea(value: number, fromUnit: AreaUnit, toUnit: AreaUnit): number {
  console.log(`Converting ${value} from ${fromUnit} to ${toUnit}`);
  
  // Quick validation
  if (!value || value <= 0) return 0;
  
  // If same unit, no conversion needed
  if (fromUnit === toUnit) return value;
  
  // Make sure we have valid conversion factors
  if (!areaConversionFactors[fromUnit]) {
    console.error(`Unknown source unit: ${fromUnit}, defaulting to sq.ft`);
    fromUnit = 'sq.ft' as AreaUnit;
  }
  
  if (!areaConversionFactors[toUnit]) {
    console.error(`Unknown target unit: ${toUnit}, defaulting to sq.ft`);
    toUnit = 'sq.ft' as AreaUnit;
  }
  
  // Convert to sq ft first (base unit)
  const valueInSqFt = value * areaConversionFactors[fromUnit];
  
  // Then convert from sq ft to target unit
  const result = valueInSqFt / areaConversionFactors[toUnit];
  
  console.log(`Conversion: ${value} ${fromUnit} = ${valueInSqFt} sq.ft = ${result} ${toUnit}`);
  
  return result;
}

/**
 * Maps database plot_area_unit values to standardized display units
 */
export const plotAreaUnitMap: Record<string, AreaUnit> = {
  // Square feet variants
  'sq-ft': 'sq.ft',
  'sq_ft': 'sq.ft',
  'sq.ft': 'sq.ft',
  'sqft': 'sq.ft',
  'square feet': 'sq.ft',
  'square foot': 'sq.ft',
  'sq ft': 'sq.ft',
  'sq. ft': 'sq.ft',
  'sq. ft.': 'sq.ft',
  'sq.ft.': 'sq.ft',
  'ft²': 'sq.ft',
  
  // Square yards variants
  'sq-yard': 'sq.yards',
  'sq_yard': 'sq.yards',
  'sq.yard': 'sq.yards',
  'sq.yards': 'sq.yards',
  'sq yards': 'sq.yards',
  'sq. yards': 'sq.yards',
  'sq. yard': 'sq.yards',
  'sqyd': 'sq.yards',
  'sq yd': 'sq.yards',
  'yd²': 'sq.yards',
  
  // Square meters variants
  'sq-m': 'sq.m',
  'sq_m': 'sq.m',
  'sq.m': 'sq.m',
  'sqm': 'sq.m',
  'square meter': 'sq.m',
  'square meters': 'sq.m',
  'square metre': 'sq.m',
  'square metres': 'sq.m',
  'sq meter': 'sq.m',
  'sq. meter': 'sq.m',
  'm²': 'sq.m',
  
  // Acres variants
  'acre': 'acres',
  'acres': 'acres',
  'ac': 'acres',
  
  // Hectare variants
  'hectare': 'hectare',
  'hectares': 'hectare',
  'ha': 'hectare',
  
  // Other Indian units
  'bigha': 'bigha',
  'biswa': 'bigha', // Map to closest standard unit
  'gunta': 'guntha',
  'guntha': 'guntha',
  'cents': 'cents',
  'marla': 'marla',
  'kanal': 'kanal',
  'grounds': 'grounds',
};

/**
 * Format area value with appropriate unit and precision
 */
export function formatAreaWithUnit(value: number, unit: AreaUnit): string {
  let formatted = value;
  
  // Set appropriate precision based on unit and value
  if (unit === 'acres' || unit === 'hectare' || unit === 'bigha' || value < 1) {
    formatted = parseFloat(value.toFixed(2));
  } else {
    formatted = parseFloat(value.toFixed(0));
  }
  
  return `${formatted} ${unit}`;
}

/**
 * Get a standardized area unit from a database plot_area_unit
 */
export function getStandardizedAreaUnit(dbUnit: string | null | undefined): AreaUnit {
  if (!dbUnit) {
    console.log('No unit provided, defaulting to sq.ft');
    return 'sq.ft';
  }
  
  const normalized = dbUnit.toLowerCase().trim();
  const mappedUnit = plotAreaUnitMap[normalized] || 'sq.ft';
  
  console.log(`Normalized area unit: "${dbUnit}" -> "${normalized}" -> "${mappedUnit}"`);
  
  if (!mappedUnit || mappedUnit !== plotAreaUnitMap[normalized]) {
    console.warn(`Unknown area unit: ${dbUnit}, defaulting to sq.ft`);
  }
  
  return mappedUnit;
}

/**
 * Create a range filter for area based on specific unit
 * This helps filter properties by area regardless of their original unit
 */
export function createAreaRangeFilter(
  minValue: number, 
  maxValue: number, 
  filterUnit: AreaUnit
): (areaValue: number, areaUnit: AreaUnit) => boolean {
  return (areaValue: number, areaUnit: AreaUnit) => {
    // Convert property's area to the filter unit
    const convertedValue = convertArea(areaValue, areaUnit, filterUnit);
    return convertedValue >= minValue && convertedValue <= maxValue;
  };
}