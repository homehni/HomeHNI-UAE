import React from 'react';
import { 
  ShoppingBag,
  Droplets,
  Tv,
  Wind,
  Bed,
  ShowerHead
} from 'lucide-react';

interface RoomDetailsCardProps {
  room_amenities?: {
    cupboard?: boolean;
    geyser?: boolean;
    tv?: boolean;
    ac?: boolean;
    bedding?: boolean;
    attachedBathroom?: boolean;
  };
}

export function RoomDetailsCard({ room_amenities }: RoomDetailsCardProps) {
  console.log('RoomDetailsCard - Received room_amenities:', room_amenities);
  
  if (!room_amenities) {
    console.log('RoomDetailsCard - No room_amenities data, returning null');
    return null;
  }

  const getIconForRoomAmenity = (amenity: string) => {
    const iconMap: Record<string, React.ComponentType<unknown>> = {
      'Cupboard': ShoppingBag,
      'Geyser': Droplets,
      'TV': Tv,
      'AC': Wind,
      'Bedding': Bed,
      'Attached Bathroom': ShowerHead,
    };
    return iconMap[amenity] || ShoppingBag;
  };

  const getDisplayRoomAmenities = () => {
    if (!room_amenities) {
      return [];
    }

    const amenityKeyMap: Record<string, string> = {
      cupboard: 'Cupboard',
      geyser: 'Geyser',
      tv: 'TV',
      ac: 'AC',
      bedding: 'Bedding',
      attachedBathroom: 'Attached Bathroom',
    };

    const amenities: Array<{ name: string; icon: React.ComponentType<unknown> }> = [];

    console.log('RoomDetailsCard - Processing room_amenities:', room_amenities);
    console.log('RoomDetailsCard - amenityKeyMap:', amenityKeyMap);

    Object.entries(room_amenities).forEach(([key, value]) => {
      console.log(`RoomDetailsCard - Processing ${key}: ${value}`);
      if (value === true) {
        const displayName = amenityKeyMap[key];
        if (displayName) {
          amenities.push({
            name: displayName,
            icon: getIconForRoomAmenity(displayName)
          });
          console.log(`RoomDetailsCard - Added amenity: ${displayName}`);
        }
      }
    });

    console.log('RoomDetailsCard - Final amenities array:', amenities);
    return amenities;
  };

  const roomAmenities = getDisplayRoomAmenities();

  console.log('RoomDetailsCard - roomAmenities.length:', roomAmenities.length);

  if (roomAmenities.length === 0) {
    console.log('RoomDetailsCard - No amenities to display, returning null');
    return null;
  }

  console.log('RoomDetailsCard - Rendering component with amenities:', roomAmenities);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Bed className="w-5 h-5 text-red-600 mr-2" />
        Room Details
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {roomAmenities.map((amenity, index) => {
          const IconComponent = amenity.icon;
          return (
            <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <IconComponent className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
