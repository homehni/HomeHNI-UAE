import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface NeighborhoodCardProps {
  property: {
    locality: string;
    city: string;
  };
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ property }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    // Geocode the location (simple approach using a geocoding service)
    const initializeMap = async () => {
      try {
        // For demo, we'll center on a default location
        // In production, you'd geocode the property.locality
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [77.5946, 12.9716], // Bangalore coordinates as default
          zoom: 12,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );

        // Add a marker for the property location
        new mapboxgl.Marker()
          .setLngLat([77.5946, 12.9716])
          .addTo(map.current);

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = (e.target as any).token.value.trim();
    if (token) {
      setMapboxToken(token);
      setShowTokenInput(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-red-500 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Neighborhood</h2>
      </div>
      
      <div className="p-5 pt-4">
        {showTokenInput ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Enter Mapbox Token to View Map
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              Get your free token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                mapbox.com
              </a>
            </p>
            <form onSubmit={handleTokenSubmit} className="flex gap-2">
              <input
                name="token"
                type="text"
                placeholder="pk.eyJ1..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Load Map
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-xl ring-1 ring-gray-200 overflow-hidden h-64 md:h-80 mb-4">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
        )}
        
        <div className="bg-gray-50/70 p-3 rounded-lg ring-1 ring-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            Location
          </div>
          <div className="text-sm font-medium text-gray-800">
            {property.locality}, {property.city}
          </div>
        </div>
      </div>
    </div>
  );
};