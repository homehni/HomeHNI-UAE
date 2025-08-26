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
  };
}

export const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property }) => {
  const details = [
    { label: 'Type', value: property.property_type.replace('_', ' ') },
    { label: 'Bathrooms', value: property.bathrooms?.toString() || 'N/A' },
    { label: 'Ownership', value: 'Self Owned' },
    { label: 'Maintenance', value: '₹ 2.8 / Sq.Ft/M' },
    { label: 'Flooring', value: 'Vitrified Tiles' },
    { label: 'Built-up Area', value: `${property.super_area || property.carpet_area || 'N/A'} sqft` },
    { label: 'Facing', value: 'West' },
    { label: 'Parking', value: 'Bike and Car' },
  ].filter(item => item.value !== 'N/A');

  const quickFacts = [
    property.bhk_type,
    `${property.super_area || property.carpet_area || 0} sqft`,
    'Semi-Furnished'
  ].filter(Boolean);

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