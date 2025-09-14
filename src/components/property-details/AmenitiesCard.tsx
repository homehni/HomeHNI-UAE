import React from 'react';
import { 
  Zap, 
  Users, 
  Shield, 
  Cloud, 
  Car, 
  Wifi, 
  Dumbbell, 
  Building, 
  Home,
  Waves,
  TreePine,
  ShieldCheck,
  Camera,
  Flame,
  Phone,
  ShoppingBag,
  Clock,
  Droplets,
  Sun
} from 'lucide-react';

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

  const getIconForAmenity = (amenity: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Lift': Building,
      'Servant room': Users,
      'Security': Shield,
      'Rain water harvesting': Cloud,
      'Gym': Dumbbell,
      'Swimming Pool': Waves,
      'Club House': Home,
      'Fire Safety': Flame,
      'Gas Pipeline': Flame,
      'Intercom': Phone,
      'Shopping Center': ShoppingBag,
      'Power Backup': Zap,
      '24x7 Water Supply': Droplets,
      'Gated Security': ShieldCheck,
      'CCTV Security': Camera,
      'Playground': TreePine,
      'WiFi': Wifi,
      'Internet Provider': Wifi,
      'Park': TreePine,
      'Visitor Parking': Car,
      'Sewage Treatment': Droplets,
    };
    return iconMap[amenity] || Home;
  };

  const getDisplayAmenities = () => {
    if (!amenities) {
      return [
        { name: 'Lift', icon: Building },
        { name: 'Servant room', icon: Users },
        { name: 'Security', icon: Shield },
        { name: 'Rain water harvesting', icon: Cloud }
      ];
    }

    // If amenities is already an array of strings
    if (Array.isArray(amenities)) {
      return amenities.map(amenity => ({
        name: amenity,
        icon: getIconForAmenity(amenity)
      }));
    }

    // If amenities is a JSONB object from database
    if (typeof amenities === 'object') {
      const availableAmenities: Array<{name: string, icon: React.ComponentType<any>}> = [];
      Object.entries(amenities).forEach(([rawKey, value]) => {
        const key = String(rawKey);
        const truthy = (
          value === true ||
          value === 1 ||
          value === '1' ||
          (typeof value === 'string' && [
            'yes','true','y','included','available','daily','bike','car','both',
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
          }
          
          availableAmenities.push({
            name: displayName,
            icon: getIconForAmenity(displayName)
          });
        }
      });
      return availableAmenities.length > 0 ? availableAmenities : [
        { name: 'Lift', icon: Building },
        { name: 'Servant room', icon: Users },
        { name: 'Security', icon: Shield },
        { name: 'Rain water harvesting', icon: Cloud }
      ];
    }

    return [
      { name: 'Lift', icon: Building },
      { name: 'Servant room', icon: Users },
      { name: 'Security', icon: Shield },
      { name: 'Rain water harvesting', icon: Cloud }
    ];
  };

  const displayAmenities = getDisplayAmenities();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Amenities
        </h2>
        <div className="w-12 h-0.5 bg-red-600 mb-6"></div>
        
        <div className="grid grid-cols-5 gap-6">
          {displayAmenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-3 border border-gray-100">
                  <IconComponent className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {amenity.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};