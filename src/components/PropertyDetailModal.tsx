import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MapPin, 
  Ruler, 
  IndianRupee, 
  Bath, 
  Building, 
  Calendar,
  Eye,
  X,
  Shield
} from 'lucide-react';
import { SecureContactForm } from './SecureContactForm';
import propertyPlaceholder from '@/assets/property-placeholder.png';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  plot_area_unit?: string;
  // Note: owner contact fields removed for security
}

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">{property.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Images */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images.slice(0, 6).map((image, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = propertyPlaceholder;
                    }}
                  />
                </div>
              ))}
              {property.images.length > 6 && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    +{property.images.length - 6} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Home className="h-5 w-5 mr-2 text-brand-red" />
                Property Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{property.property_type.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing:</span>
                  <Badge variant={property.listing_type === 'sale' ? 'default' : 'secondary'}>
                    For {property.listing_type}
                  </Badge>
                </div>
                
                {property.bhk_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">BHK:</span>
                    <span className="font-medium">{property.bhk_type}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Price and Area */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-brand-red" />
                Price & Area
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Price:</span>
                  <span className="font-bold text-brand-red text-lg">
                    ₹{property.expected_price.toLocaleString()}
                  </span>
                </div>
                
                {property.super_area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Super Area:</span>
                    <span className="font-medium">{property.super_area} sqft</span>
                  </div>
                )}
                
                {property.carpet_area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carpet Area:</span>
                    <span className="font-medium">{property.carpet_area} sqft</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="h-5 w-5 mr-2 text-brand-red" />
                Amenities
              </h3>
              
              <div className="space-y-3">
                {property.bathrooms !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                )}
                
                {property.balconies !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balconies:</span>
                    <span className="font-medium">{property.balconies}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-brand-red" />
                Location
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium">{property.city}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Locality:</span>
                  <span className="font-medium">{property.locality}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="font-medium">{property.state}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pincode:</span>
                  <span className="font-medium">{property.pincode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Contact Form */}
          <div className="space-y-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold flex items-center text-green-800">
              <Shield className="h-5 w-5 mr-2" />
              Contact Property Owner
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Send a secure inquiry to the property owner. Your contact information will be shared only with them.
            </p>
            <SecureContactForm 
              propertyId={property.id}
              propertyTitle={property.title}
              listingType={property.listing_type}
            />
          </div>

          {/* Description */}
          {property.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Created Date */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Listed on {new Date(property.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};