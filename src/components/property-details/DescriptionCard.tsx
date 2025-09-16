import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const isPGHostel = property?.property_type?.toLowerCase().includes('pg') || 
                    property?.property_type?.toLowerCase().includes('hostel') ||
                    property?.property_type?.toLowerCase().includes('coliving');

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString('en-IN')}${isPGHostel ? '/month' : ''}`;
  };

  const formatArea = (area?: number) => {
    if (!area) return null;
    return `${area} sq.ft`;
  };

  const getPropertyTypeDisplay = () => {
    if (!property?.property_type) return 'Property';
    return property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const generateDescription = () => {
    if (property?.description) {
      return property.description;
    }

    // Generate a comprehensive description based on available property data
    const propertyType = getPropertyTypeDisplay();
    const location = property?.locality && property?.city 
      ? `${property.locality}, ${property.city}` 
      : property?.city || 'prime location';
    
    let description = `This ${property?.bhk_type ? property.bhk_type + ' ' : ''}${propertyType.toLowerCase()} is located in ${location}`;

    if (property?.state) {
      description += `, ${property.state}`;
    }

    description += '. ';

    // Add area information
    if (property?.super_area || property?.carpet_area) {
      const area = formatArea(property?.super_area || property?.carpet_area);
      description += `With a total area of ${area}, `;
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
    } else {
      // Regular property description
      description += 'this property offers';

      if (property?.bathrooms) {
        description += ` ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}`;
      }

      if (property?.balconies) {
        description += ` and ${property.balconies} balcon${property.balconies > 1 ? 'ies' : 'y'}`;
      }

      description += '. ';

      if (property?.current_property_condition) {
        description += `The property is in ${property.current_property_condition} condition. `;
      }

      if (property?.gated_security) {
        description += 'It features gated security for added safety. ';
      }

      if (property?.water_supply) {
        description += `Water supply is ${property.water_supply}. `;
      }
    }

    // Add amenities information
    if (property?.amenities) {
      const amenitiesList = Object.entries(property.amenities)
        .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
        .map(([key, _]) => key.replace(/_/g, ' ').toLowerCase());
      
      if (amenitiesList.length > 0) {
        description += `Key amenities include ${amenitiesList.slice(0, 5).join(', ')}`;
        if (amenitiesList.length > 5) {
          description += ' and more';
        }
        description += '. ';
      }
    }

    // Add services for PG/Hostel
    if (isPGHostel && property?.available_services) {
      const servicesList = Object.entries(property.available_services)
        .filter(([_, value]) => value === true || value === 'yes' || value === 'Yes')
        .map(([key, _]) => key.replace(/_/g, ' ').toLowerCase());
      
      if (servicesList.length > 0) {
        description += `Available services include ${servicesList.slice(0, 5).join(', ')}`;
        if (servicesList.length > 5) {
          description += ' and more';
        }
        description += '. ';
      }
    }

    if (property?.landmark) {
      description += `Landmark: ${property.landmark}. `;
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
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {property.title}
              </h3>
            </div>
          )}

          {/* Key Details Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <p className="text-gray-800">{getPropertyTypeDisplay()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Price:</span>
                <p className="text-gray-800">{formatPrice(isPGHostel ? property?.expected_rent : property?.expected_price)}</p>
              </div>
              {(property?.super_area || property?.carpet_area) && (
                <div>
                  <span className="font-medium text-gray-600">Area:</span>
                  <p className="text-gray-800">{formatArea(property?.super_area || property?.carpet_area)}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <p className="text-gray-800">{property?.locality || property?.city || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-sm">
              {description}
            </p>
          </div>

          {/* Additional Information for PG/Hostel */}
          {isPGHostel && property?.expected_deposit && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Rental Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-600">Monthly Rent:</span>
                  <p className="text-blue-800">{formatPrice(property.expected_rent)}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Security Deposit:</span>
                  <p className="text-blue-800">₹{property.expected_deposit?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

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