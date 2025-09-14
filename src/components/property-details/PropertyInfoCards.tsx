import React from 'react';
import { 
  Bed, 
  Building, 
  Users, 
  Clock, 
  Car, 
  Calendar,
  Home,
  MapPin 
} from 'lucide-react';

interface PropertyInfoCardsProps {
  property: {
    id: string;
    bhk_type?: string;
    property_type?: string;
    preferred_tenant?: string;
    available_from?: string;
    parking?: string;
    age_of_building?: string;
    balconies?: number;
    created_at?: string;
  };
}

export const PropertyInfoCards: React.FC<PropertyInfoCardsProps> = ({ property }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getPropertyType = () => {
    if (!property.property_type) return 'Apartment';
    return property.property_type.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPossession = () => {
    if (!property.available_from) return 'Immediately';
    const date = new Date(property.available_from);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Immediately';
    if (diffDays <= 30) return 'Within a month';
    return formatDate(property.available_from);
  };

  const getParking = () => {
    if (!property.parking || property.parking === 'none') return 'No Parking';
    if (property.parking === 'bike') return 'Bike';
    if (property.parking === 'car') return 'Car';
    if (property.parking === 'both') return 'Bike and Car';
    return property.parking;
  };

  const getAgeOfBuilding = () => {
    if (!property.age_of_building) return '1-3 Years';
    return property.age_of_building;
  };

  const getPreferredTenant = () => {
    if (!property.preferred_tenant) return 'Family';
    return property.preferred_tenant.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const infoCards = [
    {
      icon: Bed,
      title: property.bhk_type?.replace('bhk', ' Bedroom') || '3 Bedroom',
      subtitle: 'No. of Bedroom',
    },
    {
      icon: Building,
      title: getPropertyType(),
      subtitle: 'Property Type',
    },
    {
      icon: Users,
      title: getPreferredTenant(),
      subtitle: 'Preferred Tenant',
    },
    {
      icon: Clock,
      title: getPossession(),
      subtitle: 'Possession',
    },
    {
      icon: Car,
      title: getParking(),
      subtitle: 'Parking',
    },
    {
      icon: Calendar,
      title: getAgeOfBuilding(),
      subtitle: 'Age of Building',
    },
    {
      icon: Home,
      title: property.balconies?.toString() || '2',
      subtitle: 'Balcony',
    },
    {
      icon: Calendar,
      title: formatDate(property.created_at),
      subtitle: 'Posted On',
    },
  ];

  return (
    <div className="space-y-3">
      {infoCards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="bg-gray-50 p-3 rounded-lg flex-shrink-0">
            <card.icon className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-base mb-1">
              {card.title}
            </div>
            <div className="text-sm text-gray-500">
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};