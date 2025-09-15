import React from 'react';

interface NeighborhoodCardProps {
  property: {
    locality: string;
    city: string;
  };
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ property }) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Neighborhood</h2>
      </div>
      
      <div className="p-5 pt-4">
        {/* Map Container */}
        <div className="rounded-xl ring-1 ring-gray-200 overflow-hidden h-64 md:h-80 mb-4 relative">
          <iframe
            title={`Google Map of ${property.locality}, ${property.city}`}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.locality + ', ' + property.city)}&z=15&output=embed`}
          />
        </div>
      </div>
    </div>
  );
};