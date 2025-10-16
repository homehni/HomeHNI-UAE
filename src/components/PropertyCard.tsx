import { Heart, MapPin, Bed, Bath, Square, Phone, Edit2, ToggleLeft, ToggleRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RECOMMENDED_CARD_WIDTH, RECOMMENDED_IMAGE_HEIGHT } from '@/constants/ui';
import { useNavigate } from 'react-router-dom';
import { useState, memo } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ContactOwnerModal } from '@/components/ContactOwnerModal';
import { PropertyWatermark } from '@/components/property-details/PropertyWatermark';
import { supabase } from '@/integrations/supabase/client';
import propertyPlaceholder from '@/assets/property-placeholder.png';
import { generatePropertyName } from '@/utils/propertyNameGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  listingType?: string;  
  isNew?: boolean;
  size?: 'default' | 'compact' | 'large';
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
  ownerId?: string; // Add owner ID to check ownership
  showOwnerActions?: boolean; // Flag to show/hide owner actions
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
  listingType,
  isNew = false,
  size = 'default',
  rental_status = 'available',
  ownerId,
  showOwnerActions = false
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState(rental_status);

  // Check if current user owns this property
  const isOwner = user && ownerId && user.id === ownerId;

  // Generate a proper title if the current title is "Untitled"
  const getDisplayTitle = () => {
    if (title === "Untitled" || !title.trim()) {
      const bhkType = bedrooms > 0 ? `${bedrooms}BHK` : undefined;
      return generatePropertyName({
        bhkType,
        propertyType,
        listingType: listingType || 'sale'
      });
    }
    return title;
  };

  const parsePriceToNumber = (priceStr: string) => {
    const lower = priceStr.toLowerCase();
    const num = parseFloat(lower.replace(/[^0-9.]/g, '')) || 0;
    if (lower.includes('cr')) return Math.round(num * 10000000);
    if (lower.includes('l')) return Math.round(num * 100000);
    if (lower.includes('k')) return Math.round(num * 1000);
    return Math.round(num);
  };

  // Owner action handlers
  const handleEditProperty = () => {
    // Navigate to edit property page
    navigate(`/edit-property/${id}?tab=basic`);
  };

  const handleTogglePropertyStatus = async () => {
    const currentStatus = rental_status || 'available';
    const newStatus = currentStatus === 'available' ? 'inactive' : 'available';

    try {
      // Try properties table first
      const { data: propsUpdated, error: propsErr } = await supabase
        .from('properties')
        .update({ rental_status: newStatus })
        .eq('id', id)
        .select('id');

      if (propsErr) throw propsErr;

      if (!propsUpdated || propsUpdated.length === 0) {
        // Fallback to submissions table
        const { data: subsUpdated, error: subsErr } = await supabase
          .from('property_submissions')
          .update({ rental_status: newStatus })
          .eq('id', id)
          .select('id');

        if (subsErr) throw subsErr;
        if (!subsUpdated || subsUpdated.length === 0) throw new Error('No matching property found to update');
      }

      toast.success(
        newStatus === 'available' ? 'Property Activated' : 'Property Deactivated',
        {
          description: `Your property is now ${newStatus === 'available' ? 'active' : 'inactive'}.`,
        }
      );

      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Toggle property status failed', error);
      toast.error('Failed to update property status. Please try again.');
    }
  };

  const refreshPropertyStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('status')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (['available', 'inactive', 'rented', 'sold'].includes(data.status)) {
        setPropertyStatus(data.status as 'available' | 'inactive' | 'rented' | 'sold');
      } else {
        console.warn('Unexpected property status:', data.status);
      }
    } catch (error) {
      console.error('Failed to refresh property status:', error);
    }
  };

  const handleUpgradeProperty = () => {
    // Comprehensive property type and listing type mapping to correct plan pages
    
    const propType = propertyType.toLowerCase();
    const listType = listingType?.toLowerCase() || 'sale';
    const titleLower = title.toLowerCase();
    
    let planTab = '';
    let category = 'residential';
    
    // Determine if it's a rental (rent/lease) or sale property
    const isRental = listType.includes('rent') || listType.includes('lease');
    
    // RESIDENTIAL PROPERTIES
    const isResidentialApartment = propType.includes('apartment') || 
                                    propType.includes('flat') || 
                                    propType.includes('1bhk') || 
                                    propType.includes('2bhk') || 
                                    propType.includes('3bhk') || 
                                    propType.includes('4bhk') ||
                                    titleLower.includes('apartment') ||
                                    titleLower.includes('flat');
    
    const isResidentialHouse = propType.includes('house') || 
                               propType.includes('villa') || 
                               propType.includes('bungalow') ||
                               propType.includes('independent') ||
                               titleLower.includes('villa') ||
                               titleLower.includes('house');
    
    const isPGHostel = propType.includes('pg') || 
                       propType.includes('hostel') ||
                       titleLower.includes('pg') ||
                       titleLower.includes('hostel');
    
    // COMMERCIAL PROPERTIES
    const isOfficeSpace = propType.includes('office') || 
                          propType.includes('coworking') ||
                          titleLower.includes('office space') ||
                          titleLower.includes('coworking');
    
    const isRetailShop = propType.includes('shop') || 
                         propType.includes('retail') || 
                         propType.includes('showroom') ||
                         titleLower.includes('shop') ||
                         titleLower.includes('retail');
    
    const isWarehouse = propType.includes('warehouse') || 
                        propType.includes('godown') || 
                        propType.includes('storage') ||
                        titleLower.includes('warehouse') ||
                        titleLower.includes('godown');
    
    const isCommercialBuilding = propType.includes('commercial building') || 
                                 propType.includes('commercial space') ||
                                 titleLower.includes('commercial building');
    
    // INDUSTRIAL PROPERTIES  
    const isIndustrial = propType.includes('industrial') || 
                         propType.includes('factory') || 
                         propType.includes('manufacturing') ||
                         propType.includes('industrial land') ||
                         propType.includes('industrial plot') ||
                         titleLower.includes('industrial') ||
                         titleLower.includes('factory');
    
    // AGRICULTURAL/LAND PROPERTIES
    const isAgriculturalLand = propType.includes('agricultural') || 
                               propType.includes('farm') || 
                               propType.includes('farmland') ||
                               titleLower.includes('agricultural') ||
                               titleLower.includes('farm');
    
    const isResidentialPlot = propType.includes('plot') || 
                              propType.includes('land') ||
                              (titleLower.includes('plot') && !titleLower.includes('industrial') && !titleLower.includes('agricultural')) ||
                              (titleLower.includes('land') && !titleLower.includes('industrial') && !titleLower.includes('agricultural'));
    
    // MAPPING LOGIC BASED ON YOUR REQUIREMENTS
    
    // 1. RESIDENTIAL PROPERTIES
    if (isResidentialApartment || isResidentialHouse || isPGHostel) {
      category = 'residential';
      if (isRental) {
        // Residential property for rent -> Owner Plans
        planTab = 'owner';
      } else {
        // Residential property for sale -> Seller Plans -> Residential
        planTab = 'seller';
      }
    }
    
    // 2. RESIDENTIAL PLOTS/LAND
    else if (isResidentialPlot && !isIndustrial && !isAgriculturalLand) {
      category = 'residential';
      if (isRental) {
        planTab = 'owner';
      } else {
        // Residential plot for sale -> Seller Plans -> Residential
        planTab = 'seller';
      }
    }
    
    // 3. AGRICULTURAL LAND
    else if (isAgriculturalLand) {
      category = 'agricultural';
      if (isRental) {
        // Agricultural land for rent -> Owner Plans -> Agricultural
        planTab = 'owner';
      } else {
        // Agricultural land for sale -> Seller Plans -> Agricultural
        planTab = 'seller';
      }
    }
    
    // 4. WAREHOUSE (Special case - goes to Commercial Seller Plans -> Industrial)
    else if (isWarehouse) {
      if (isRental) {
        // Warehouse for rent -> Owner Plans -> Commercial
        planTab = 'owner';
        category = 'commercial';
      } else {
        // Warehouse for sale -> Commercial Seller Plans -> Industrial
        planTab = 'commercial-seller';
        category = 'industrial';
      }
    }
    
    // 5. INDUSTRIAL PROPERTIES
    else if (isIndustrial) {
      category = 'industrial';
      if (isRental) {
        // Industrial property for rent -> Owner Plans -> Industrial
        planTab = 'owner';
      } else {
        // Industrial property for sale -> Commercial Seller Plans -> Industrial
        planTab = 'commercial-seller';
      }
    }
    
    // 6. OFFICE SPACE
    else if (isOfficeSpace) {
      category = 'commercial';
      if (isRental) {
        // Office space for rent -> Owner Plans -> Commercial
        planTab = 'owner';
      } else {
        // Office space for sale -> Commercial Seller Plans -> Commercial
        planTab = 'commercial-seller';
      }
    }
    
    // 7. RETAIL SHOP/SHOWROOM
    else if (isRetailShop) {
      category = 'commercial';
      if (isRental) {
        // Retail shop for rent -> Owner Plans -> Commercial
        planTab = 'owner';
      } else {
        // Retail shop for sale -> Commercial Seller Plans -> Commercial
        planTab = 'commercial-seller';
      }
    }
    
    // 8. OTHER COMMERCIAL PROPERTIES
    else if (isCommercialBuilding || propType.includes('commercial')) {
      category = 'commercial';
      if (isRental) {
        // Commercial property for rent -> Owner Plans -> Commercial
        planTab = 'owner';
      } else {
        // Commercial property for sale -> Commercial Seller Plans -> Commercial
        planTab = 'commercial-seller';
      }
    }
    
    // 9. DEFAULT FALLBACK (Residential)
    else {
      category = 'residential';
      if (isRental) {
        planTab = 'owner';
      } else {
        planTab = 'seller';
      }
    }
    
    // Special handling for Flatmates and PG/Hostel properties
    const isFlatmatesOrPGHostel = propType.includes('pg') || propType.includes('hostel') || propType.includes('flatmates') || titleLower.includes('pg') || titleLower.includes('hostel') || titleLower.includes('flatmates');

    if (isFlatmatesOrPGHostel) {
      navigate(`/plans?tab=rental&rentalRole=tenant&category=residential&skipWizard=true`);
      return;
    }
    
    // Navigate to the specific plan with category, bypassing the wizard
    // Use property-specific route to ensure wizard doesn't appear
    navigate(`/property/${id}/plans?tab=${planTab}&category=${category}&skipWizard=true`);

    // Refresh property status after navigation (e.g., after payment success)
    refreshPropertyStatus();
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
        return `₹${kValue}K/M`;
      } else {
        return `₹${num}/M`;
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
    const cleaned = raw
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
      return propertyPlaceholder;
    }
  });

  let imagesForPage: string[] = [];
  if (Array.isArray(image)) {
    imagesForPage = image.map((it) => {
      if (typeof it === 'string') {
        return it.startsWith('http') ? it : toUrl(it);
      }
      if (it && typeof it === 'object' && 'url' in it) {
        return (it as { url: string }).url;
      }
      return undefined;
    }).filter(Boolean) as string[];
  } else if (typeof image === 'string') {
    const url = image.startsWith('http') ? image : toUrl(image);
    if (url) imagesForPage = [url];
  } else if (image && typeof image === 'object' && 'url' in image) {
    imagesForPage = [(image as { url: string }).url];
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
    listing_type: listingType || (isPGHostel ? 'rent' : 'sale'),
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
    const sanitize = (url?: string) => {
      const u = (url || '').trim();
      if (!u) return propertyPlaceholder;
      const lower = u.toLowerCase();
      // Treat common placeholders as "no image" and use our branded fallback
      if (
        lower === '/placeholder.svg' ||
        lower.endsWith('/placeholder.svg') ||
        lower.includes('/placeholder.svg') ||
        lower.includes('placeholder.svg')
      ) {
        return propertyPlaceholder;
      }
      return u;
    };

    let candidate: string | undefined;

    if (Array.isArray(image)) {
      const first = image[0];
      if (typeof first === 'string') {
        candidate = first.startsWith('http') ? first : (resolveUrlFromString(first) || undefined);
      } else if (first && typeof first === 'object' && 'url' in first) {
        candidate = (first as { url: string }).url;
      }
    } else if (typeof image === 'string') {
      candidate = image.startsWith('http') ? image : (resolveUrlFromString(image) || undefined);
    } else if (image && typeof image === 'object' && 'url' in image) {
      candidate = (image as { url: string }).url;
    }

    return sanitize(candidate);
  };

  return (
    <Card className="w-full overflow-hidden card-border hover-lift cursor-pointer bg-white border-2 border-brand-red/30 hover:border-brand-red/60" onClick={() => {
      sessionStorage.setItem(`property-${id}`, JSON.stringify(propertyForPage));
      window.open(`/property/${id}`, '_blank');
    }}>
      {/* Wrapper switches to horizontal layout on md+ when size is large */}
      <div className={cn(size === 'large' ? 'md:flex md:flex-row md:items-stretch' : '')}>
        {/* Image section */}
        <div className={cn('relative', size === 'large' ? 'md:w-96 lg:w-[28rem] md:flex-shrink-0' : '')}>
          <PropertyWatermark status={rental_status}>
            <div className={cn(
              'overflow-hidden',
              size === 'large' ? 'h-52 md:h-52 lg:h-56 w-full' : 'h-24'
            )}>
              <img
                src={getImageUrl()}
                alt={getDisplayTitle()}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = propertyPlaceholder;
                  e.currentTarget.alt = 'Image not available';
                }}
              />
            </div>
          </PropertyWatermark>
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
          {/* Premium badge - visible only for premium properties */}
          {rental_status === 'available' && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Premium
            </div>
          )}
        </div>

        {/* Content section */}
        <CardContent className={cn('p-3 font-poppins', size === 'large' ? 'md:flex-1 md:p-4' : '')}>
          {size === 'large' ? (
            <>
              {/* Title and price header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-lg leading-snug truncate text-gray-900">{getDisplayTitle()}</h3>
                <div className="text-xl font-bold text-black whitespace-nowrap">{formatPrice(price)}</div>
              </div>
              {/* Subtitle: BHK + Type + listing type */}
              {(
                (bedrooms && bedrooms > 0) || (propertyType && propertyType.trim()) || listingType
              ) && (
                <div className="mt-1 text-sm text-gray-700 line-clamp-1">
                  {bedrooms && bedrooms > 0 && <span className="font-medium">{bedrooms} BHK</span>}
                  {bedrooms && bedrooms > 0 && propertyType ? ' ' : ''}
                  {propertyType && <span>{propertyType}</span>}
                  {listingType && (
                    <span className="text-gray-500"> {listingType === 'rent' ? '· for Rent' : listingType === 'sale' ? '· for Sale' : ''}</span>
                  )}
                </div>
              )}
              {/* Location */}
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="text-sm line-clamp-1 text-uniform">{location}</span>
              </div>
              {/* Meta details row */}
              {(!!bedrooms || !!bathrooms || (!!area && area.trim())) && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-700">
                  {bedrooms ? (
                    <span className="inline-flex items-center text-sm"><Bed size={14} className="mr-1" />{bedrooms} Beds</span>
                  ) : null}
                  {bathrooms ? (
                    <span className="inline-flex items-center text-sm"><Bath size={14} className="mr-1" />{bathrooms} Baths</span>
                  ) : null}
                  {area && area.trim() ? (
                    <span className="inline-flex items-center text-sm"><Square size={14} className="mr-1" />{area}</span>
                  ) : null}
                </div>
              )}
              {/* Footer actions */}
              <div className="mt-3 flex justify-between items-center">
                {showOwnerActions && isOwner ? (
                  // Owner action buttons
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-3 border-gray-200 hover:bg-gray-50 card-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProperty();
                      }}
                    >
                      <Edit2 size={12} className="mr-1" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 text-xs px-3 card-border",
                        rental_status === 'available' 
                          ? "border-red-200 hover:bg-red-50 text-red-600" 
                          : "border-green-200 hover:bg-green-50 text-green-600"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePropertyStatus();
                      }}
                    >
                      {rental_status === 'available' ? (
                        <><ToggleRight size={12} className="mr-1" />Deactivate</>
                      ) : (
                        <><ToggleLeft size={12} className="mr-1" />Activate</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-3 border-yellow-200 hover:bg-yellow-50 text-yellow-600 card-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeProperty();
                      }}
                    >
                      <Crown size={12} className="mr-1" />
                      <span>Go Premium</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 border-gray-200 hover:bg-gray-50 card-border"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContactModal(true);
                    }}
                  >
                    <Phone size={12} className="mr-1" />
                    <span>Contact</span>
                  </Button>
                )}
                <div className="text-lg font-bold text-black">{formatPrice(price)}</div>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-1 truncate text-gray-900 text-xs h-4">{getDisplayTitle()}</h3>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin size={10} className="mr-1 flex-shrink-0" />
                <span className="text-xs line-clamp-1 text-uniform">{location}</span>
              </div>
              <div className="flex justify-between items-end mt-auto">
                {showOwnerActions && isOwner ? (
                  // Owner action buttons for compact view
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 text-xs border-gray-200 hover:bg-gray-50 px-2 py-1 card-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProperty();
                      }}
                    >
                      <Edit2 size={7} className="mr-0.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-5 text-xs px-2 py-1 card-border",
                        rental_status === 'available' 
                          ? "border-red-200 hover:bg-red-50 text-red-600" 
                          : "border-green-200 hover:bg-green-50 text-green-600"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePropertyStatus();
                      }}
                    >
                      {rental_status === 'available' ? (
                        <ToggleRight size={7} />
                      ) : (
                        <ToggleLeft size={7} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 text-xs border-yellow-200 hover:bg-yellow-50 text-yellow-600 px-2 py-1 card-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeProperty();
                      }}
                    >
                      <Crown size={7} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-5 text-xs border-gray-200 hover:bg-gray-50 px-3 py-1 card-border"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContactModal(true);
                    }}
                  >
                    <Phone size={7} className="mr-0.5 sm:mr-0.5 mr-0" />
                    <span className="hidden sm:inline">Contact</span>
                  </Button>
                )}
                <div className="text-xs font-bold text-black">{formatPrice(price)}</div>
              </div>
            </>
          )}
        </CardContent>
      </div>

      <ContactOwnerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        propertyId={id}
        propertyTitle={getDisplayTitle()}
        listingType={listingType}
      />
    </Card>
  );
};

// Memoize PropertyCard to prevent unnecessary re-renders
export default memo(PropertyCard, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.price === nextProps.price &&
    prevProps.rental_status === nextProps.rental_status &&
    prevProps.size === nextProps.size
  );
});
