import React from 'react';

interface AmenitiesCardProps {
  amenities?: any; // Can be string[] or JSONB object from database
}

export const AmenitiesCard: React.FC<AmenitiesCardProps> = ({ amenities }) => {
  // Mapping from database keys to display names
  const amenityKeyMap: Record<string, string> = {
    lift: 'Lift',
    internetProvider: 'Internet Provider',
    security: 'Security',
    park: 'Park',
    sewageTreatmentPlant: 'Sewage Treatment',
    visitorParking: 'Visitor Parking',
    gym: 'Gym',
    swimmingPool: 'Swimming Pool',
    clubHouse: 'Club House',
    fireSafety: 'Fire Safety',
    gasPipeline: 'Gas Pipeline',
    intercom: 'Intercom',
    shoppingCenter: 'Shopping Center',
    powerBackup: 'Power Backup',
    waterSupply: '24x7 Water Supply',
    gatedSecurity: 'Gated Security',
    cctv: 'CCTV Security',
    playground: 'Playground',
    library: 'Library',
    medicalhealthcare: 'Medical Healthcare',
    joggingtrack: 'Jogging Track',
    indoorgames: 'Indoor Games',
    outdoorgames: 'Outdoor Games',
    spa: 'Spa',
    banquethall: 'Banquet Hall',
    barbecue: 'Barbecue',
    tennis: 'Tennis Court',
    skating: 'Skating Rink',
    basketball: 'Basketball Court',
    vastu: 'Vastu Compliant',
    feng: 'Feng Shui'
  };

  const getDisplayAmenities = () => {
    if (!amenities) {
      return ['Lift', 'Internet Provider', 'Security', 'Park', 'Sewage Treatment', 'Visitor Parking'];
    }

    // If amenities is already an array of strings
    if (Array.isArray(amenities)) {
      return amenities;
    }

    // If amenities is a JSONB object from database
    if (typeof amenities === 'object') {
      const availableAmenities: string[] = [];
      
      Object.entries(amenities).forEach(([key, value]) => {
        // Include amenity if value is true, 'yes', or other truthy string values
        if (value === true || value === 'yes' || value === 'Yes' || value === 'TRUE') {
          const displayName = amenityKeyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
          availableAmenities.push(displayName);
        }
      });

      return availableAmenities.length > 0 ? availableAmenities : ['No amenities listed'];
    }

    return ['No amenities available'];
  };

  const displayAmenities = getDisplayAmenities();

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