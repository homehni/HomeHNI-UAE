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
        <div className="rounded-xl ring-1 ring-gray-200 overflow-hidden h-64 md:h-80 mb-4 relative">
          <iframe
            title="map"
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=77.5%2C12.9%2C77.6%2C13.0&layer=mapnik&marker=12.95%2C77.55`}
            style={{ border: 'none' }}
          />
          
          {/* Location Info Overlay */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
            <h3 className="font-semibold text-gray-900 mb-1">
              {property.locality}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {property.city}
            </p>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v13l-6 3-6-3z" />
                </svg>
                Directions
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View larger map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};