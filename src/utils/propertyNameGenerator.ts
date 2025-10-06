// Property name generation utility
// Generates property names based on: BHK TYPE + PROPERTY TYPE + FOR SALE/RENT

export interface PropertyNameData {
  bhkType?: string;
  propertyType: string;
  listingType: string;
  commercialType?: string; // For commercial properties
  landType?: string; // For land/plot properties (industrial, agricultural, commercial, residential, institutional)
}

export const generatePropertyName = (data: PropertyNameData): string => {
  const { bhkType, propertyType, listingType, commercialType, landType } = data;
  
  // Handle special land types from listing type (Industrial land, Agricultural Land, Commercial land)
  if (listingType === 'Industrial land') {
    return 'Industrial Land For SALE';
  }
  if (listingType === 'Agricultural Land') {
    return 'Agricultural Land For SALE';
  }
  if (listingType === 'Commercial land') {
    return 'Commercial Land For SALE';
  }
  
  // Handle land type for Land/Plot properties
  if (landType && (propertyType === 'Land/Plot' || propertyType.toLowerCase() === 'land' || propertyType.toLowerCase() === 'plot')) {
    const landTypeMap: { [key: string]: string } = {
      'industrial': 'Industrial Land For SALE',
      'agricultural': 'Agricultural Land For SALE',
      'commercial': 'Commercial Land For SALE',
      'residential': 'Residential Land For SALE',
      'institutional': 'Institutional Land For SALE'
    };
    const generatedTitle = landTypeMap[landType.toLowerCase()];
    if (generatedTitle) {
      return generatedTitle;
    }
  }
  
  // Map listing types to display format
  const listingDisplayMap: { [key: string]: string } = {
    'sale': 'For Sale',
    'rent': 'For Rent',
    'Sale': 'For Sale',
    'Rent': 'For Rent',
    'Resale': 'For Sale',
    'PG/Hostel': 'For Rent',
    'Flatmates': 'For Rent'
  };
  
  const listingDisplay = listingDisplayMap[listingType] || 'For Sale';
  
  // Safety check for undefined propertyType
  if (!propertyType) {
    console.warn('PropertyType is undefined, using fallback');
    return `Residential Property ${listingDisplay}`;
  }
  
  // Handle different property types
  switch (propertyType.toLowerCase()) {
    case 'apartment':
    case 'flat':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Apartment ${listingDisplay}`;
      }
      return `Apartment ${listingDisplay}`;
      
    case 'villa':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Villa ${listingDisplay}`;
      }
      return `Villa ${listingDisplay}`;
      
    case 'independent house':
    case 'house':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Independent House ${listingDisplay}`;
      }
      return `Independent House ${listingDisplay}`;
      
    case 'builder floor':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Builder Floor ${listingDisplay}`;
      }
      return `Builder Floor ${listingDisplay}`;
      
    case 'studio apartment':
    case 'studio':
      return `Studio Apartment ${listingDisplay}`;
      
    case 'penthouse':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Penthouse ${listingDisplay}`;
      }
      return `Penthouse ${listingDisplay}`;
      
    case 'duplex':
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} Duplex ${listingDisplay}`;
      }
      return `Duplex ${listingDisplay}`;
      
    case 'plot':
    case 'land':
    case 'land/plot':
      return `Land ${listingDisplay}`;
      
    case 'agricultural land':
    case 'agriculture lands':
      return `Agricultural Land ${listingDisplay}`;
      
    case 'farmhouse':
    case 'farm house':
      return `Farmhouse ${listingDisplay}`;
      
    case 'pg/hostel':
      return `PG/Hostel ${listingDisplay}`;
      
    case 'flatmates':
      return `Flatmates ${listingDisplay}`;
      
    // Commercial properties
    case 'commercial':
      if (commercialType) {
        const commercialTypeMap: { [key: string]: string } = {
          'office': 'Office Space',
          'retail': 'Retail Space',
          'shop': 'Shop',
          'warehouse': 'Warehouse',
          'showroom': 'Showroom',
          'restaurant': 'Restaurant Space',
          'co-working': 'Co-working Space',
          'industrial': 'Industrial Space',
          'medical': 'Medical Space',
          'educational': 'Educational Space'
        };
        const commercialDisplay = commercialTypeMap[commercialType.toLowerCase()] || commercialType;
        return `Commercial ${commercialDisplay} ${listingDisplay}`;
      }
      return `Commercial Space ${listingDisplay}`;
      
    case 'office':
      return `Commercial Office Space ${listingDisplay}`;
      
    case 'shop':
    case 'retail':
      return `Commercial Shop ${listingDisplay}`;
      
    case 'warehouse':
      return `Commercial Warehouse ${listingDisplay}`;
      
    case 'showroom':
      return `Commercial Showroom ${listingDisplay}`;
      
    case 'restaurant':
      return `Commercial Restaurant Space ${listingDisplay}`;
      
    case 'co-working':
      return `Commercial Co-working Space ${listingDisplay}`;
      
    case 'industrial':
      return `Commercial Industrial Space ${listingDisplay}`;
      
    case 'medical':
      return `Commercial Medical Space ${listingDisplay}`;
      
    case 'educational':
      return `Commercial Educational Space ${listingDisplay}`;
      
    default:
      // Fallback for unknown property types
      if (bhkType && bhkType !== 'Studio') {
        return `${bhkType.toUpperCase()} ${propertyType} ${listingDisplay}`;
      }
      return `${propertyType} ${listingDisplay}`;
  }
};

