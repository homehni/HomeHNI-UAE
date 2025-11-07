import React from 'react';
import { 
  Sofa, 
  Compass, 
  Droplets, 
  Building, 
  Bath, 
  Utensils, 
  Shield, 
  Users,
  Home,
  Layers,
  DollarSign,
  Key,
  FileText,
  CreditCard,
  Phone,
  Clock,
  Zap,
  MapPin,
  Dumbbell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

interface OverviewCardProps {
  property: {
    super_area?: number;
    carpet_area?: number;
    floor_no?: number;
    total_floors?: number;
    furnishing?: string;
    maintenance_charges?: number;
    owner_role?: string;
    bathrooms?: number;
    balconies?: number;
    availability_type?: string;
    property_type?: string;
    bhk_type?: string;
    // NEW: Additional comprehensive fields
    property_age?: string;
    facing_direction?: string;
    floor_type?: string;
    registration_status?: string;
    booking_amount?: number;
    home_loan_available?: boolean;
    water_supply?: string;
    power_backup?: string;
    gated_security?: boolean;
    who_will_show?: string;
    current_property_condition?: string;
    secondary_phone?: string;
    expected_price?: number;
    price_negotiable?: boolean;
    security_deposit?: number;
    plot_area_unit?: string;
    amenities?: Record<string, unknown>;
    // Land/Plot specific fields
    road_width?: number;
    boundary_wall?: string;
    // PG/Hostel services
    available_services?: {
      laundry?: string;
      room_cleaning?: string;
      warden_facility?: string;
    };
    // PG/Hostel preferences
    gender_preference?: string;
    preferred_guests?: string;
  };
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ property }) => {
  const countryConfig = getCurrentCountryConfig();
  const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
  
  console.log('OverviewCard - Property data:', {
    property_type: property.property_type,
    available_services: property.available_services,
    room_cleaning_value: property.available_services?.room_cleaning,
    laundry_value: property.available_services?.laundry,
    warden_facility_value: property.available_services?.warden_facility,
    isPGHostelProperty: property.property_type?.toLowerCase().includes('pg') || 
                        property.property_type?.toLowerCase().includes('hostel') ||
                        property.property_type?.toLowerCase().includes('coliving') ||
                        property.property_type === 'PG/Hostel'
  });

  const formatMaintenance = (charges?: number) => {
    if (!charges) return 'Not specified';
    return `${currencySymbol}${charges.toLocaleString()}/month`;
  };

  const formatOwnership = (role?: string) => {
    if (!role) return 'Not specified';
    return role === 'Owner' ? 'Self Owned' : role;
  };

  const formatFloor = (floorNo?: number, totalFloors?: number) => {
    // Handle special floor values
    if (floorNo === -1) {
      return 'All floors';
    } else if (floorNo === -2) {
      return 'LB';
    } else if (floorNo === -3) {
      return 'UB';
    } else if (floorNo !== undefined && totalFloors) {
      return `${floorNo}/${totalFloors}`;
    }
    return 'Not specified';
  };

  const formatArea = (superArea?: number, carpetArea?: number, areaUnit?: string, propertyType?: string) => {
    const area = superArea || carpetArea;
    if (!area) return 'Not specified';
    
    const isPlot = propertyType?.toLowerCase().includes('plot') || 
                   propertyType?.toLowerCase().includes('land');
    
    console.log('OverviewCard formatArea:', {
      area,
      areaUnit,
      propertyType,
      isPlot
    });
    
    if (isPlot && areaUnit) {
      const unitMap: Record<string, string> = {
        'sq-ft': 'Sq.Ft',
        'sq-yard': 'Sq.Yard',
        'acre': 'Acre',
        'hectare': 'Hectare',
        'bigha': 'Bigha',
        'biswa': 'Biswa',
        'gunta': 'Gunta',
        'cents': 'Cents',
        'marla': 'Marla',
        'kanal': 'Kanal',
        'kottah': 'Kottah'
      };
      const displayUnit = unitMap[areaUnit] || areaUnit;
      console.log('OverviewCard: Using plot unit:', displayUnit);
      return `${area.toLocaleString()} ${displayUnit}`;
    }
    
    console.log('OverviewCard: Using default Sq.Ft');
    return `${area.toLocaleString()} Sq.Ft`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Not specified';
    return `${currencySymbol}${price.toLocaleString()}`;
  };

  const formatBookingAmount = (amount?: number) => {
    if (!amount) return 'Not specified';
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Check if property is a plot/land
  const isPlotProperty = property.property_type?.toLowerCase().includes('plot') || 
                        property.property_type?.toLowerCase().includes('land');
  
  // Check if property is PG/Hostel/Coliving
  const isPGHostelProperty = property.property_type?.toLowerCase().includes('pg') || 
                            property.property_type?.toLowerCase().includes('hostel') ||
                            property.property_type?.toLowerCase().includes('coliving') ||
                            property.property_type === 'PG/Hostel';

  // Check if property is Commercial
  const isCommercialProperty = property.property_type?.toLowerCase().includes('commercial') ||
                              property.property_type?.toLowerCase().includes('office') ||
                              property.property_type?.toLowerCase().includes('retail') ||
                              property.property_type?.toLowerCase().includes('warehouse') ||
                              property.property_type?.toLowerCase().includes('showroom');

  const getIconForItem = (label: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'Furnishing Status': Sofa,
      'Facing': Compass,
      'Water Supply': Droplets,
      'Floor': Layers,
  'Washrooms': Bath,
      'Non-Veg Allowed': Utensils,
      'Pet Allowed': Users,
  'Security': Shield,
      'Property Type': Building,
      'Balconies': Home,
      'Expected Price': DollarSign,
      'Security Deposit': Key,
      'Registration Status': FileText,
      'Home Loan Available': CreditCard,
      'Power Backup': Zap,
      'Who Shows Property': Users,
      'Secondary Contact': Phone,
      'Availability': Clock,
      'Ownership Type': Key,
      'Property Age': Building,
      'Facing Direction': Compass,
      'Property Condition': Home,
    };
    return iconMap[label] || Home;
  };

  const getAmenityString = (key: string): string | undefined => {
    const a = property.amenities && typeof property.amenities === 'object' ? property.amenities as Record<string, unknown> : undefined;
    const v = a ? a[key] : undefined;
    console.log(`OverviewCard getAmenityString(${key}):`, {
      amenities: property.amenities,
      amenitiesType: typeof property.amenities,
      key,
      value: v,
      valueType: typeof v,
      rawValue: v
    });
    if (typeof v === 'string' && v.trim().length > 0) return v;
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return undefined;
  };

  const getSecurity = (): string => {
    // Prefer detailed selection from amenities (e.g., 'Guard & CCTV')
    const detailed = getAmenityString('security');
    if (detailed) return detailed;
    // Check gatedSecurity in amenities
    const gatedFromAmenities = getAmenityString('gatedSecurity');
    if (gatedFromAmenities) return gatedFromAmenities;
    // Fallback to boolean gated_security
    return property.gated_security ? 'Yes' : 'No';
  };

  const getWashrooms = (): string => {
    const wash = getAmenityString('washrooms') || getAmenityString('washroom');
    if (wash) return wash;
    // Check bathrooms in amenities
    const bathroomsFromAmenities = getAmenityString('bathrooms');
    if (bathroomsFromAmenities && bathroomsFromAmenities !== 'No' && bathroomsFromAmenities !== '0') {
      const num = parseInt(bathroomsFromAmenities);
      if (!isNaN(num) && num > 0) {
        return `${num} Bathroom${num > 1 ? 's' : ''}`;
      }
    }
    if (typeof property.bathrooms === 'number' && property.bathrooms > 0) {
      return `${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}`;
    }
    return 'Not specified';
  };

  const getParking = (): string => {
    const parkingFromAmenities = getAmenityString('parking');
    if (parkingFromAmenities && parkingFromAmenities !== 'Not specified') {
      // Map values to display text
      if (parkingFromAmenities === 'none') return 'No Parking';
      if (parkingFromAmenities === 'bike') return 'Bike';
      if (parkingFromAmenities === 'car') return 'Car';
      if (parkingFromAmenities === 'both') return 'Bike and Car';
      return parkingFromAmenities;
    }
    return 'Not specified';
  };

  const overviewItems = [
    { 
      icon: Sofa, 
      label: 'Furnishing Status', 
      value: property.furnishing || 'Not specified',
      hasAction: property.furnishing === 'Semi'
    },
    { 
      icon: Zap, 
      label: 'Power Backup', 
      value: getAmenityString('powerBackup') || property.power_backup || 'Not specified' 
    },
    { 
      icon: Droplets, 
      label: 'Water Storage Facility', 
      value: getAmenityString('waterStorageFacility') || 'Not specified' 
    },
    { 
      icon: Compass, 
      label: 'Facing', 
      value: property.facing_direction || 'Not specified' 
    },
    { 
      icon: Droplets, 
      label: 'Water Supply', 
      value: (() => {
        const rawValue = property.water_supply || getAmenityString('waterSupply');
        if (!rawValue || rawValue === 'Not specified') return 'Not specified';
        // Format the value by replacing underscores with spaces and capitalizing
        return rawValue.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
      })()
    },
    { 
      icon: Layers, 
      label: 'Floor', 
      value: formatFloor(property.floor_no, property.total_floors) 
    },
    { 
      icon: Bath, 
      label: 'Washrooms', 
      value: getWashrooms() 
    },
    { 
      icon: Users, 
      label: 'Pet Allowed', 
      value: getAmenityString('petAllowed') || 'Not specified'
    },
    { 
      icon: Utensils, 
      label: 'Non-Veg Allowed', 
      value: getAmenityString('nonVegAllowed') || 'Not specified'
    },
    { 
      icon: Dumbbell, 
      label: 'Gym', 
      value: getAmenityString('gym') || 'Not specified'
    },
    { 
      icon: Shield, 
      label: 'Gated Security', 
      value: getAmenityString('gatedSecurity') || 'Not specified'
    },
    { 
      icon: Home, 
      label: 'Property Condition', 
      value: getAmenityString('currentPropertyCondition') || property.current_property_condition || 'Not specified' 
    },
    // Land/Plot specific infrastructure fields
    { 
      icon: Zap, 
      label: 'Electricity Connection', 
      value: (() => {
        // Check both direct property field and amenities object
        const directValue = (property as any).electricity_connection;
        const amenityValue = property.amenities?.electricityConnection;
        const value = directValue || amenityValue;
        
        if (!value || value === 'Not specified') return 'Not specified';
        
        // Map values to user-friendly names
        const electricityMap: Record<string, string> = {
          'available': 'Available',
          'not-available': 'Not Available',
          'three-phase': 'Three Phase',
          'single-phase': 'Single Phase'
        };
        
        return electricityMap[value] || value.charAt(0).toUpperCase() + value.slice(1);
      })()
    },
    { 
      icon: Droplets, 
      label: 'Sewage Connection', 
      value: (() => {
        // Check both direct property field and amenities object
        const directValue = (property as any).sewage_connection;
        const amenityValue = property.amenities?.sewageConnection;
        const value = directValue || amenityValue;
        
        if (!value || value === 'Not specified') return 'Not specified';
        
        // Map values to user-friendly names
        const sewageMap: Record<string, string> = {
          'septic-tank': 'Septic Tank',
          'municipal': 'Municipal Connection',
          'available': 'Available',
          'not-available': 'Not Available'
        };
        
        return sewageMap[value] || value.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
      })()
    },
    { 
      icon: MapPin, 
      label: 'Road Width', 
      value: property.road_width ? `${property.road_width} ft.` : 'Not specified' 
    },
    { 
      icon: Shield, 
      label: 'Boundary Wall', 
      value: property.boundary_wall ? property.boundary_wall.charAt(0).toUpperCase() + property.boundary_wall.slice(1) : 'Not specified' 
    },
    // PG/Hostel services
    { 
      icon: Droplets, 
      label: 'Laundry Service', 
      value: property.available_services?.laundry === 'yes' ? 'Available' : 'Not Available'
    },
    { 
      icon: Home, 
      label: 'Room Cleaning', 
      value: property.available_services?.room_cleaning === 'yes' ? 'Available' : 'Not Available'
    },
    { 
      icon: Shield, 
      label: 'Warden Facility', 
      value: property.available_services?.warden_facility === 'yes' ? 'Available' : 'Not Available'
    },
    // PG/Hostel preferences
    { 
      icon: Users, 
      label: 'Gender Preference', 
      value: property.gender_preference || 'Not specified'
    },
  ];

  const filteredOverviewItems = overviewItems.filter(item => {
    // Hide irrelevant items for Land/Plot
    if (isPlotProperty && ['Washrooms','Furnishing Status','Floor','Non-Veg Allowed','Pet Allowed','Gym','Gated Security','Road Width','Boundary Wall','Laundry Service','Room Cleaning','Warden Facility','Gender Preference'].includes(item.label)) {
      return false;
    }
    // Hide placeholders for PG/Hostel
    if (isPGHostelProperty && ['Washrooms','Floor'].includes(item.label)) {
      return false;
    }
    // Hide irrelevant items for Commercial properties
    if (isCommercialProperty && ['Washrooms','Non-Veg Allowed','Pet Allowed','Gated Security','Laundry Service','Room Cleaning','Warden Facility','Gender Preference'].includes(item.label)) {
      return false;
    }
    
    // Hide PG/Hostel services and preferences for non-PG/Hostel properties
    if (!isPGHostelProperty && ['Laundry Service','Room Cleaning','Warden Facility','Gender Preference'].includes(item.label)) {
      return false;
    }
    
    // Hide amenities marked as "Not Available" for Commercial properties
    if (isCommercialProperty && (item.value === 'Not Available' || item.value === 'not-available')) {
      return false;
    }
    
    // Hide items with negative/unavailable values
    const negativeValues = ['Not Available', 'Not available', 'No', 'false', 'No Parking', 'Not specified'];
    if (negativeValues.includes(item.value)) {
      return false;
    }
    
    const shouldShow = item.value !== 'Not specified' && item.value !== undefined;
    console.log(`OverviewCard filtering ${item.label}:`, {
      value: item.value,
      shouldShow,
      isNegativeValue: negativeValues.includes(item.value),
      isPlotProperty,
      isPGHostelProperty,
      isCommercialProperty,
      rawValue: item.value
    });
    return shouldShow;
  });
  
  console.log('OverviewCard final filtered items:', filteredOverviewItems.map(item => ({
    label: item.label,
    value: item.value
  })));

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          Overview
        </h2>
        <div className="w-12 h-0.5 bg-red-600 mb-4 sm:mb-6"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredOverviewItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2">
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                      {item.value}
                    </span>
                    {item.hasAction && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs border-teal-300 text-teal-700 hover:bg-teal-50 px-2 py-1 h-auto hidden sm:inline-flex"
                      >
                        Furnish Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};