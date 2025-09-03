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

  const details = [
    { label: 'Type', value: property.property_type?.replace('_', ' ') || 'Not specified' },
    { label: 'Bathrooms', value: property.bathrooms?.toString() || 'Not specified' },
    { label: 'Balconies', value: property.balconies?.toString() || 'Not specified' },
    { label: 'Ownership', value: formatOwnership(property.owner_role) },
    { label: 'Maintenance', value: formatMaintenance(property.maintenance_charges) },
    { label: 'Built-up Area', value: formatArea(property.super_area, property.carpet_area) },
    { label: 'Floor', value: formatFloor(property.floor_no, property.total_floors) },
    { label: 'Furnishing', value: property.furnishing || 'Not specified' },
  ].filter(item => item.value !== 'Not specified');

  const quickFacts = [
    property.bhk_type,
    formatArea(property.super_area, property.carpet_area),
    property.furnishing || 'Not specified'
  ].filter(fact => fact && fact !== 'Not specified');

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
          {details.map((detail, index) => (
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
      </div>
    </div>
  );
};