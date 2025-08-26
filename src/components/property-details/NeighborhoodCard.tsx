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
        {/* Map Container */}
        <div className="rounded-xl ring-1 ring-gray-200 overflow-hidden h-64 md:h-80 mb-4">
          <iframe
            title="map"
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.locality}, ${property.city}`)}&output=embed`}
          />
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Transit</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Bus Stations nearby</li>
              <li>Metro access</li>
              <li>Taxi services</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Essentials</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Schools & Hospitals</li>
              <li>ATMs & Banks</li>
              <li>Parks & Markets</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Utilities</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>24x7 Water supply</li>
              <li>Power backup</li>
              <li>Internet connectivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};