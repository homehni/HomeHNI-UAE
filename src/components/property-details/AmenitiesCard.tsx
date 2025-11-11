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
  Sun,
  Tv,
  Refrigerator,
  UtensilsCrossed,
  MoveUp,
  ChefHat,
  Wind,
  Bed,
  ShowerHead,
  Building2,
  Cigarette,
  Wine,
  Bath
} from 'lucide-react';

interface AmenitiesCardProps {
  amenities?: unknown; // Can be string[] or JSONB object from database
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
    common_tv: 'Common TV',
    mess: 'Mess',
    // Land/Plot specific amenities
    electricityConnection: 'Electricity Connection',
    sewageConnection: 'Sewage Connection',
    room_cleaning: 'Room Cleaning',
    laundry: 'Laundry',
    warden_facility: 'Warden Facility',
    // "What You Get" section amenities
    waterStorageFacility: 'Water Storage Facility',
    currentPropertyCondition: 'Property Condition',
    // Flatmates-specific amenities
    bathrooms: 'Bathrooms',
    balconies: 'Balconies',
    smokingAllowed: 'Smoking Allowed',
    drinkingAllowed: 'Drinking Allowed',
    secondaryNumber: 'Secondary Number',
    moreSimilarUnits: 'More Similar Units'
  };

  const getIconForAmenity = (amenity: string) => {
    const iconMap: Record<string, React.ComponentType<unknown>> = {
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
      'Electricity Connection': Zap,
      'Sewage Connection': Droplets,
      'Common TV': Tv,
      'Mess': UtensilsCrossed,
      'Cooking Allowed': ChefHat,
      'Refrigerator': Refrigerator,
      // Room amenities
      'Cupboard': ShoppingBag,
      'Geyser': Droplets,
      'TV': Tv,
      'AC': Wind,
      'Bedding': Bed,
      'Attached Bathroom': ShowerHead,
      'Bathrooms': Bath,
      'Balconies': Building2,
      'Smoking Allowed': Cigarette,
      'Drinking Allowed': Wine,
      'Secondary Number': Phone,
      'More Similar Units': Building
    };
    return iconMap[amenity] || Home;
  };

  const getDisplayAmenities = () => {
    if (!amenities) {
      return [];
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
      const availableAmenities: Array<{name: string, icon: React.ComponentType<unknown>}> = [];
      Object.entries(amenities).forEach(([rawKey, value]) => {
        const key = String(rawKey);
        
        // Skip non-amenity fields that should be displayed elsewhere
        if (['whoWillShow', 'currentPropertyCondition', 'directionsTip', 'who_will_show', 'current_property_condition', 'directions_tip', 'secondary_phone', 'nonVegAllowed', 'petAllowed', 'gym', 'gatedSecurity', 'non_veg_allowed', 'pet_allowed', 'parking'].includes(key)) {
          return;
        }
        
        const strVal = typeof value === 'string' ? value.toLowerCase().trim() : '';
        const truthy = (
          value === true ||
          value === 1 ||
          value === '1' ||
          (typeof value === 'string' && [
            'yes','true','y','included','available','daily','bike','car','both',
            'full','partial','dg-backup','overhead-tank','underground-tank','borewell','excellent','good','average',
            '24x7-security','daytime-security','covered','open','guard','cctv',
            'septic-tank','municipal','three-phase','single-phase'
          ].includes(strVal)) ||
          // Show non-empty descriptive strings that aren't explicit negatives
          (typeof value === 'string' && strVal.length > 0 && !['no','none','n/a','na','not available','not-available','false'].includes(strVal))
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
              'dg-backup': 'DG Backup',
              'available': 'Power Backup',
              'not-available': 'No Power Backup'
            };
            displayName = powerBackupMap[value] || displayName;
          }
          
          if (key === 'waterStorageFacility' && typeof value === 'string') {
            const waterStorageMap: Record<string, string> = {
              'overhead-tank': 'Overhead Tank',
              'underground-tank': 'Underground Tank',
              'both': 'Both Overhead & Underground',
              'none': 'No Storage',
              'tank': 'Water Tank',
              'borewell': 'Borewell'
            };
            displayName = waterStorageMap[value] || displayName;
          }
          
          if (key === 'security' && typeof value === 'string') {
            const securityMap: Record<string, string> = {
              '24x7-security': '24x7 Security',
              'daytime-security': 'Daytime Security',
              'none': 'No Security',
              'guard': 'Security Guard',
              'cctv': 'CCTV',
              'both': 'Guard & CCTV'
            };
            displayName = securityMap[value] || displayName;
          }
          
          if (key === 'lift' && typeof value === 'string') {
            const liftMap: Record<string, string> = {
              'available': 'Lift',
              'not-available': 'No Lift'
            };
            displayName = liftMap[value] || displayName;
          }
          
          if (key === 'parking' && typeof value === 'string') {
            const parkingMap: Record<string, string> = {
              'covered': 'Covered Parking',
              'open': 'Open Parking',
              'none': 'No Parking'
            };
            displayName = parkingMap[value] || displayName;
          }
          
          if (key === 'electricityConnection' && typeof value === 'string') {
            const electricityMap: Record<string, string> = {
              'available': 'Electricity Connection',
              'not-available': 'No Electricity',
              'three-phase': 'Three Phase Connection',
              'single-phase': 'Single Phase Connection'
            };
            displayName = electricityMap[value] || displayName;
          }
          
          if (key === 'sewageConnection' && typeof value === 'string') {
            const sewageMap: Record<string, string> = {
              'septic-tank': 'Septic Tank',
              'municipal': 'Municipal Connection',
              'not-available': 'No Sewage Connection',
              'available': 'Sewage Connection'
            };
            displayName = sewageMap[value] || displayName;
          }
          
          // Flatmates-specific value mappings
          if (key === 'attachedBathroom' && typeof value === 'boolean') {
            displayName = value ? 'Attached Bathroom' : 'No Attached Bathroom';
          }
          
          if (key === 'bathrooms' && typeof value === 'number') {
            displayName = value > 0 ? `${value} Bathroom${value > 1 ? 's' : ''}` : 'No Bathrooms';
          }
          
          if (key === 'balconies' && typeof value === 'number') {
            displayName = value > 0 ? `${value} Balcon${value > 1 ? 'ies' : 'y'}` : 'No Balconies';
          }
          
          if (key === 'smokingAllowed' && typeof value === 'boolean') {
            displayName = value ? 'Smoking Allowed' : 'No Smoking';
          }
          
          if (key === 'drinkingAllowed' && typeof value === 'boolean') {
            displayName = value ? 'Drinking Allowed' : 'No Drinking';
          }
          
          if (key === 'moreSimilarUnits' && typeof value === 'boolean') {
            displayName = value ? 'More Similar Units Available' : 'No More Similar Units';
          }
          
          availableAmenities.push({
            name: displayName,
            icon: getIconForAmenity(displayName)
          });
        }
      });
      return availableAmenities;
    }

    return [];
  };

  const displayAmenities = getDisplayAmenities();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Amenities
        </h2>
        <div className="w-12 h-0.5 bg-red-600 mb-6"></div>

        {displayAmenities.length === 0 ? (
          <div className="text-gray-500 text-sm">No amenities provided.</div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
