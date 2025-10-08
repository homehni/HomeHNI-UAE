import React from 'react';
import { 
  Bed, 
  Building, 
  Users, 
  Clock, 
  Car, 
  Calendar,
  Home,
  MapPin,
  Layers,
  Shield,
  Utensils,
  Key,
} from 'lucide-react';

interface PropertyInfoCardsProps {
  property: {
    id: string;
    bhk_type?: string;
    property_type?: string;
    preferred_tenant?: string;
    available_from?: string;
    availability_type?: string; // immediate | date | custom
    parking?: string;
    age_of_building?: string;
    property_age?: string; // fallback key used in DB for age
    balconies?: number;
    created_at?: string;
  // PG-specific fields
  preferred_guests?: string;
  food_included?: boolean | string;
  gate_closing_time?: string;
  place_available_for?: 'male' | 'female' | 'anyone';
    // Common/Commercial extras
    floor_no?: number;
    total_floors?: number;
    furnishing?: string;
    furnishing_status?: string;
  amenities?: { furnishing?: string } | Record<string, unknown>;
    // Plot specific
    plot_length?: number;
    plot_width?: number;
    // Legacy/alternate keys support for submissions and table rows
    length?: number;
    width?: number;
    road_width?: number;
    roadWidth?: number;
    boundary_wall?: 'yes' | 'no' | 'partial';
    boundaryWall?: string;
    ownership_type?: string;
    owner_role?: string;
    plot_area_unit?: string;
  };
}

