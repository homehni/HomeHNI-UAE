
import { Heart, MapPin, Bed, Bath, Square, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  isNew = false
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
  const propertyForPage = {
    id,
    title,
    property_type: propertyType.toLowerCase().replace(/\s+/g, '_'),
    listing_type: 'sale',
    bhk_type: bedrooms ? `${bedrooms} BHK` : undefined,
    expected_price: parsePriceToNumber(price),
    super_area: parseAreaToNumber(area),
    bathrooms,
    city: parts[parts.length - 1] || 'N/A',
    locality: parts[0] || location,
    state: 'N/A',
    pincode: 'N/A',
    description: undefined,
    images: [`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=80`],
    videos: [],
    status: 'active',
    created_at: new Date().toISOString(),
    owner_name: undefined,
    owner_email: undefined,
    owner_phone: undefined,
    owner_role: undefined
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=400&q=80`}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
        >
          <Heart size={16} />
        </Button>
        {isNew && (
          <div className="absolute top-2 left-2 bg-brand-maroon text-white px-2 py-1 rounded text-xs font-semibold">
            New
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-brand-red text-white px-2 py-1 rounded text-xs">
          {propertyType}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl font-bold text-brand-red">{price}</div>
          <div className="text-sm text-gray-600">{area}</div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-gray-600">
          <div className="flex items-center">
            <Bed size={16} className="mr-1" />
            <span className="text-sm">{bedrooms} BHK</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span className="text-sm">{bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span className="text-sm">{area}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone size={14} className="mr-1" />
            Contact
          </Button>
          <Button size="sm" className="flex-1 bg-brand-maroon hover:bg-brand-maroon-dark" onClick={() => navigate(`/property/${id}`, { state: propertyForPage })}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
