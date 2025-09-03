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
    const raw = s.trim();

    // Already absolute URL or data URI → use as-is
    if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return raw;

    // App-hosted public assets (e.g., /lovable-uploads/..., /images/..., /placeholder.svg)
    if (/^\//.test(raw)) return raw;

    // Normalize common prefixes that may be stored in DB
    let cleaned = raw
      .replace(/^\/?storage\/v1\/object\/public\/property-media\//i, '')
      .replace(/^property-media\//i, '')
      .replace(/^public\//i, '');

    // If path points to public uploads folder but lacks leading slash, add it
    if (/^(lovable-uploads|images|img|assets)\//i.test(cleaned)) {
      return `/${cleaned}`;
    }

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

  const fallbackUrls = [1, 2, 3].map((i) => {
    const path = `${baseFolder}/${typeToFolder(propertyType)}${i}.jpg`;
    try {
      const { data } = supabase.storage.from('property-media').getPublicUrl(path);
      return data.publicUrl;
    } catch {
      return '/placeholder.svg';
    }
  });

  let imagesForPage: string[] = [];
  if (Array.isArray(image)) {
    imagesForPage = image.map((it) => {
      if (typeof it === 'string') {
        return it.startsWith('http') ? it : toUrl(it);
      }
      if (it && typeof it === 'object' && 'url' in it) {
        return (it as any).url;
      }
      return undefined;
    }).filter(Boolean) as string[];
  } else if (typeof image === 'string') {
    const url = image.startsWith('http') ? image : toUrl(image);
    if (url) imagesForPage = [url];
  } else if (image && typeof image === 'object' && 'url' in image) {
    imagesForPage = [(image as any).url];
  }
  
  // Only add fallbacks if we have fewer than 3 real images
  const realImagesCount = imagesForPage.length;
  if (realImagesCount < 3) {
    const fallbacksNeeded = 3 - realImagesCount;
    imagesForPage = [...imagesForPage, ...fallbackUrls.slice(0, fallbacksNeeded)];
  }

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

  // Handle different image formats - prioritize direct URLs from database
  const getImageUrl = () => {
    if (Array.isArray(image)) {
      const first = image[0];
      if (typeof first === 'string') {
        // If it's a direct URL, use it as-is
        return first.startsWith('http') ? first : (resolveUrlFromString(first) || '/placeholder.svg');
      }
      if (first && typeof first === 'object' && 'url' in first) {
        // Handle object format with url property (from database)
        return (first as any).url || '/placeholder.svg';
      }
      return '/placeholder.svg';
    }
    if (typeof image === 'string') {
      // If it's a direct URL, use it as-is
      return image.startsWith('http') ? image : (resolveUrlFromString(image) || '/placeholder.svg');
    }
    if (image && typeof image === 'object' && 'url' in image) {
      // Handle object format with url property (from database)
      return (image as any).url || '/placeholder.svg';
    }
    return '/placeholder.svg';
  };

  return (
    <Card className="w-full overflow-hidden card-border hover-lift cursor-pointer bg-white border-2 border-brand-red/30 hover:border-brand-red/60" onClick={() => navigate(`/property/${id}`, { state: propertyForPage })}>
      <div className="relative">
        <div className="h-24 overflow-hidden">
          <img
            src={getImageUrl()}
            alt={title}
            loading="lazy"
            decoding="async"
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