export const PropertyInfoCards: React.FC<PropertyInfoCardsProps> = ({ property }) => {
  // Debug: Log property data for Land/Plot properties
  const isLandPlot = property.property_type?.toLowerCase().includes('land') || 
                     property.property_type?.toLowerCase().includes('plot');
  
  if (isLandPlot) {
    console.log('🔍 PropertyInfoCards - Land/Plot property data:', {
      property_type: property.property_type,
      plot_length: property.plot_length,
      plot_width: property.plot_width,
      road_width: property.road_width,
      boundary_wall: property.boundary_wall,
      ownership_type: property.ownership_type,
      plot_area_unit: property.plot_area_unit,
      allKeys: Object.keys(property),
      fullProperty: property
    });
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    let date: Date;
    const ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (ddmmyyyy.test(String(dateString))) {
      const [dd, mm, yyyy] = String(dateString).split('/').map(Number);
      date = new Date(yyyy, (mm || 1) - 1, dd || 1);
    } else {
      date = new Date(String(dateString));
    }
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
    const at = property.availability_type?.toLowerCase();
    if (at === 'immediate' || at === 'immediately') return 'Immediately';
    if (!property.available_from) return 'Immediately';
    const s = String(property.available_from);
    const ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const date = ddmmyyyy.test(s)
      ? (() => { const [dd, mm, yyyy] = s.split('/').map(Number); return new Date(yyyy, (mm || 1) - 1, dd || 1); })()
      : new Date(s);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Immediately';
    if (diffDays <= 30) return 'Within a month';
    return formatDate(s);
  };

  const getParking = () => {
    if (!property.parking || property.parking === 'none') return 'No Parking';
    if (property.parking === 'bike') return 'Bike';
    if (property.parking === 'car') return 'Car';
    if (property.parking === 'both') return 'Bike and Car';
    return property.parking;
  };

  const getAgeOfBuilding = () => {
    const raw = property.age_of_building || property.property_age;
    if (!raw) return 'Not specified';
    return String(raw).replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const getFurnishing = () => {
    const amen = (property.amenities && typeof property.amenities === 'object') ? property.amenities as Record<string, unknown> : undefined;
    const f = property.furnishing || property.furnishing_status || (typeof amen?.furnishing === 'string' ? amen.furnishing : undefined);
    return f ? String(f).replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'Not specified';
  };

  const getFloorText = () => {
    const floor = property.floor_no;
    const total = property.total_floors;
    const floorText = (floor === undefined || floor === null)
      ? 'Ground Floor'
      : (floor === 0 ? 'Ground Floor' : `${floor}${floor === 1 ? 'st' : floor === 2 ? 'nd' : floor === 3 ? 'rd' : 'th'} Floor`);
    const subtitle = (typeof total === 'number' && total > 0) ? `Of Total ${total} Floors` : undefined;
    return { title: floorText, subtitle };
  };

  const getAvailableFrom = () => {
    // Respect explicit date if present (supports dd/mm/yyyy)
    if (property.available_from) {
      return formatDate(String(property.available_from));
    }
    // Fall back to availability_type semantics
    const at = property.availability_type?.toLowerCase();
    if (at === 'immediate' || at === 'immediately') return 'Immediately';
    return 'Immediately';
  };

  const getPreferredTenant = () => {
    const isPGLocal = property.property_type?.toLowerCase().includes('pg') || 
                      property.property_type?.toLowerCase().includes('hostel') ||
                      property.property_type?.toLowerCase().includes('coliving');
    if (isPGLocal) {
      const g = property.place_available_for;
      if (g === 'male') return 'Male';
      if (g === 'female') return 'Female';
      if (g === 'anyone') return 'Any';
    }
    const raw = property.preferred_tenant || property.preferred_guests;
    if (!raw) return 'Any';
    return raw.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isPlot = property.property_type?.toLowerCase().includes('plot') || 
                 property.property_type?.toLowerCase().includes('land');
  const isPG = property.property_type?.toLowerCase().includes('pg') || 
               property.property_type?.toLowerCase().includes('hostel') ||
               property.property_type?.toLowerCase().includes('coliving');

  const unitMap: Record<string, string> = {
    'sq-ft': 'sq.ft.',
    'sq-yard': 'sq.yard',
    'sq-m': 'sq.m.',
    'acre': 'acre',
    'hectare': 'hectare',
    'bigha': 'bigha',
    'biswa': 'biswa',
    'gunta': 'gunta',
    'cents': 'cents',
    'marla': 'marla',
    'kanal': 'kanal',
    'kottah': 'kottah'
  };

  const formatDimensions = () => {
    // Support multiple possible keys from different data sources
    const L = property.plot_length ?? property.length;
    const W = property.plot_width ?? property.width;
    if (!L || !W) return 'Not specified';
    // Always show linear dimensions in feet regardless of area unit
    return `${L} x ${W} ft.`;
  };

  const formatOwnership = () => {
    const raw = property.ownership_type || property.owner_role;
    if (!raw) return 'Not specified';
    return String(raw).replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const formatRoadWidth = () => {
    const rw = property.road_width ?? property.roadWidth;
    if (!rw && rw !== 0) return 'Not specified';
    return `${rw} ft.`;
  };

  const formatBoundaryWall = () => {
    const v = property.boundary_wall ?? property.boundaryWall;
    if (v === undefined || v === null || v === '') return 'Not specified';
    const s = String(v).toLowerCase().trim();
    if (['yes', 'y', 'present', 'available', 'have'].includes(s)) return 'Yes';
    if (['no', 'n', 'absent', 'not available', 'none'].includes(s)) return 'No';
    if (s.includes('partial')) return 'Partial';
    // Fallback to title case value
    return String(v).replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const defaultInfoCards = [
    // For PG/Hostel, hide the bedroom card entirely
    ...(!isPG ? [{
      icon: Bed,
      title: property.bhk_type?.replace('bhk', ' Bedroom') || 'Not specified',
      subtitle: 'No. of Bedroom',
    }] : []),
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

  const plotInfoCards = [
    {
      icon: Calendar,
      title: formatDate(property.created_at),
      subtitle: 'Posted On',
    },
    {
      icon: Clock,
      title: getPossession(),
      subtitle: 'Possession',
    },
    {
      icon: Layers,
      title: formatDimensions(),
      subtitle: 'Dimension (L x B)',
    },
    {
      icon: Shield,
      title: formatOwnership(),
      subtitle: 'Ownership',
    },
    {
      icon: MapPin,
      title: formatRoadWidth(),
      subtitle: 'Width of facing road',
    },
    {
      icon: Home,
      title: formatBoundaryWall(),
      subtitle: 'Boundary wall',
    },
  ];

  const isCommercial = !!property.property_type && (
    property.property_type.toLowerCase().includes('commercial') ||
    ['office', 'shop', 'retail', 'warehouse', 'showroom', 'restaurant', 'co-working', 'coworking']
      .some(t => property.property_type?.toLowerCase().includes(t))
  );

  const floorInfo = getFloorText();
  const commercialInfoCards = [
    {
      icon: Building,
      title: getPropertyType(),
      subtitle: 'Property Type',
    },
    {
      icon: Car,
      title: getParking(),
      subtitle: 'Parking',
    },
    {
      icon: MapPin,
      title: floorInfo.title,
      subtitle: floorInfo.subtitle,
    },
    {
      icon: Home,
      title: getFurnishing(),
      subtitle: 'Furnishing',
    },
    {
      icon: Calendar,
      title: formatDate(property.created_at),
      subtitle: 'Posted On',
    },
    {
      icon: Calendar,
      title: getAvailableFrom(),
      subtitle: 'Available From',
    },
  ];

  // PG/Hostel specific info cards
  const pgInfoCards = [
    {
      icon: Users,
      title: getPreferredTenant(),
      subtitle: 'Preferred Tenant',
    },
    {
      icon: Calendar,
      title: formatDate(property.created_at),
      subtitle: 'Posted On',
    },
    {
      icon: Car,
      title: getParking(),
      subtitle: 'Parking',
    },
    {
      icon: Clock,
      title: getPossession(),
      subtitle: 'Possession',
    },
    {
      icon: Utensils,
      title: property.food_included ? 'Available' : 'Not Available',
      subtitle: 'Food Facility',
    },
    {
      icon: Key,
      title: property.gate_closing_time || 'Not Provided',
      subtitle: 'Gate Closing Time',
    },
  ];

  // Use tailored cards per property type
  const infoCards = isPlot
    ? plotInfoCards
    : isPG
      ? pgInfoCards
      : isCommercial
        ? commercialInfoCards
        : defaultInfoCards;
  const filteredCards = infoCards;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 min-w-0">
        {filteredCards.map((card, index) => {
          const isRightCol = index % 2 === 1;
          const rows = Math.ceil(filteredCards.length / 2);
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
              title={`${card.title} ${card.subtitle ? ' - ' + card.subtitle : ''}`}
            >
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-gray-900 text-sm sm:text-base whitespace-normal break-words`}>
                  {card.title}
                </div>
                {card.subtitle ? (
                  <div className={`text-xs sm:text-sm text-gray-500 whitespace-normal break-words`}>
                    {card.subtitle}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};