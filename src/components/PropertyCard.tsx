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

  const formatPrice = (priceStr: string) => {
    const lower = priceStr.toLowerCase();
    
    // Check if it's a rental property (contains "month", "/month", etc.)
    if (lower.includes('month') || lower.includes('/month')) {
      // Extract the number from the price string
      const num = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      
      // Format numbers >= 1000 as K
      if (num >= 1000) {
        const kValue = Math.round(num / 1000);
        // Use shorter format for mobile (K/M instead of K/Month)
        return `${kValue}K/M`;
      } else {
        return `${num}/M`;
      }
    }
    
    // For non-rental properties, return as is
    return priceStr;
  };

  const parseAreaToNumber = (areaStr: string) => {
    const num = parseFloat(areaStr.replace(/[^0-9.]/g, '')) || 0;
    return Math.round(num);
  };


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

  // Handle PG/Hostel properties specially - comprehensive detection
  const isPGHostel = propertyType.toLowerCase().includes('pg') || 
                    propertyType.toLowerCase().includes('hostel') ||
                    title.toLowerCase().includes('pg') ||
                    title.toLowerCase().includes('hostel');
  
  const propertyForPage = {
    id,
    title,
    property_type: propertyType.toLowerCase().replace(/\s+/g, '_'),
    listing_type: isPGHostel ? 'rent' : 'sale',
    bhk_type: isPGHostel ? 'PG/Hostel' : (bedrooms ? `${bedrooms} BHK` : undefined),
    expected_price: parsePriceToNumber(price),
    super_area: isPGHostel ? parseAreaToNumber(area.replace(/[^\d]/g, '')) || 1 : parseAreaToNumber(area),
    bathrooms,
    locality: location,
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
    // Debug logging
    console.log('PropertyCard image data:', {
      id,
      title,
      image,
      imageType: typeof image,
      isArray: Array.isArray(image),
      imageLength: Array.isArray(image) ? image.length : 'N/A'
    });
    
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
    <Card className="w-full overflow-hidden card-border hover-lift cursor-pointer bg-white border-2 border-brand-red/30 hover:border-brand-red/60" onClick={() => {
      sessionStorage.setItem(`property-${id}`, JSON.stringify(propertyForPage));
      window.open(`/property/${id}`, '_blank');
    }}>
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
        
        <div className="flex justify-between items-end mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-5 text-xs border-gray-200 hover:bg-gray-50 px-2 py-1 card-border"
            onClick={(e) => {
              e.stopPropagation();
              setShowContactModal(true);
            }}
          >
            <Phone size={7} className="mr-0.5" />
            Contact
          </Button>
          
          {/* Price Display - Bottom Right */}
          <div className="text-xs font-bold text-black">
            {formatPrice(price)}
          </div>
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
