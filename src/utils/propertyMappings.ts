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
    '10 BHK': '10bhk',
    'Multiple': 'multiple',
    'PG/Hostel': 'pg_hostel'
  };
  
  if (!bhkType) return '';
  return bhkMappings[bhkType] || bhkType.toLowerCase().replace(/\s+/g, '');
};

export const mapPropertyType = (propertyType: string): string => {
  const propertyMappings: { [key: string]: string } = {
    'Apartment': 'apartment',
    'Apartment/Flat': 'apartment', // Map form value to DB value
    'Villa': 'villa',
    'House': 'independent_house', // Map "House" to 'independent_house'
    'Independent House': 'independent_house',
    'Independent House/Villa': 'independent_house', // Map form value to DB value
    'Builder Floor': 'builder_floor',
    'Studio Apartment': 'studio_apartment', // Map Studio Apartment to studio_apartment
    'Penthouse': 'penthouse', // Map Penthouse to penthouse
    'Duplex': 'duplex', // Map Duplex to duplex
    'Plot': 'plot',
    'Plot/Land': 'plot', // Map form value to DB value
    'Land/Plot': 'plot', // Map form value to DB value (alternate label)
    'Agricultural Land': 'agriculture_lands', // Map Agricultural Land to agriculture_lands
    'Farmhouse': 'farm_house', // Map Farmhouse to farm_house
    'Studio': 'studio',
    'PG/Hostel': 'pg_hostel', // Map form value to DB value
    'Flatmates': 'flatmates', // Map form value to DB value
    'Commercial': 'commercial',
    'Office': 'office',
    'Office Space': 'office', // Map "Office Space" to 'office'
    'Retail/Shop': 'shop', // Map form value to DB value
    'Shop': 'shop',
    'Warehouse': 'warehouse',
    'Industrial/Warehouse': 'warehouse', // Map form value to DB value
    'Showroom': 'showroom',
    'Co-working': 'coworking', // Map form value to DB value
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
    'Flatmates': 'rent' // Treat Flatmates flows as rentals
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
    const validBhkTypes = ['studio', '1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+', '6bhk', '7bhk', '8bhk', '9bhk', '10bhk', 'multiple', 'pg_hostel'];
    const mappedBhk = mapBhkType(data.bhkType);
    if (!validBhkTypes.includes(mappedBhk)) {
      errors.push(`Invalid BHK type: ${data.bhkType}`);
    }
  }
  
  // Validate property type
  const validPropertyTypes = ['apartment', 'villa', 'independent_house', 'builder_floor', 'studio_apartment', 'penthouse', 'duplex', 'plot', 'studio', 'pg_hostel', 'flatmates', 'commercial', 'office', 'shop', 'warehouse', 'showroom', 'coworking', 'hotel'];
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