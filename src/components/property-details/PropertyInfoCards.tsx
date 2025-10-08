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
    listing_type?: string;
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
    // Property submission data
    payload?: {
      plot_length?: number;
      plotLength?: number;
      plot_width?: number;
      plotWidth?: number;
      boundary_wall?: string;
      boundaryWall?: string;
      road_width?: number;
      roadWidth?: number;
      ownership_type?: string;
      ownershipType?: string;
      [key: string]: any;
    };
  };
}

export const PropertyInfoCards: React.FC<PropertyInfoCardsProps> = ({ property }) => {
  // Debug: Log property data for Land/Plot properties
  const isLandPlot = property.property_type?.toLowerCase().includes('land') || 
                     property.property_type?.toLowerCase().includes('plot');
  
  const isSale = property.listing_type?.toLowerCase() === 'sale';
  
  if (isLandPlot) {
    // Enhanced debugging to find plot dimensions and boundary wall data
    console.log('🔍 PropertyInfoCards - Land/Plot property data:', {
      property_type: property.property_type,
      plot_length: property.plot_length,
      plot_width: property.plot_width,
      road_width: property.road_width,
      boundary_wall: property.boundary_wall,
      ownership_type: property.ownership_type,
      plot_area_unit: property.plot_area_unit,
      // Check if data is in the property.payload
      payload_plot_length: property.payload?.plot_length,
      payload_plot_width: property.payload?.plot_width,
      payload_boundary_wall: property.payload?.boundary_wall,
      // Check if data is in originalFormData if it exists
      originalFormData: property.payload?.originalFormData,
      plotDetails: property.payload?.originalFormData?.propertyInfo?.plotDetails,
      
      // Check specifically for plotLength and plotWidth in the nested structure
      plotLength: property.payload?.originalFormData?.propertyInfo?.plotDetails?.plotLength,
      plotWidth: property.payload?.originalFormData?.propertyInfo?.plotDetails?.plotWidth,
      roadWidth: property.payload?.originalFormData?.propertyInfo?.plotDetails?.roadWidth,
      
      // Check in amenities 
      amenitiesRoadWidth: property.payload?.originalFormData?.propertyInfo?.amenities?.roadWidth,
      
      // Check if the data exists directly in propertyInfo
      propInfoPlotLength: property.payload?.originalFormData?.propertyInfo?.plotLength,
      propInfoPlotWidth: property.payload?.originalFormData?.propertyInfo?.plotWidth,
      propInfoRoadWidth: property.payload?.originalFormData?.propertyInfo?.roadWidth,
      
      // Check all top-level keys
      allKeys: Object.keys(property),
      
      // For better debugging, check entire property object as string
      propertyStr: JSON.stringify(property).substring(0, 500) + '...',
      
      // Check if data might be in subData
      subData: (property as any).subData,
      
      // Check all top-level values for specific fields
      hasPlotData: Object.entries(property)
        .filter(([key, value]) => 
          key.includes('plot') || 
          key.includes('boundary') || 
          key.includes('dimension') ||
          key.includes('length') || 
          key.includes('width'))
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
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
    // Access property type from all possible paths
    const propertyTypeDebug = {
      direct: property.property_type,
      payload: property.payload?.property_type,
      originalFormData: property.payload?.originalFormData,
      propertyInfo: property.payload?.originalFormData?.propertyInfo
    };
    
    console.log('Property debug data:', propertyTypeDebug);
    
    // Try to get the property type from various locations
    let type = property.property_type;
    
    // If not found in direct property, check payload
    if (!type && property.payload) {
      type = property.payload.property_type;
      
      // Check nested in originalFormData if exists
      if (!type && property.payload.originalFormData?.propertyInfo) {
        const propInfo = property.payload.originalFormData.propertyInfo;
        
        // Check both propertyType and commercialType which might be used
        if (typeof propInfo === 'object' && propInfo !== null) {
          type = (propInfo as Record<string, any>).propertyType || 
                 (propInfo as Record<string, any>).commercialType;
        }
      }
    }
    
    console.log('Final property type value:', {type});
    
    if (!type) return 'Apartment';
    return type.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
    // Extract from any path where it might exist
    const possiblePaths = {
      // Direct property fields
      directL: property.plot_length,
      directW: property.plot_width,
      
      // Alternative direct fields
      altL: property.length,
      altW: property.width,
      
      // Fields in payload
      payloadL: property.payload?.plot_length,
      payloadW: property.payload?.plot_width,
      
      // Alternative fields in payload
      altPayloadL: property.payload?.plotLength,
      altPayloadW: property.payload?.plotWidth,
      
      // Deeply nested in originalFormData
      nestedL: property.payload?.originalFormData?.propertyInfo?.plotDetails?.plotLength,
      nestedW: property.payload?.originalFormData?.propertyInfo?.plotDetails?.plotWidth,
      
      // Direct in propertyInfo
      propInfoL: property.payload?.originalFormData?.propertyInfo?.plotLength,
      propInfoW: property.payload?.originalFormData?.propertyInfo?.plotWidth,
    };
    
    console.log('Dimensions debug paths:', possiblePaths);
    
    // Try all possible locations
    const L = possiblePaths.directL ?? 
              possiblePaths.altL ?? 
              possiblePaths.payloadL ?? 
              possiblePaths.altPayloadL ?? 
              possiblePaths.nestedL ?? 
              possiblePaths.propInfoL;
              
    const W = possiblePaths.directW ?? 
              possiblePaths.altW ?? 
              possiblePaths.payloadW ?? 
              possiblePaths.altPayloadW ?? 
              possiblePaths.nestedW ?? 
              possiblePaths.propInfoW;
    
    console.log('Final dimensions:', {L, W});
    
    if (!L || !W) return 'Not specified';
    // Always show linear dimensions in feet regardless of area unit
    return `${L} x ${W} ft.`;
  };

  const formatOwnership = () => {
    const raw = property.ownership_type || property.owner_role || 
               (property.payload?.ownership_type) || 
               (property.payload?.ownershipType);
    if (!raw) return 'Not specified';
    return String(raw).replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const formatRoadWidth = () => {
    // Create a structured object of all possible paths
    const possiblePaths = {
      // Direct properties
      directRW: property.road_width,
      directAltRW: property.roadWidth,
      
      // In payload
      payloadRW: property.payload?.road_width,
      payloadAltRW: property.payload?.roadWidth,
      
      // Nested in originalFormData.propertyInfo
      plotDetailsRW: property.payload?.originalFormData?.propertyInfo?.plotDetails?.roadWidth,
      amenitiesRW: property.payload?.originalFormData?.propertyInfo?.amenities?.roadWidth,
      
      // Direct in propertyInfo
      propInfoRW: property.payload?.originalFormData?.propertyInfo?.roadWidth,
    };
    
    console.log('Road width debug paths:', possiblePaths);
    
    // Try all possible locations
    const rw = possiblePaths.directRW ?? 
               possiblePaths.directAltRW ?? 
               possiblePaths.payloadRW ?? 
               possiblePaths.payloadAltRW ?? 
               possiblePaths.plotDetailsRW ?? 
               possiblePaths.amenitiesRW ?? 
               possiblePaths.propInfoRW;
    
    console.log('Final road width:', {rw});
    
    if (!rw && rw !== 0) return 'Not specified';
    return `${rw} ft.`;
  };

  const formatBoundaryWall = () => {
    // Create a structured object of all possible paths
    const possiblePaths = {
      // Direct properties
      directBW: property.boundary_wall,
      directAltBW: property.boundaryWall,
      
      // In payload
      payloadBW: property.payload?.boundary_wall,
      payloadAltBW: property.payload?.boundaryWall,
      
      // Nested in originalFormData.propertyInfo
      plotDetailsBW: property.payload?.originalFormData?.propertyInfo?.plotDetails?.boundaryWall,
      amenitiesBW: property.payload?.originalFormData?.propertyInfo?.amenities?.boundaryWall,
      
      // Direct in propertyInfo
      propInfoBW: property.payload?.originalFormData?.propertyInfo?.boundaryWall,
    };
    
    console.log('Boundary wall debug paths:', possiblePaths);
    
    // Try all possible locations
    const v = possiblePaths.directBW ?? 
              possiblePaths.directAltBW ?? 
              possiblePaths.payloadBW ?? 
              possiblePaths.payloadAltBW ?? 
              possiblePaths.plotDetailsBW ?? 
              possiblePaths.amenitiesBW ?? 
              possiblePaths.propInfoBW;
    
    console.log('Final boundary wall value:', {v});
    
    if (v === undefined || v === null || v === '') return 'Not specified';
    const s = String(v).toLowerCase().trim();
    if (['yes', 'y', 'present', 'available', 'have', 'true', '1'].includes(s)) return 'Yes';
    if (['no', 'n', 'absent', 'not available', 'none', 'false', '0'].includes(s)) return 'No';
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
    // Hide Preferred Tenant for Sale listings
    ...(!isSale ? [{
      icon: Users,
      title: getPreferredTenant(),
      subtitle: 'Preferred Tenant',
    }] : []),
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

  // Get formatted values with logging
  const dimensionsValue = formatDimensions();
  const ownershipValue = formatOwnership();
  const roadWidthValue = formatRoadWidth();
  const boundaryWallValue = formatBoundaryWall();
  
  // Log the final values for debugging
  if (isLandPlot) {
    console.log('PropertyInfoCards - Final formatted values:', {
      dimensions: dimensionsValue,
      ownership: ownershipValue, 
      roadWidth: roadWidthValue,
      boundaryWall: boundaryWallValue
    });
  }
  
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
      title: dimensionsValue,
      subtitle: 'Dimension (L x B)',
    },
    {
      icon: Shield,
      title: ownershipValue,
      subtitle: 'Ownership',
    },
    {
      icon: MapPin,
      title: roadWidthValue,
      subtitle: 'Width of facing road',
    },
    {
      icon: Home,
      title: boundaryWallValue,
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