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

  const formatArea = (superArea?: number, carpetArea?: number) => {
    const area = superArea || carpetArea;
    return area ? `${area.toLocaleString()} Sq.Ft` : 'Not specified';
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
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Furnishing Status': Sofa,
      'Facing': Compass,
      'Water Supply': Droplets,
      'Floor': Layers,
      'Bathroom': Bath,
      'Non-Veg Allowed': Utensils,
      'Pet Allowed': Users,
      'Gated Security': Shield,
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

  const overviewItems = [
    { 
      icon: Sofa, 
      label: 'Furnishing Status', 
      value: property.furnishing || 'Semi',
      hasAction: property.furnishing === 'Semi'
    },
    { 
      icon: Compass, 
      label: 'Facing', 
      value: property.facing_direction || 'East' 
    },
    { 
      icon: Droplets, 
      label: 'Water Supply', 
      value: property.water_supply || 'Both' 
    },
    { 
      icon: Layers, 
      label: 'Floor', 
      value: formatFloor(property.floor_no, property.total_floors) || '3/4' 
    },
    { 
      icon: Bath, 
      label: 'Bathroom', 
      value: property.bathrooms?.toString() || '3' 
    },
    { 
      icon: Users, 
      label: 'Pet Allowed', 
      value: 'Yes' 
    },
    { 
      icon: Utensils, 
      label: 'Non-Veg Allowed', 
      value: 'Yes' 
    },
    { 
      icon: Shield, 
      label: 'Gated Security', 
      value: property.gated_security ? 'Yes' : 'Yes' 
    },
  ];

  const filteredOverviewItems = overviewItems.filter(item => 
    item.value !== 'Not specified' && item.value !== undefined
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Overview
        </h2>
        <div className="w-12 h-0.5 bg-red-600 mb-6"></div>
        
        <div className="grid grid-cols-4 gap-6">
          {filteredOverviewItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 mb-1">
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {item.value}
                    </span>
                    {item.hasAction && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs border-teal-300 text-teal-700 hover:bg-teal-50 px-2 py-1 h-auto"
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