// Helper function to extract BHK type from various formats
export const normalizeBhkType = (bhkType: string): string => {
  if (!bhkType) return '';
  
  // Handle different BHK formats
  const bhkMap: { [key: string]: string } = {
    'studio': 'Studio',
    '1rk': '1 RK',
    '1bhk': '1 BHK',
    '2bhk': '2 BHK',
    '3bhk': '3 BHK',
    '4bhk': '4 BHK',
    '5bhk': '5 BHK',
    '5bhk+': '5+ BHK',
    '6bhk': '6 BHK',
    '7bhk': '7 BHK',
    '8bhk': '8 BHK',
    '9bhk': '9 BHK',
    '10bhk': '10 BHK',
    'multiple': 'Multiple',
    'pg_hostel': 'PG/Hostel'
  };
  
  return bhkMap[bhkType.toLowerCase()] || bhkType;
};

// Helper function to normalize property type
export const normalizePropertyType = (propertyType: string): string => {
  if (!propertyType) return '';
  
  const typeMap: { [key: string]: string } = {
    'apartment': 'Apartment',
    'flat': 'Apartment',
    'villa': 'Villa',
    'independent_house': 'Independent House',
    'house': 'Independent House',
    'builder_floor': 'Builder Floor',
    'studio_apartment': 'Studio Apartment',
    'studio': 'Studio Apartment',
    'penthouse': 'Penthouse',
    'duplex': 'Duplex',
    'plot': 'Land',
    'land': 'Land',
    'land/plot': 'Land',
    'agriculture_lands': 'Agricultural Land',
    'agricultural_land': 'Agricultural Land',
    'farm_house': 'Farmhouse',
    'farmhouse': 'Farmhouse',
    'pg_hostel': 'PG/Hostel',
    'flatmates': 'Flatmates',
    'commercial': 'Commercial',
    'office': 'Office',
    'shop': 'Shop',
    'retail': 'Retail',
    'warehouse': 'Warehouse',
    'showroom': 'Showroom',
    'restaurant': 'Restaurant',
    'coworking': 'Co-working',
    'co-working': 'Co-working',
    'industrial': 'Industrial',
    'medical': 'Medical',
    'educational': 'Educational'
  };
  
  return typeMap[propertyType.toLowerCase()] || propertyType;
};
