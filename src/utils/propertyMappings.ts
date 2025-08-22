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
    '6 BHK': '6bhk',
    '7 BHK': '7bhk',
    '8 BHK': '8bhk',
    '9 BHK': '9bhk',
    '10 BHK': '10bhk'
  };
  
  if (!bhkType) return '';
  return bhkMappings[bhkType] || bhkType.toLowerCase().replace(/\s+/g, '');
};

export const mapPropertyType = (propertyType: string): string => {
  const propertyMappings: { [key: string]: string } = {
    'Apartment': 'apartment',
    'Villa': 'villa',
    'House': 'independent_house', // Map "House" to 'independent_house'
    'Independent House': 'independent_house',
    'Builder Floor': 'builder_floor',
    'Plot': 'plot',
    'Commercial': 'commercial',
    'Office': 'office',
    'Office Space': 'office', // Map "Office Space" to 'office'
    'Shop': 'shop',
    'Warehouse': 'warehouse',
    'Showroom': 'showroom'
  };
  
  if (!propertyType) return 'commercial';
  return propertyMappings[propertyType] || propertyType.toLowerCase().replace(/\s+/g, '_');
};

export const mapListingType = (listingType: string): string => {
  const listingMappings: { [key: string]: string } = {
    'Sale': 'sale',
    'Resale': 'sale', // Map "Resale" to 'sale'
    'Rent': 'rent'
  };
  
  if (!listingType) return 'sale';
  return listingMappings[listingType] || listingType.toLowerCase();
};

export const validateMappedValues = (data: {
  bhkType?: string;
  propertyType: string;
  listingType: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate BHK type if provided
  if (data.bhkType) {
    const validBhkTypes = ['studio', '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+', '6bhk', '7bhk', '8bhk', '9bhk', '10bhk'];
    const mappedBhk = mapBhkType(data.bhkType);
    if (!validBhkTypes.includes(mappedBhk)) {
      errors.push(`Invalid BHK type: ${data.bhkType}`);
    }
  }
  
  // Validate property type
  const validPropertyTypes = ['apartment', 'villa', 'independent_house', 'builder_floor', 'plot', 'commercial', 'office', 'shop', 'warehouse', 'showroom'];
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