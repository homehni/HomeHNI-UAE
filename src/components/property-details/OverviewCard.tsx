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