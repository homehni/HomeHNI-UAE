import React from 'react';

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

  const overviewItems = [
    { label: 'Property Type', value: property.property_type?.replace('_', ' ') || 'Not specified' },
    { label: 'BHK Type', value: property.bhk_type || 'Not specified' },
    { label: 'Ownership Type', value: formatOwnership(property.owner_role) },
    { label: 'Maintenance', value: formatMaintenance(property.maintenance_charges) },
    { label: 'Built-up Area', value: formatArea(property.super_area, property.carpet_area) },
    { label: 'Furnishing', value: property.furnishing || 'Not specified' },
    { label: 'Floor', value: formatFloor(property.floor_no, property.total_floors) },
    { label: 'Bathrooms', value: property.bathrooms?.toString() || 'Not specified' },
    { label: 'Balconies', value: property.balconies?.toString() || 'Not specified' },
    { label: 'Availability', value: property.availability_type || 'Not specified' },
    // NEW: Enhanced property overview details
    { label: 'Property Age', value: property.property_age || 'Not specified' },
    { label: 'Facing Direction', value: property.facing_direction || 'Not specified' },
    { label: 'Floor Type', value: property.floor_type || 'Not specified' },
    { label: 'Registration Status', value: property.registration_status || 'Not specified' },
    { label: 'Expected Price', value: formatPrice(property.expected_price) },
    { label: 'Price Negotiable', value: property.price_negotiable ? 'Yes' : 'No' },
    { label: 'Security Deposit', value: formatPrice(property.security_deposit) },
    { label: 'Booking Amount', value: formatBookingAmount(property.booking_amount) },
    { label: 'Home Loan Available', value: property.home_loan_available ? 'Yes' : 'No' },
    { label: 'Water Supply', value: property.water_supply || 'Not specified' },
    { label: 'Power Backup', value: property.power_backup || 'Not specified' },
    { label: 'Gated Security', value: property.gated_security ? 'Yes' : 'No' },
    { label: 'Property Condition', value: property.current_property_condition || 'Not specified' },
    { label: 'Who Shows Property', value: property.who_will_show || 'Not specified' },
    { label: 'Secondary Contact', value: property.secondary_phone || 'Not specified' },
  ].filter(item => item.value !== 'Not specified');

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
      </div>
      
      <div className="p-5 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {overviewItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50/70 p-3 rounded-lg ring-1 ring-gray-100"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                {item.label}
              </div>
              <div className="text-sm font-medium text-gray-800">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};