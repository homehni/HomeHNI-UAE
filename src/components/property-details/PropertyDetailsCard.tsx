import React from 'react';
import { Building2 } from 'lucide-react';

interface PropertyDetailsCardProps {
  property: {
    property_type: string;
    // Regular property fields
    bhk_type?: string;
    super_area?: number;
    carpet_area?: number;
    bathrooms?: number;
    balconies?: number;
    floor_no?: number;
    total_floors?: number;
    furnishing?: string;
    maintenance_charges?: number;
    owner_role?: string;
    listing_type?: string;
    state?: string;
    city?: string;
    locality?: string;
    description?: string;
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
    amenities?: {
      gym?: boolean;
      clubHouse?: boolean;
      swimmingPool?: boolean;
      lift?: boolean;
      intercom?: boolean;
      sewageTreatmentPlant?: boolean;
      fireSafety?: boolean;
      shoppingCenter?: boolean;
      childrenPlayArea?: boolean;
      visitorParking?: boolean;
      gasPipeline?: boolean;
      park?: boolean;
      internetProvider?: boolean;
    };
    additional_documents?: {
      allotmentLetter?: boolean;
      saleDeedCertificate?: boolean;
      propertyTaxPaid?: boolean;
      occupancyCertificate?: boolean;
    };
    
    // PG/Hostel specific fields
    expected_rent?: number;
    expected_deposit?: number;
    expected_price?: number;
    security_deposit?: number;
    landmark?: string;
    place_available_for?: string;
    preferred_guests?: string;
    available_from?: string;
    food_included?: boolean;
    gate_closing_time?: string;
    available_services?: {
      laundry?: boolean;
      room_cleaning?: boolean;
      warden_facility?: boolean;
    };
    parking?: string;
    plot_area_unit?: string;
  };
}

