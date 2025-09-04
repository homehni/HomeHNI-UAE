import React from 'react';
import { Building2 } from 'lucide-react';

interface PropertyDetailsCardProps {
  property: {
    property_type: string;
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
    // NEW: Additional fields now stored in database
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
    return area ? `${area.toLocaleString()} sqft` : 'Not specified';
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
    { label: 'Type', value: property.property_type?.replace('_', ' ') || 'PG Hostel' },
    { label: 'Room Type', value: property.bhk_type || 'Not specified' },
    { label: 'Available For', value: property.floor_type || 'Not specified' },
    { label: 'Preferred Guests', value: property.facing_direction || 'Not specified' },
    { label: 'Food Included', value: property.furnishing === 'fully_furnished' ? 'Yes' : 'No' },
    { label: 'Gate Closing Time', value: property.registration_status || 'Not specified' },
  ] : [
    { label: 'Type', value: property.property_type?.replace('_', ' ') || 'Not specified' },
    { label: 'BHK', value: property.bhk_type || 'Not specified' },
    { label: 'Bathrooms', value: property.bathrooms?.toString() || 'Not specified' },
    { label: 'Balconies', value: property.balconies?.toString() || 'Not specified' },
    { label: 'Ownership', value: formatOwnership(property.owner_role) },
    { label: 'Maintenance', value: formatMaintenance(property.maintenance_charges) },
    { label: 'Built-up Area', value: formatArea(property.super_area, property.carpet_area) },
    { label: 'Floor', value: formatFloor(property.floor_no, property.total_floors) },
    { label: 'Furnishing', value: property.furnishing || 'Not specified' },
    { label: 'Property Age', value: property.property_age || 'Not specified' },
    { label: 'Facing', value: property.facing_direction || 'Not specified' },
    { label: 'Floor Type', value: property.floor_type || 'Not specified' },
    { label: 'Registration', value: property.registration_status || 'Not specified' },
    { label: 'Water Supply', value: property.water_supply || 'Not specified' },
    { label: 'Power Backup', value: property.power_backup || 'Not specified' },
    { label: 'Gated Security', value: property.gated_security ? 'Yes' : 'No' },
    { label: 'Property Condition', value: property.current_property_condition || 'Not specified' },
    { label: 'Who Shows Property', value: property.who_will_show || 'Not specified' },
    { label: 'Home Loan Available', value: property.home_loan_available ? 'Yes' : 'No' },
  ];

  const filteredDetails = details.filter(item => item.value !== 'Not specified');

  const quickFacts = isPlotProperty ? [
    formatArea(property.super_area, property.carpet_area),
    property.gated_security ? 'Gated' : 'Open',
    property.registration_status || 'Registration status'
  ].filter(fact => fact && fact !== 'Not specified') : isPGHostelProperty ? [
    property.bhk_type === 'multiple' ? 'Multiple Rooms' : property.bhk_type
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

      </div>
    </div>
  );
};