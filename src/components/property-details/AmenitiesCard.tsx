import React from 'react';

interface AmenitiesCardProps {
  amenities?: any; // Can be string[] or JSONB object from database
}

export const AmenitiesCard: React.FC<AmenitiesCardProps> = ({ amenities }) => {
  // Mapping from database keys to display names (supports PG/Hostel too)
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
    feng: 'Feng Shui',
    // PG/Hostel common
    cupboard: 'Cupboard',
    geyser: 'Geyser',
    gyser: 'Geyser',
    tv: 'TV',
    ac: 'AC',
    bedding: 'Bedding',
    attachedBathroom: 'Attached Bathroom',
    attached_bathroom: 'Attached Bathroom',
    wifi: 'WiFi',
    refrigerator: 'Refrigerator',
    cookingAllowed: 'Cooking Allowed',
    cooking_allowed: 'Cooking Allowed',
    room_cleaning: 'Room Cleaning',
    laundry: 'Laundry',
    warden_facility: 'Warden Facility',
    // "What You Get" section amenities
    waterStorageFacility: 'Water Storage Facility',
    currentPropertyCondition: 'Property Condition'
  };

  const getDisplayAmenities = () => {
    if (!amenities) {
      return ['No amenities listed'];
    }

    // If amenities is already an array of strings
    if (Array.isArray(amenities)) {
      return amenities;
    }

    // If amenities is a JSONB object from database
    if (typeof amenities === 'object') {
      const availableAmenities: string[] = [];
      Object.entries(amenities).forEach(([rawKey, value]) => {
        const key = String(rawKey);
        const truthy = (
          value === true ||
          value === 1 ||
          value === '1' ||
          (typeof value === 'string' && [
            'yes','true','y','included','available','daily','bike','car','both',
            // "What You Get" section values
            'full','partial','dg-backup','available','bike','car','both',
            'overhead-tank','underground-tank','borewell','excellent','good','average'
          ].includes(value.toLowerCase()))
        );
        if (truthy) {
          const mapped = amenityKeyMap[key];
          let displayName = mapped || key
            .replace(/[_-]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^\w|\s\w/g, (m) => m.toUpperCase());
          
          // Format specific amenity values for better display
          if (key === 'powerBackup' && typeof value === 'string') {
            const powerBackupMap: Record<string, string> = {
              'full': 'Full Power Backup',
              'partial': 'Partial Power Backup',
              'dg-backup': 'DG Backup'
            };
            displayName = powerBackupMap[value] || displayName;
          } else if (key === 'lift' && typeof value === 'string') {
            const liftMap: Record<string, string> = {
              'available': 'Lift Available'
            };
            displayName = liftMap[value] || displayName;
          } else if (key === 'parking' && typeof value === 'string') {
            const parkingMap: Record<string, string> = {
              'bike': 'Bike Parking',
              'car': 'Car Parking',
              'both': 'Both Bike & Car Parking'
            };
            displayName = parkingMap[value] || displayName;
          } else if (key === 'waterStorageFacility' && typeof value === 'string') {
            const waterMap: Record<string, string> = {
              'overhead-tank': 'Overhead Tank',
              'underground-tank': 'Underground Tank',
              'both': 'Both Overhead & Underground',
              'borewell': 'Borewell'
            };
            displayName = waterMap[value] || displayName;
          } else if (key === 'security' && typeof value === 'string') {
            const securityMap: Record<string, string> = {
              'yes': 'Security Available'
            };
            displayName = securityMap[value] || displayName;
          } else if (key === 'wifi' && typeof value === 'string') {
            const wifiMap: Record<string, string> = {
              'available': 'WiFi Available'
            };
            displayName = wifiMap[value] || displayName;
          } else if (key === 'currentPropertyCondition' && typeof value === 'string') {
            const conditionMap: Record<string, string> = {
              'excellent': 'Excellent Condition',
              'good': 'Good Condition',
              'average': 'Average Condition',
              'needs-renovation': 'Needs Renovation'
            };
            displayName = conditionMap[value] || displayName;
          }
          
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