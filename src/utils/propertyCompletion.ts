interface PropertyData {
  title?: string;
  property_type?: string;
  listing_type?: string;
  bhk_type?: string;
  expected_price?: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city?: string;
  locality?: string;
  state?: string;
  pincode?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  amenities?: any;
  availability_type?: string;
  availability_date?: string;
  furnishing?: string;
  floor_no?: number;
  total_floors?: number;
  property_age?: string;
  parking_type?: string;
  on_main_road?: boolean;
  corner_property?: boolean;
}

interface PGPropertyData {
  title?: string;
  property_type?: string;
  expected_rent?: number;
  expected_deposit?: number;
  city?: string;
  locality?: string;
  state?: string;
  landmark?: string;
  place_available_for?: string;
  preferred_guests?: string;
  available_from?: string;
  food_included?: boolean;
  gate_closing_time?: string;
  description?: string;
  available_services?: any;
  amenities?: any;
  parking?: string;
  images?: string[];
  videos?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface CompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
}

export const calculatePGPropertyCompletion = (property: PGPropertyData): CompletionResult => {
  // PG/Hostel property fields
  const fields: Array<{ key: string; weight: number; required: boolean }> = [
    // Basic Information (30% weight)
    { key: 'title', weight: 5, required: true },
    { key: 'expected_rent', weight: 5, required: true },
    { key: 'expected_deposit', weight: 5, required: true },
    { key: 'place_available_for', weight: 5, required: true },
    { key: 'preferred_guests', weight: 5, required: true },
    { key: 'food_included', weight: 5, required: true },
    
    // Location Details (25% weight)
    { key: 'city', weight: 8, required: true },
    { key: 'locality', weight: 8, required: true },
    { key: 'state', weight: 4, required: true },
    { key: 'landmark', weight: 5, required: false },
    
    // PG Details (20% weight)
    { key: 'available_from', weight: 3, required: false },
    { key: 'gate_closing_time', weight: 3, required: false },
    { key: 'available_services', weight: 5, required: false },
    { key: 'amenities', weight: 5, required: false },
    { key: 'parking', weight: 4, required: false },
    
    // Media & Description (15% weight)
    { key: 'images', weight: 10, required: false },
    { key: 'description', weight: 5, required: false },
  ];

  let totalScore = 0;
  let maxScore = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  fields.forEach(field => {
    maxScore += field.weight;
    
    const value = property[field.key as keyof PGPropertyData];
    let isCompleted = false;

    if (field.key === 'images') {
      isCompleted = Array.isArray(value) && value.length > 0;
    } else if (field.key === 'amenities') {
      console.log('Checking PG amenities:', { 
        value, 
        type: typeof value, 
        isObject: typeof value === 'object' && value !== null,
        hasKeys: value && typeof value === 'object' ? Object.keys(value) : [],
        propertyTitle: property.title || 'Unknown'
      });
      isCompleted = value && (
        (typeof value === 'object' && Object.keys(value).length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.length > 0)
      );
    } else if (field.key === 'available_services') {
      isCompleted = value && (
        (typeof value === 'object' && Object.keys(value).length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.length > 0)
      );
    } else if (field.key === 'expected_rent') {
      isCompleted = typeof value === 'number' && value > 0; // Any positive rent is valid
    } else if (field.key === 'expected_deposit') {
      isCompleted = typeof value === 'number' && value >= 0; // 0 deposit is valid
    } else if (field.key === 'city') {
      isCompleted = value && value !== 'Unknown' && value !== 'unknown' && value !== '';
    } else if (field.key === 'state') {
      isCompleted = value && value !== 'Unknown' && value !== 'unknown' && value !== '';
    } else if (field.key === 'locality') {
      isCompleted = value && value !== '' && value.length > 2; // Minimum locality length
    } else if (field.key === 'description') {
      isCompleted = value && value !== '' && value.length > 5; // Minimum description length
    } else if (field.key === 'place_available_for') {
      isCompleted = value && value !== '' && ['male', 'female', 'co-living'].includes(value);
    } else if (field.key === 'preferred_guests') {
      isCompleted = value && value !== '' && ['student', 'working_professional', 'any'].includes(value);
    } else if (field.key === 'food_included') {
      isCompleted = typeof value === 'boolean';
    } else if (field.key === 'gate_closing_time') {
      isCompleted = value && value !== '' && value.length > 0; // Any non-empty time is valid
    } else if (field.key === 'available_from') {
      isCompleted = value && value !== '' && value.length > 0; // Any non-empty date is valid
    } else if (field.key === 'parking') {
      isCompleted = value && value !== '' && value.length > 0; // Any non-empty parking option is valid
    } else {
      isCompleted = value !== null && value !== undefined && value !== '';
    }

    if (isCompleted) {
      totalScore += field.weight;
      completedFields.push(field.key);
    } else {
      if (field.required) {
        missingFields.push(field.key);
      } else {
        // For optional fields, add them to missing fields for suggestions
        missingFields.push(field.key);
      }
    }
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    percentage,
    missingFields,
    completedFields
  };
};

export const calculatePropertyCompletion = (property: PropertyData): CompletionResult => {
  const propertyType = property.property_type;
  
  // Define fields based on property type
  let fields: Array<{ key: string; weight: number; required: boolean }> = [];
  
  if (propertyType === 'commercial' || propertyType === 'office' || propertyType === 'shop' || 
      propertyType === 'warehouse' || propertyType === 'showroom') {
    // Commercial property fields (only fields that exist in database)
    fields = [
      // Basic Information (30% weight)
      { key: 'title', weight: 5, required: true },
      { key: 'property_type', weight: 5, required: true },
      { key: 'listing_type', weight: 5, required: true },
      { key: 'expected_price', weight: 5, required: true },
      { key: 'super_area', weight: 5, required: true },
      
      // Location Details (25% weight)
      { key: 'city', weight: 8, required: true },
      { key: 'locality', weight: 8, required: true },
      { key: 'state', weight: 4, required: true },
      { key: 'pincode', weight: 5, required: true },
      
      // Property Details (20% weight)
      { key: 'floor_no', weight: 3, required: false },
      { key: 'total_floors', weight: 3, required: false },
      { key: 'property_age', weight: 2, required: false },
      { key: 'bathrooms', weight: 3, required: false },
      { key: 'balconies', weight: 2, required: false },
      { key: 'floor_type', weight: 2, required: false },
      
      // Media & Description (15% weight)
      { key: 'images', weight: 10, required: false },
      { key: 'description', weight: 5, required: false },
      
      // Amenities & Features (10% weight)
      { key: 'amenities', weight: 10, required: false },
    ];
  } else if (propertyType === 'plot' || propertyType === 'land') {
    // Plot/Land property fields (only fields that exist in database)
    fields = [
      // Basic Information (40% weight)
      { key: 'title', weight: 8, required: true },
      { key: 'property_type', weight: 4, required: true },
      { key: 'listing_type', weight: 4, required: true },
      { key: 'expected_price', weight: 12, required: true },
      { key: 'super_area', weight: 12, required: true },
      
      // Location Details (30% weight)
      { key: 'city', weight: 8, required: true },
      { key: 'locality', weight: 8, required: true },
      { key: 'state', weight: 7, required: true },
      { key: 'pincode', weight: 7, required: true },
      
      // Media & Description (30% weight)
      { key: 'images', weight: 20, required: false },
      { key: 'description', weight: 10, required: false },
    ];
  } else {
    // Residential property fields (default)
    fields = [
      // Basic Information (30% weight)
      { key: 'title', weight: 5, required: true },
      { key: 'property_type', weight: 5, required: true },
      { key: 'listing_type', weight: 5, required: true },
      { key: 'bhk_type', weight: 5, required: true },
      { key: 'expected_price', weight: 5, required: true },
      { key: 'super_area', weight: 5, required: true },
      
      // Location Details (25% weight)
      { key: 'city', weight: 8, required: true },
      { key: 'locality', weight: 8, required: true },
      { key: 'state', weight: 4, required: true },
      { key: 'pincode', weight: 5, required: true },
      
      // Property Details (20% weight)
      { key: 'bathrooms', weight: 5, required: false },
      { key: 'balconies', weight: 3, required: false },
      { key: 'furnishing', weight: 4, required: false },
      { key: 'floor_no', weight: 3, required: false },
      { key: 'total_floors', weight: 3, required: false },
      { key: 'property_age', weight: 2, required: false },
      
      // Media & Description (15% weight)
      { key: 'images', weight: 10, required: false },
      { key: 'description', weight: 5, required: false },
      
      // Amenities & Features (10% weight)
      { key: 'amenities', weight: 10, required: false },
    ];
  }

  let totalScore = 0;
  let maxScore = 0;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  fields.forEach(field => {
    maxScore += field.weight;
    
    const value = property[field.key as keyof PropertyData];
    let isCompleted = false;

    if (field.key === 'images') {
      isCompleted = Array.isArray(value) && value.length > 0;
    } else if (field.key === 'amenities') {
      console.log('Checking amenities:', { 
        value, 
        type: typeof value, 
        isObject: typeof value === 'object' && value !== null,
        hasKeys: value && typeof value === 'object' ? Object.keys(value) : [],
        propertyTitle: property.title || 'Unknown'
      });
      isCompleted = value && (
        (typeof value === 'object' && Object.keys(value).length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === 'string' && value.length > 0)
      );
    } else if (field.key === 'expected_price') {
      isCompleted = typeof value === 'number' && value > 0; // Any positive price is valid
    } else if (field.key === 'super_area') {
      isCompleted = typeof value === 'number' && value > 0; // Any positive area is valid
    } else if (field.key === 'carpet_area') {
      isCompleted = typeof value === 'number' && value > 0; // Any positive carpet area is valid
    } else if (field.key === 'bathrooms') {
      isCompleted = typeof value === 'number' && value > 0;
    } else if (field.key === 'balconies') {
      isCompleted = typeof value === 'number' && value >= 0; // 0 is valid for balconies
    } else if (field.key === 'city') {
      isCompleted = value && value !== 'Unknown' && value !== 'unknown' && value !== '';
    } else if (field.key === 'state') {
      isCompleted = value && value !== 'Unknown' && value !== 'unknown' && value !== '';
    } else if (field.key === 'pincode') {
      isCompleted = value && value !== '000000' && value !== '0' && value !== '' && /^\d{6}$/.test(value);
    } else if (field.key === 'locality') {
      isCompleted = value && value !== '' && value.length > 2; // Minimum locality length
    } else if (field.key === 'description') {
      isCompleted = value && value !== '' && value.length > 5; // Minimum description length
    } else {
      isCompleted = value !== null && value !== undefined && value !== '';
    }

    if (isCompleted) {
      totalScore += field.weight;
      completedFields.push(field.key);
    } else {
      if (field.required) {
        missingFields.push(field.key);
      } else {
        // For optional fields, add them to missing fields for suggestions
        missingFields.push(field.key);
      }
    }
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    percentage,
    missingFields,
    completedFields
  };
};

export const getCompletionMessage = (percentage: number): string => {
  if (percentage >= 90) return "Excellent! Your property listing is complete and ready to attract quality tenants/buyers! 🌟";
  if (percentage >= 80) return "Great job! Your property listing is almost complete. Just a few more details to make it perfect! ✨";
  if (percentage >= 70) return "Good progress! Your listing is looking good. Add a few more details to make it stand out! 🎯";
  if (percentage >= 60) return "Nice start! Complete your listing with more details to get better visibility! 📈";
  if (percentage >= 50) return "You're halfway there! Add more details to make your property more attractive! 🚀";
  if (percentage >= 40) return "Good beginning! Your property needs more details to compete with other listings! 💪";
  if (percentage >= 30) return "Getting started! Add more information to make your property listing complete! 📝";
  return "Your property listing needs more details. Let's complete it to attract the right tenants/buyers! 🏠";
};

export const getPrioritySuggestions = (missingFields: string[]): string[] => {
  const priorityOrder = [
    'images',
    'amenities', 
    'locality',
    'super_area',
    'bhk_type',
    'expected_price',
    'description',
    'bathrooms',
    'furnishing',
    'floor_no'
  ];

  return priorityOrder.filter(field => missingFields.includes(field)).slice(0, 3);
};
