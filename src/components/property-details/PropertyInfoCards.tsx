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
    if (!property.age_of_building) return 'Not specified';
    return property.age_of_building;
  };

  const getPreferredTenant = () => {
    if (!property.preferred_tenant) return 'Any';
    return property.preferred_tenant.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const infoCards = [
    {
      icon: Bed,
      title: property.bhk_type?.replace('bhk', ' Bedroom') || 'Not specified',
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
      title: property.balconies?.toString() || '0',
      subtitle: 'Balcony',
    },
    {
      icon: Calendar,
      title: formatDate(property.created_at),
      subtitle: 'Posted On',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 min-w-0">
        {infoCards.map((card, index) => {
          const isRightCol = index % 2 === 1;
          const rows = Math.ceil(infoCards.length / 2);
          const isLastRow = Math.floor(index / 2) === rows - 1;
          const cellBorders = [
            !isRightCol ? 'sm:border-r' : '',
            !isLastRow ? 'border-b' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={index}
              className={`p-3 sm:p-4 ${cellBorders} flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden`}
            >
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {card.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};