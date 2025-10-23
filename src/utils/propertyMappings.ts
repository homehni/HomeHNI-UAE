// Property data transformation mappings for database compatibility

export const mapBhkType = (bhkType: string): string => {
  const bhkMappings: { [key: string]: string } = {
    'Studio': 'studio',
    '1 RK': '1rk',
    '1 BHK': '1bhk',
    '2 BHK': '2bhk', 
    '3 BHK': '3bhk',
    '4 BHK': '4bhk',
    '5 BHK': '5bhk',
    '5+ BHK': '5bhk+',
    // Map higher BHK types to 5bhk+ since that's the maximum in the constraint
    '6 BHK': '5bhk+',
    '7 BHK': '5bhk+',
    '8 BHK': '5bhk+',
    '9 BHK': '5bhk+',
    '10 BHK': '5bhk+',
    'Multiple': 'multiple',
    'Multiple room types': 'multiple',
    'PG/Hostel': 'multiple'
  };
  
  if (!bhkType) return '';
  
  const mappedValue = bhkMappings[bhkType];
  if (mappedValue) {
    return mappedValue;
  }
  
  // For unmapped values, try to normalize and check if it's valid
  const normalized = bhkType.toLowerCase().replace(/\s+/g, '');
  const validValues = ['1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+', 'studio', 'multiple', 'pg_hostel', 'flatmates'];
  
  if (validValues.includes(normalized)) {
    return normalized;
  }
  
  // Default to 1bhk for invalid values
  return '1bhk';
};

export const mapPropertyType = (propertyType: string): string => {
  const propertyMappings: { [key: string]: string } = {
    'Apartment': 'apartment',
    'Apartment/Flat': 'apartment', // Map form value to DB value
    'Villa': 'villa',
    'House': 'independent_house', // Map "House" to 'independent_house'
    'Independent House': 'independent_house',
    'Independent House/Villa': 'independent_house', // Map form value to DB value
    'Gated Community Villa': 'villa', // Map Gated Community Villa to villa
    'Builder Floor': 'builder_floor',
    'Studio Apartment': 'studio_apartment', // Map Studio Apartment to studio_apartment
    'Penthouse': 'apartment', // Map Penthouse to apartment for filtering
    'Duplex': 'villa', // Map Duplex to villa for filtering
    'Plot': 'plot',
    'Plot/Land': 'plot', // Map form value to DB value
    'Land/Plot': 'plot', // Map form value to DB value (alternate label)
    'Agricultural Land': 'agriculture_lands', // Map Agricultural Land to agriculture_lands
    'Farmhouse': 'farm_house', // Map Farmhouse to farm_house
    'Studio': 'studio',
    'PG/Hostel': 'pg_hostel', // This is fine for property_type, which still accepts pg_hostel
    'Flatmates': 'apartment', // Map form value to DB value - Flatmates are apartments
    'Commercial': 'commercial',
    'Office': 'office',
    'Office Space': 'office', // Map "Office Space" to 'office'
    'Retail/Shop': 'shop', // Map form value to DB value
    'Shop': 'shop',
    'Warehouse': 'warehouse',
    'Industrial/Warehouse': 'warehouse', // Map form value to DB value
    'Showroom': 'showroom',
    'Co-working': 'coworking', // Map form value to DB value
    'Co-Living': 'coliving', // Map form value to DB value
    'Hospitality/Hotel': 'hotel' // Map form value to DB value
  };
  
  if (!propertyType) return 'commercial';
  return propertyMappings[propertyType] || propertyType.toLowerCase().replace(/\s+/g, '_');
};

export const mapListingType = (listingType: string): string => {
  const listingMappings: { [key: string]: string } = {
    'Sale': 'sale',
    'Resale': 'sale', // Map "Resale" to 'sale'
    'Rent': 'rent',
    'PG/Hostel': 'rent', // Treat PG/Hostel flows as rentals
    'Flatmates': 'rent', // Treat Flatmates as rentals
    'Buy': 'sale', // Map "Buy" to 'sale'
    'Lease': 'rent', // Map "Lease" to 'rent'
    'Industrial land': 'sale', // Map land types to 'sale'
    'Agricultural Land': 'sale',
    'Commercial land': 'sale',
  };
  
  if (!listingType) return 'sale';
  
  // Only map actual listing types, not property types
  const mappedValue = listingMappings[listingType];
  if (mappedValue) {
    return mappedValue;
  }
  
  // For any other values, default to lowercase
  return listingType.toLowerCase();
};

export const mapFurnishing = (furnishing: string | null | undefined): string | null => {
  if (!furnishing) return null;
  
  const furnishingMappings: { [key: string]: string } = {
    'Fully Furnished': 'fully',
    'fully-furnished': 'fully',
    'Fully furnished': 'fully',
    'fully furnished': 'fully',
    'furnished': 'fully',
    'Furnished': 'fully',
    'Semi Furnished': 'semi',
    'semi-furnished': 'semi',
    'Semi furnished': 'semi',
    'semi furnished': 'semi',
    'Semi-Furnished': 'semi',
    'Unfurnished': 'unfurnished',
    'unfurnished': 'unfurnished',
    'Un-furnished': 'unfurnished',
    'un-furnished': 'unfurnished',
  };
  
  return furnishingMappings[furnishing] || null;
};

export const validateMappedValues = (data: {
  bhkType?: string;
  propertyType: string;
  listingType: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate BHK type if provided
  if (data.bhkType) {
    const validBhkTypes = ['studio', '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+', '6bhk', '7bhk', '8bhk', '9bhk', '10bhk', 'multiple'];
    const mappedBhk = mapBhkType(data.bhkType);
    if (!validBhkTypes.includes(mappedBhk)) {
      errors.push(`Invalid BHK type: ${data.bhkType}`);
    }
  }
  
  // Validate property type
  // Note: 'penthouse' and 'duplex' are now mapped to 'apartment' and 'villa' respectively,
  // but we still include them in validPropertyTypes for backward compatibility with existing data
  const validPropertyTypes = ['apartment', 'villa', 'independent_house', 'builder_floor', 'studio_apartment', 'penthouse', 'duplex', 'plot', 'studio', 'pg_hostel', 'flatmates', 'commercial', 'office', 'shop', 'warehouse', 'showroom', 'coworking', 'coliving', 'hotel'];
  const mappedPropertyType = mapPropertyType(data.propertyType);
  if (!validPropertyTypes.includes(mappedPropertyType)) {
    errors.push(`Invalid property type: ${data.propertyType}`);
  }
  
  // Validate listing type
  const validListingTypes = ['sale', 'rent'];
  const mappedListingType = mapListingType(data.listingType);
  if (!validListingTypes.includes(mappedListingType)) {
    errors.push(`Invalid listing type: ${data.listingType}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};