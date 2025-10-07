import React from 'react';

type RoomTypeKey = 'single' | 'double' | 'three' | 'four';

type RoomAmenities = {
  cupboard?: boolean;
  geyser?: boolean;
  tv?: boolean;
  ac?: boolean;
  bedding?: boolean;
  attachedBathroom?: boolean;
};

interface PGRoomPayload {
  pg_room_types?: RoomTypeKey[];
  pg_room_pricing?: Record<string, { expectedRent?: number; expectedDeposit?: number }>;
  pg_room_amenities?: RoomAmenities;
}

interface PGRoomsCardProps {
  property: PGRoomPayload;
}

const ROOM_TYPE_LABELS: Record<RoomTypeKey, string> = {
  single: 'Single',
  double: 'Double Sharing',
  three: 'Triple Sharing',
  four: 'Four Sharing',
};

const formatINR = (value?: number) => {
  if (value == null || Number.isNaN(Number(value))) return '—';
  try {
    return `₹${new Intl.NumberFormat('en-IN').format(Number(value))}`;
  } catch {
    return `₹${value}`;
  }
};

export const PGRoomsCard: React.FC<PGRoomsCardProps> = ({ property }) => {
  const types: RoomTypeKey[] = Array.isArray(property?.pg_room_types)
    ? (property.pg_room_types as RoomTypeKey[])
    : [];
  const pricing: Record<string, { expectedRent?: number; expectedDeposit?: number }> =
    property?.pg_room_pricing || {};
  const roomAmenities: RoomAmenities | undefined = property?.pg_room_amenities || undefined;

  const hasFallback = !types.length && (typeof (property as any).expected_rent === 'number' || typeof (property as any).expected_deposit === 'number');
  if (!types.length && !hasFallback) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Room Types & Pricing</h2>
        <p className="text-sm text-gray-600 mt-1">Each room type has its own rent and deposit per person.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {hasFallback && (
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-base sm:text-lg font-medium text-gray-900">Room</div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500">Rent (per person)</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{formatINR((property as any).expected_rent)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500">Deposit (per person)</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{formatINR((property as any).expected_deposit)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room amenities - fallback tries common amenity flags if present */}
            {roomAmenities && (
              <div className="mt-3 text-sm text-gray-700">
                <div className="flex flex-wrap gap-2">
                  {roomAmenities.cupboard && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Cupboard</span>
                  )}
                  {roomAmenities.geyser && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Geyser</span>
                  )}
                  {roomAmenities.tv && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">TV</span>
                  )}
                  {roomAmenities.ac && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">AC</span>
                  )}
                  {roomAmenities.bedding && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Bedding</span>
                  )}
                  {roomAmenities.attachedBathroom && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Attached Bath</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasFallback && types.map((t) => {
          const details = pricing?.[t] || {};
          return (
            <div key={t} className="px-4 sm:px-6 py-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-base sm:text-lg font-medium text-gray-900">{ROOM_TYPE_LABELS[t]}</div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500">Rent (per person)</div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900">{formatINR(details.expectedRent)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500">Deposit (per person)</div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900">{formatINR(details.expectedDeposit)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room amenities - if provided, show a compact list */}
              {roomAmenities && (
                <div className="mt-3 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {roomAmenities.cupboard && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Cupboard</span>
                    )}
                    {roomAmenities.geyser && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Geyser</span>
                    )}
                    {roomAmenities.tv && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">TV</span>
                    )}
                    {roomAmenities.ac && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">AC</span>
                    )}
                    {roomAmenities.bedding && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Bedding</span>
                    )}
                    {roomAmenities.attachedBathroom && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800">Attached Bath</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PGRoomsCard;
