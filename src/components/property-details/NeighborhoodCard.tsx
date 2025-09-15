import React from 'react';

interface NeighborhoodCardProps {
  property: {
    locality: string;
    city: string;
  };
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ property }) => {
  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Neighborhood</h2>
      </div>
      
      <div className="p-5 pt-4">
        {/* Location Display */}
        <div className="rounded-xl ring-1 ring-gray-200 bg-gray-50 p-6 text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">
            {property.locality}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {property.city}
          </div>
          <p className="text-sm text-gray-500">
            Interactive map integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
};