import { Heart, MapPin, Bed, Bath, Square, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RECOMMENDED_CARD_WIDTH, RECOMMENDED_IMAGE_HEIGHT } from '@/constants/ui';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  propertyType: string;
  isNew?: boolean;
  size?: 'default' | 'compact' | 'large';
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  area,
  bedrooms,
  bathrooms,
  image,
  propertyType,
  isNew = false,
  size = 'default'
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const parsePriceToNumber = (priceStr: string) => {
    const lower = priceStr.toLowerCase();
    const num = parseFloat(lower.replace(/[^0-9.]/g, '')) || 0;
    if (lower.includes('cr')) return Math.round(num * 10000000);
    if (lower.includes('l')) return Math.round(num * 100000);
    if (lower.includes('k')) return Math.round(num * 1000);
    return Math.round(num);
  };

  const parseAreaToNumber = (areaStr: string) => {
    const num = parseFloat(areaStr.replace(/[^0-9.]/g, '')) || 0;
    return Math.round(num);
  };

  const parts = location.split(',').map((s) => s.trim());

  // Derive city, state and pincode from location/title
  const cities = ['Bangalore', 'Gurgaon', 'Noida', 'Mumbai', 'Pune', 'Delhi'] as const;
  const cityFromParts = parts[parts.length - 1] || '';
  const detectedCity =
    (cities.find((c) => cityFromParts.toLowerCase().includes(c.toLowerCase())) ||
      cities.find((c) => location.toLowerCase().includes(c.toLowerCase())) ||
      cities.find((c) => title.toLowerCase().includes(c.toLowerCase())) ||
      'Delhi');

  const cityInfoMap: Record<string, { state: string; pincode: string }> = {
    Bangalore: { state: 'Karnataka', pincode: '560001' },
    Gurgaon: { state: 'Haryana', pincode: '122001' },
    Noida: { state: 'Uttar Pradesh', pincode: '201301' },
    Mumbai: { state: 'Maharashtra', pincode: '400001' },
    Pune: { state: 'Maharashtra', pincode: '411001' },
    Delhi: { state: 'Delhi', pincode: '110001' },
  };
  const cityMeta = cityInfoMap[detectedCity] || { state: 'Delhi', pincode: '110001' };

  // Provide 2-3 photos per property
  const additionalIds = [
    'photo-1512917774080-9991f1c4c750',
    'photo-1568605114967-8130f3a36994',
    'photo-1522708323590-d24dbb6b0267',
    'photo-1613490493576-7fde63acd811',
  ];
  const imageIds = Array.from(new Set([image, ...additionalIds])).slice(0, 3);
  const imagesForPage = imageIds.map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`);

  const propertyForPage = {
    id,
    title,
    property_type: propertyType.toLowerCase().replace(/\s+/g, '_'),
    listing_type: 'sale',
    bhk_type: bedrooms ? `${bedrooms} BHK` : undefined,
    expected_price: parsePriceToNumber(price),
    super_area: parseAreaToNumber(area),
    bathrooms,
    city: detectedCity,
    locality: parts[0] || location,
    state: cityMeta.state,
    pincode: cityMeta.pincode,
    description: undefined,
    images: imagesForPage,
    videos: [],
    status: 'active',
    created_at: new Date().toISOString(),
    owner_name: undefined,
    owner_email: undefined,
    owner_phone: undefined,
    owner_role: undefined,
  };

  return (
    <Card className="w-48 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer rounded-xl border-0 bg-white shadow-sm" onClick={() => navigate(`/property/${id}`, { state: propertyForPage })}>
      <div className="relative">
        <div className="h-24 overflow-hidden">
          <img
            src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=400&q=80`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 h-8 w-8 p-0 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={14} />
        </Button>
        {isNew && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            New
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded-md text-xs font-medium">
          {propertyType}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-semibold text-xs mb-1 line-clamp-2 text-gray-900">{title} - online only</h3>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin size={10} className="mr-1 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{location}</span>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-16 h-7 text-xs border-gray-200 hover:bg-gray-50 px-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={8} className="mr-0.5" />
            <span className="text-xs">Call</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
