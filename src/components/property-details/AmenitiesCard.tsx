import React from 'react';

interface AmenitiesCardProps {
  amenities?: string[];
}

export const AmenitiesCard: React.FC<AmenitiesCardProps> = ({ amenities }) => {
  const defaultAmenities = [
    'Lift', 
    'Internet provider', 
    'Security', 
    'Park', 
    'Sewage treatment', 
    'Visitor parking'
  ];
  
  const displayAmenities = amenities || defaultAmenities;

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
      </div>
      
      <div className="p-5 pt-4">
        <div className="flex flex-wrap gap-2">
          {displayAmenities.map((amenity, index) => (
            <div
              key={index}
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm text-gray-700 ring-1 ring-gray-200"
            >
              {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};