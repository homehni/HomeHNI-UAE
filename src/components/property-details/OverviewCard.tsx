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
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  };
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ property }) => {
  const formatMaintenance = (charges?: number) => {
    if (!charges) return 'Not specified';
    return `₹${charges.toLocaleString()}/month`;
  };

  const formatOwnership = (role?: string) => {
    if (!role) return 'Not specified';
    return role === 'Owner' ? 'Self Owned' : role;
  };

  const formatFloor = (floorNo?: number, totalFloors?: number) => {
    if (floorNo !== undefined && totalFloors) {
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
    return `₹${price.toLocaleString()}`;
  };

  const formatBookingAmount = (amount?: number) => {
    if (!amount) return 'Not specified';
    return `₹${amount.toLocaleString()}`;
  };

  // Check if property is a plot/land
  const isPlotProperty = property.property_type?.toLowerCase().includes('plot') || 
                        property.property_type?.toLowerCase().includes('land');
  
  // Check if property is PG/Hostel/Coliving
  const isPGHostelProperty = property.property_type?.toLowerCase().includes('pg') || 
                            property.property_type?.toLowerCase().includes('hostel') ||
                            property.property_type?.toLowerCase().includes('coliving');

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
    return typeof v === 'string' && v.trim().length > 0 ? v : undefined;
  };

  const getSecurity = (): string => {
    // Prefer detailed selection from amenities (e.g., 'Guard & CCTV')
    const detailed = getAmenityString('security');
    if (detailed) return detailed;
    // Fallback to boolean gated_security
    return property.gated_security ? 'Yes' : 'No';
  };

  const getWashrooms = (): string => {
    const wash = getAmenityString('washrooms') || getAmenityString('washroom');
    if (wash) return wash;
    if (typeof property.bathrooms === 'number' && property.bathrooms > 0) {
      return `${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}`;
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
      icon: MapPin, 
      label: 'Parking', 
      value: getAmenityString('parking') || 'Not specified' 
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
      value: property.water_supply || 'Not specified' 
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
      value: 'Not specified' 
    },
    { 
      icon: Utensils, 
      label: 'Non-Veg Allowed', 
      value: 'Not specified' 
    },
    { 
      icon: Shield, 
      label: 'Security', 
      value: getSecurity() 
    },
    { 
      icon: Home, 
      label: 'Property Condition', 
      value: getAmenityString('currentPropertyCondition') || property.current_property_condition || 'Not specified' 
    },
  ];

  const filteredOverviewItems = overviewItems.filter(item => {
    // Hide irrelevant items for Land/Plot
    if (isPlotProperty && ['Bathroom','Furnishing Status','Floor','Non-Veg Allowed','Pet Allowed'].includes(item.label)) {
      return false;
    }
    // Hide placeholders for PG/Hostel
    if (isPGHostelProperty && ['Bathroom','Floor'].includes(item.label)) {
      return false;
    }
    return item.value !== 'Not specified' && item.value !== undefined;
  });

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