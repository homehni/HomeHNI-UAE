import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentCountryConfig } from '@/services/domainCountryService';

interface DescriptionCardProps {
  property: {
    title?: string;
    description?: string;
    property_type?: string;
    bhk_type?: string;
    city?: string;
    locality?: string;
    expected_price?: number;
    super_area?: number;
    carpet_area?: number;
    bathrooms?: number;
    balconies?: number;
    listing_type?: string;
    state?: string;
    amenities?: any;
    additional_documents?: Record<string, boolean>;
    current_property_condition?: string;
    water_supply?: string;
    gated_security?: boolean;
    who_will_show?: string;
    // PG/Hostel specific fields
    expected_rent?: number;
    expected_deposit?: number;
    place_available_for?: string;
    preferred_guests?: string;
    available_from?: string;
    food_included?: boolean;
    gate_closing_time?: string;
    available_services?: any;
    parking?: string;
    landmark?: string;
  };
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ property }) => {
  const countryConfig = getCurrentCountryConfig();
  const currencySymbol = countryConfig.currency === 'AED' ? 'AED' : '₹';
  
  const isPGHostel = property?.property_type?.toLowerCase().includes('pg') || 
                    property?.property_type?.toLowerCase().includes('hostel') ||
                    property?.property_type?.toLowerCase().includes('coliving');

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return `${currencySymbol}${price.toLocaleString('en-IN')}${isPGHostel ? '/month' : ''}`;
  };

  const formatArea = (area?: number) => {
    if (!area) return null;
    
    const isPlot = property?.property_type?.toLowerCase().includes('plot') || 
                   property?.property_type?.toLowerCase().includes('land');
    
    if (isPlot && (property as any)?.plot_area_unit) {
      const unitMap: Record<string, string> = {
        'sq-ft': 'sq.ft',
        'sq-yard': 'sq.yard',
        'acre': 'acre',
        'hectare': 'hectare',
        'bigha': 'bigha',
        'biswa': 'biswa',
        'gunta': 'gunta',
        'cents': 'cents',
        'marla': 'marla',
        'kanal': 'kanal'
      };
      const displayUnit = unitMap[(property as any).plot_area_unit] || (property as any).plot_area_unit;
      return `${area} ${displayUnit}`;
    }
    
    return `${area} sq.ft`;
  };

  const getPropertyTypeDisplay = () => {
    if (!property?.property_type) return 'Property';
    return property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const generateDescription = () => {
    if (property?.description) {
      // If there's a custom description, enhance it with amenities and overview
      let description = property.description;
      
      // Add amenities + core features (condition, security, water) together
      const amenitiesList = property?.amenities
        ? Object.entries(property.amenities)
            .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
            .map(([key]) => key.replace(/_/g, ' ').toLowerCase())
        : [];
      const featureList: string[] = [];
      if (property?.current_property_condition) {
        featureList.push(`${property.current_property_condition.toLowerCase()} condition`);
      }
      if (property?.gated_security) {
        featureList.push('gated security');
      }
      if (property?.water_supply) {
        featureList.push(`${String(property.water_supply).toLowerCase()} water supply`);
      }
      const combinedList = [...amenitiesList, ...featureList];
      if (combinedList.length > 0) {
        description += ` Key amenities include ${combinedList.join(', ')}.`;
      }
      // Add services for PG/Hostel
      if (isPGHostel && property?.available_services) {
        const servicesList = Object.entries(property.available_services)
          .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
          .map(([key, _]) => key.replace(/_/g, ' ').toLowerCase());
        
        if (servicesList.length > 0) {
          description += ` Available services include ${servicesList.join(', ')}.`;
        }
      }

      return description;
    }

    // Generate a comprehensive description based on available property data
    const propertyType = getPropertyTypeDisplay();
    
    // Filter out 'Unknown' values for location
    const validLocality = property?.locality && property.locality !== 'Unknown' ? property.locality : null;
    const validCity = property?.city && property.city !== 'Unknown' ? property.city : null;
    const validState = property?.state && property.state !== 'Unknown' ? property.state : null;
    
    const location = validLocality && validCity 
      ? `${validLocality}, ${validCity}` 
      : validCity || validLocality || 'a prime location';
    
    let description = `This ${property?.bhk_type ? property.bhk_type + ' ' : ''}${propertyType.toLowerCase()} is located in ${location}`;

    if (validState) {
      description += `, ${validState}`;
    }

    description += '. ';

    // Add price information
    const price = isPGHostel ? property?.expected_rent : property?.expected_price;
    if (price) {
      description += `Priced at ${formatPrice(price)}, `;
    }

    // Add area information
    if (property?.super_area || property?.carpet_area) {
      const area = formatArea(property?.super_area || property?.carpet_area);
      description += `with a total area of ${area}, `;
    }

    if (isPGHostel) {
      // PG/Hostel specific description
      description += `this ${propertyType.toLowerCase()} offers comfortable accommodation`;
      
      if (property?.place_available_for) {
        description += ` for ${property.place_available_for}`;
      }
      
      if (property?.preferred_guests) {
        description += ` with preference for ${property.preferred_guests}`;
      }

      description += '. ';

      if (property?.food_included) {
        description += 'Food is included in the rent. ';
      }

      if (property?.gate_closing_time) {
        description += `Gate closing time is ${property.gate_closing_time}. `;
      }

      if (property?.available_from) {
        description += `Available from ${property.available_from}. `;
      }

      // Add security deposit information
      if (property?.expected_deposit) {
        description += `Security deposit is ${currencySymbol}${property.expected_deposit.toLocaleString('en-IN')}. `;
      }
    } else {
      // Regular property description with overview details
      description += 'this property offers';

      if (property?.bathrooms) {
        description += ` ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}`;
      }

      if (property?.balconies) {
        description += ` and ${property.balconies} balcon${property.balconies > 1 ? 'ies' : 'y'}`;
      }

      description += '. ';

      // Core features (condition, security, water) are merged into the amenities sentence below.
    }

    // Add comprehensive amenities information (including core features)
    {
      const amenitiesList = property?.amenities
        ? Object.entries(property.amenities)
            .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
            .map(([key]) => key.replace(/_/g, ' ').toLowerCase())
        : [];
      const featureList: string[] = [];
      if (property?.current_property_condition) {
        featureList.push(`${property.current_property_condition.toLowerCase()} condition`);
      }
      if (property?.gated_security) {
        featureList.push('gated security');
      }
      if (property?.water_supply) {
        featureList.push(`${String(property.water_supply).toLowerCase()} water supply`);
      }
      const combinedAmenities = [...amenitiesList, ...featureList];
      if (combinedAmenities.length > 0) {
        description += `The property comes with excellent amenities including ${combinedAmenities.join(', ')}. `;
      }
    }

    // Add services for PG/Hostel
    if (isPGHostel && property?.available_services) {
      const servicesList = Object.entries(property.available_services)
        .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
        .map(([key, _]) => key.replace(/_/g, ' ').toLowerCase());
      
      if (servicesList.length > 0) {
        description += `Available services include ${servicesList.join(', ')}. `;
      }
    }

    if (property?.landmark) {
      description += `Landmark: ${property.landmark}. `;
    }

    if (property?.parking) {
      description += `Parking: ${property.parking}. `;
    }

    description += `This ${propertyType.toLowerCase()} is perfect for those seeking comfort, convenience, and excellent connectivity in ${location}.`;

    return description;
  };

  const description = generateDescription();

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Property Title */}
          {property?.title && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {property.title}
              </h3>
            </div>
          )}

          {/* Full Description with integrated overview and amenities */}
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-2">
              {description.split('. ').map((sentence, index, array) => (
                <p key={index} className="mb-2">
                  {sentence}{index < array.length - 1 ? '.' : ''}
                </p>
              ))}
            </div>
          </div>

          {/* Documents Available */}
          {property?.additional_documents && Object.keys(property.additional_documents).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">Available Documents</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(property.additional_documents)
                  .filter(([_, available]) => available)
                  .map(([doc, _]) => (
                    <span key={doc} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};