export const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property }) => {
  const formatMaintenance = (charges?: number) => {
    if (!charges) return 'Not specified';
    return `₹${charges.toLocaleString()}/month`;
  };

  const formatOwnership = (role?: string) => {
    if (!role) return 'Not specified';
    return role === 'Owner' ? 'Self Owned' : role;
  };

  const formatArea = (superArea?: number, carpetArea?: number) => {
    const area = superArea || carpetArea;
    if (!area) return 'Not specified';
    
    const isPlot = property.property_type?.toLowerCase().includes('plot') || 
                   property.property_type?.toLowerCase().includes('land');
    
    console.log('PropertyDetailsCard formatArea:', {
      area,
      propertyType: property.property_type,
      plotAreaUnit: (property as any).plot_area_unit,
      isPlot
    });
    
    if (isPlot && (property as any).plot_area_unit) {
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
      const displayUnit = unitMap[(property as any).plot_area_unit] || (property as any).plot_area_unit;
      console.log('PropertyDetailsCard: Using plot unit:', displayUnit);
      return `${area.toLocaleString()} ${displayUnit}`;
    }
    
    console.log('PropertyDetailsCard: Using default Sq.Ft');
    return `${area.toLocaleString()} Sq.Ft`;
  };

  const formatFloor = (floorNo?: number, totalFloors?: number) => {
    if (floorNo !== undefined && totalFloors) {
      return `${floorNo}/${totalFloors}`;
    }
    return 'Not specified';
  };

  // Check property types
  const isPlotProperty = property.property_type?.toLowerCase().includes('plot') || 
                        property.property_type?.toLowerCase().includes('land');
  const isPGHostelProperty = property.property_type?.toLowerCase() === 'pg_hostel' ||
                            property.property_type?.toLowerCase() === 'pg/hostel';

  // Helper functions for PG/Hostel properties
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  const formatLocation = (state?: string, city?: string, locality?: string, landmark?: string) => {
    const parts = [locality].filter(Boolean);
    let location = parts.join(', ') || 'Not specified';
    if (landmark) {
      const landmarkText = landmark.toLowerCase().startsWith('near') ? 
        landmark : 
        `Near ${landmark}`;
      location += ` (${landmarkText})`;
    }
    return location;
  };

  // Different details for different property types
  const details = isPlotProperty ? [
    { label: 'Type', value: property.property_type?.replace('_', ' ') || 'Not specified' },
    { label: 'Plot Area', value: formatArea(property.super_area, property.carpet_area) },
    { label: 'Ownership', value: formatOwnership(property.owner_role) },
    { label: 'Gated Security', value: property.gated_security ? 'Yes' : 'No' },
    { label: 'Water Connection', value: property.water_supply || 'Not specified' },
    { label: 'Electricity', value: property.power_backup || 'Available' },
    { label: 'Registration', value: property.registration_status || 'Not specified' },
    { label: 'Property Condition', value: property.current_property_condition || 'Not specified' },
    { label: 'Who Shows Property', value: property.who_will_show || 'Not specified' },
    { label: 'Home Loan Available', value: property.home_loan_available ? 'Yes' : 'No' },
  ] : isPGHostelProperty ? [
    { label: 'Property Type', value: 'PG/Hostel' },
    { label: 'Expected Rent', value: formatCurrency(property.expected_rent || property.expected_price) },
    { label: 'Expected Deposit', value: formatCurrency(property.expected_deposit || property.security_deposit) },
    { label: 'Location', value: formatLocation(undefined, undefined, property.locality, property.landmark) },
    { label: 'Available For', value: property.place_available_for || 'Not specified' },
    { label: 'Preferred Guests', value: property.preferred_guests || 'Not specified' },
    { label: 'Available From', value: formatDate(property.available_from) },
    { label: 'Food Included', value: property.food_included ? 'Yes' : 'No' },
    { label: 'Gate Closing Time', value: property.gate_closing_time || 'Not specified' },
  ] : [
    // Basic property specifications only
    { label: 'Type', value: property.property_type?.replace('_', ' ') || 'Not specified' },
    { label: 'BHK', value: property.bhk_type || 'Not specified' },
    { label: 'Bathrooms', value: property.bathrooms?.toString() || 'Not specified' },
    { label: 'Balconies', value: property.balconies?.toString() || 'Not specified' },
    { label: 'Built-up Area', value: formatArea(property.super_area, property.carpet_area) },
    { label: 'Floor', value: formatFloor(property.floor_no, property.total_floors) },
    { label: 'Furnishing', value: property.furnishing || 'Not specified' },
    { label: 'Property Age', value: property.property_age || 'Not specified' },
    { label: 'Facing', value: property.facing_direction || 'Not specified' },
    { label: 'Floor Type', value: property.floor_type || 'Not specified' },
    { label: 'Water Supply', value: property.water_supply || 'Not specified' },
    { label: 'Gated Security', value: property.gated_security ? 'Yes' : 'No' },
    { label: 'Who Shows Property', value: property.who_will_show || 'Not specified' },
    { label: 'Secondary Contact', value: property.secondary_phone || 'Not specified' },
    { label: 'Property Condition', value: property.current_property_condition || 'Not specified' },
    { label: 'Gym', value: property.amenities?.gym ? 'Yes' : 'No' },
    { label: 'Pet Allowed', value: (property as any).amenities?.petAllowed ? 'Yes' : 'No' },
    { label: 'Non-Veg Allowed', value: (property as any).amenities?.nonVegAllowed ? 'Yes' : 'No' },
  ];

  const filteredDetails = details.filter(item => item.value !== 'Not specified');

  const quickFacts = isPlotProperty ? [
    formatArea(property.super_area, property.carpet_area),
    property.gated_security ? 'Gated' : 'Open',
    property.registration_status || 'Registration status'
  ].filter(fact => fact && fact !== 'Not specified') : isPGHostelProperty ? [
    formatCurrency(property.expected_rent),
    property.place_available_for,
    property.food_included ? 'Food Included' : 'Food Not Included'
  ].filter(fact => fact && fact !== 'Not specified') : [
    property.bhk_type,
    formatArea(property.super_area, property.carpet_area),
    property.furnishing || 'Not specified'
  ].filter(fact => fact && fact !== 'Not specified');

  // Normalize additional_documents values and prepare labels
  const isTruthy = (v: any) =>
    v === true ||
    v === 1 ||
    v === '1' ||
    (typeof v === 'string' && ['yes', 'true', 'y'].includes(v.toLowerCase()));

  const docLabelMap: Record<string, string> = {
    allotmentLetter: 'Allotment Letter',
    saleDeedCertificate: 'Sale Deed Certificate',
    propertyTaxPaid: 'Property Tax Paid',
    occupancyCertificate: 'Occupancy Certificate',
  };

  const documentEntries = property.additional_documents
    ? Object.entries(property.additional_documents).filter(([_, val]) => isTruthy(val as any))
    : [];

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-[#d21404]" />
          Property Details
        </h2>
        <div className="flex flex-wrap gap-2">
          {quickFacts.map((fact, index) => (
            <div
              key={index}
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm text-gray-700 ring-1 ring-gray-200"
            >
              {fact}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-5 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredDetails.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-50/70 p-3 rounded-lg ring-1 ring-gray-100"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                {detail.label}
              </div>
              <div className="text-sm font-medium text-gray-800 capitalize">
                {detail.value}
              </div>
            </div>
          ))}
        </div>
        
        {/* Documents Section */}
        {documentEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Available Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {documentEntries.map(([key]) => (
                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{docLabelMap[key] ?? key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities & Services Section for PG/Hostel */}
        {isPGHostelProperty && (property.available_services || property.amenities) && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Amenities & Available Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Available Services */}
              {isTruthy((property as any).available_services?.laundry) && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Laundry</span>
                </div>
              )}
              {isTruthy((property as any).available_services?.room_cleaning) && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Room Cleaning</span>
                </div>
              )}
              {isTruthy((property as any).available_services?.warden_facility) && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Warden Facility</span>
                </div>
              )}
              
              {/* Amenities - Check if it's an array of strings or object */}
              {Array.isArray(property.amenities) && property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{amenity}</span>
                </div>
              ))}
              
              {/* Handle amenities as object (original structure) */}
              {!Array.isArray(property.amenities) && property.amenities && Object.entries(property.amenities).map(([key, value]) => {
                if (!isTruthy(value as any)) return null;
                
                // Map specific keys to display names for PG/Hostel
                const amenityDisplayNames: Record<string, string> = {
                  gym: 'Common TV',
                  clubHouse: 'Mess',
                  lift: 'Lift',
                  intercom: 'Refrigerator',
                  internetProvider: 'WiFi',
                  gasPipeline: 'Cooking Allowed',
                  sewageTreatmentPlant: 'Power Backup',
                };
                
                return (
                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{amenityDisplayNames[key] || key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                );
              })}
              
              {/* Parking */}
              {property.parking && property.parking !== 'none' && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Parking: {property.parking}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};