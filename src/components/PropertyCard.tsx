import { Heart, MapPin, Bed, Bath, Square, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RECOMMENDED_CARD_WIDTH, RECOMMENDED_IMAGE_HEIGHT } from '@/constants/ui';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { supabase } from '@/integrations/supabase/client';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  image: string | { url: string } | (string | { url: string })[];
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
  const [showContactModal, setShowContactModal] = useState(false);

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

  // Map property type to storage folder names inside property-media/content-images
  const typeToFolder = (type: string) => {
    const t = (type || '').toLowerCase().trim();
    const map: Record<string, string> = {
      'apartment': 'apartment',
      'flat': 'apartment',
      'independent house': 'independent-house',
      'house': 'house',
      'villa': 'villa',
      'penthouse': 'penthouse',
      'commercial': 'commercial',
      'plot': 'plot',
      'agriculture lands': 'agricultural-lands',
      'agricultural lands': 'agricultural-lands',
      'farm house': 'farmhouse',
      'farmhouse': 'farmhouse',
    };
    return map[t] || t.replace(/\s+/g, '-');
  };

  const baseFolder = `content-images/${typeToFolder(propertyType)}`;

  // Build public URL robustly; handle various path formats and prefixes
  const resolveUrlFromString = (s: string): string | undefined => {
    if (!s) return undefined;
    // If it's already a full URL, return as-is
    if (/^https?:\/\//i.test(s)) return s;

    // Normalize common prefixes that may be stored in DB
    let cleaned = s.trim();
    // Remove leading domain-style public path if present
    cleaned = cleaned.replace(/^\/?storage\/v1\/object\/public\/property-media\//i, '');
    // Remove leading bucket name if included
    cleaned = cleaned.replace(/^property-media\//i, '');
    // Remove generic public prefix
    cleaned = cleaned.replace(/^public\//i, '');

    // If only a filename was provided, prefix with type folder
    const needsFolder = !cleaned.includes('/');
    const path = needsFolder ? `${baseFolder}/${cleaned}` : cleaned;

    try {
      const { data } = supabase.storage.from('property-media').getPublicUrl(path);
      return data.publicUrl;
    } catch {
      return undefined;
    }
  };

  const toUrl = (v: string | { url: string } | undefined): string | undefined => {
    if (!v) return undefined;
    return typeof v === 'string' ? resolveUrlFromString(v) : resolveUrlFromString(v.url);
  };

  const fallbackUrls = [
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  let imagesForPage: string[] = [];
  if (Array.isArray(image)) {
    imagesForPage = image.map((it) => (typeof it === 'string' ? toUrl(it) : toUrl(it?.url ? it : undefined))).filter(Boolean) as string[];
  } else {
    imagesForPage = [toUrl(typeof image === 'string' ? image : image?.url)].filter(Boolean) as string[];
  }
  imagesForPage = [...imagesForPage, ...fallbackUrls].slice(0, 3);

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

  // Handle different image formats with Supabase public URL resolution
  const getImageUrl = () => {
    if (Array.isArray(image)) {
      const first = image[0];
      const url = typeof first === 'string' ? resolveUrlFromString(first) : resolveUrlFromString((first as any)?.url);
      return url || '/placeholder.svg';
    }
    if (typeof image === 'string') {
      return resolveUrlFromString(image) || '/placeholder.svg';
    }
    return resolveUrlFromString((image as any)?.url) || '/placeholder.svg';
  };

  return (
    <Card className="w-full overflow-hidden card-border hover-lift cursor-pointer bg-white border-2 border-primary" onClick={() => navigate(`/property/${id}`, { state: propertyForPage })}>
      <div className="relative">
        <div className="h-24 overflow-hidden">
          <img
            src={getImageUrl()}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
              e.currentTarget.alt = 'Image not available';
            }}
          />
        </div>
        <FavoriteButton 
          propertyId={id}
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
        />
        {isNew && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            New
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-semibold text-xs mb-1 h-4 truncate text-gray-900">{title}</h3>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin size={10} className="mr-1 flex-shrink-0" />
          <span className="text-xs line-clamp-1 text-uniform">{location}</span>
        </div>
        
        <div className="flex gap-1 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-6 text-xs border-gray-200 hover:bg-gray-50 px-1 card-border"
            onClick={(e) => {
              e.stopPropagation();
              setShowContactModal(true);
            }}
          >
            <Phone size={8} />
          </Button>
          <Button
            size="sm"
            className="flex-1 h-6 text-xs bg-red-600 hover:bg-red-700 text-white px-1"
          >
            Details
          </Button>
        </div>
      </CardContent>

      <ContactOwnerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        propertyId={id}
        propertyTitle={title}
      />
    </Card>
  );
};

export default PropertyCard;
