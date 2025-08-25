import React from 'react';

interface OverviewCardProps {
  property: {
    super_area?: number;
    carpet_area?: number;
  };
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ property }) => {
  const overviewItems = [
    { label: 'Age of Building', value: '10+ years' },
    { label: 'Ownership Type', value: 'Self Owned' },
    { label: 'Maintenance', value: '₹ 2.8 / Sq.Ft/M' },
    { label: 'Flooring', value: 'Vitrified Tiles' },
    { label: 'Built-up Area', value: `${property.super_area || property.carpet_area || 960} Sq.Ft` },
    { label: 'Furnishing', value: 'Semi' },
    { label: 'Facing', value: 'West' },
    { label: 'Floor', value: '0/3' },
    { label: 'Parking', value: 'Bike and Car' },
    { label: 'Gated Security', value: 'Yes' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
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