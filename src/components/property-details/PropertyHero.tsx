import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Share2, Heart, Image, Phone, CalendarClock, BadgeIndianRupee, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyImageModal } from '@/components/PropertyImageModal';
import { useAuth } from '@/contexts/AuthContext';
import propertyPlaceholder from '@/assets/property-placeholder.png';

interface PropertyHeroProps {
  property: {
    id: string;
    title: string;
    property_type?: string;
    bhk_type?: string;
    super_area?: number;
    carpet_area?: number;
    locality: string;
    city: string;
    state: string;
    expected_price?: number;
    expected_rent?: number;
    expected_deposit?: number;
    listing_type?: string;
    images?: string[];
    status: string;
    user_id?: string;
  };
  onContactOwner: () => void;
  onScheduleVisit: () => void;
  onEMICalculator: () => void;
  onLegalCheck: () => void;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  property,
  onContactOwner,
  onScheduleVisit,
  onEMICalculator,
  onLegalCheck
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is the property owner
  const isOwner = user && property.user_id && user.id === property.user_id;

  // Debug logging for images
  React.useEffect(() => {
    console.log('PropertyHero received property:', property);
    console.log('PropertyHero images array:', property.images);
    console.log('PropertyHero images length:', property.images?.length);
    if (property.images && property.images.length > 0) {
      console.log('First image URL:', property.images[0]);
    }
  }, [property]);

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewAllPhotos = () => {
    setInitialImageIndex(0);
    setShowImageModal(true);
  };

  const handleEditProperty = () => {
    navigate(`/edit-property/${property.id}`);
  };

  const handleViewProperty = () => {
    navigate(`/dashboard?tab=properties&highlight=${property.id}`);
  };
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 hidden sm:block">
        <Link to="/" className="hover:text-[#d21404]">Home</Link>
        <span className="mx-2">›</span>
        <Link to={`/property-search?location=${property.locality}`} className="hover:text-[#d21404]">{property.locality}</Link>
      </nav>

      {/* Title Block - Mobile responsive */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>{property.locality}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 sm:px-3 py-1 text-xs sm:text-sm text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Verified listing</span>
              <span className="sm:hidden">Verified</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-green-50 px-2 sm:px-3 py-1 text-xs sm:text-sm text-green-700 ring-1 ring-green-200">
              Active
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            {property.bhk_type && <span>{property.bhk_type}</span>}
            {(() => {
              const t = property.property_type?.toLowerCase() || '';
              const isPG = t.includes('pg') || t.includes('hostel') || t.includes('coliving');
              return !isPG && property.super_area ? (
                <>
                  <span>•</span>
                  <span>{property.super_area} sqft</span>
                </>
              ) : null;
            })()}
          </div>
        </div>
        
        {/* Action buttons - Mobile responsive */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {/* Owner action buttons */}
          {isOwner && (
            <>
              <Button 
                onClick={handleViewProperty}
                variant="outline" 
                size="sm" 
                className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-2 sm:px-4 py-2 text-gray-800 text-xs sm:text-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                View
              </Button>
              <Button 
                onClick={handleEditProperty}
                variant="outline" 
                size="sm" 
                className="ring-1 ring-blue-300 hover:bg-blue-50 rounded-lg px-2 sm:px-4 py-2 text-blue-800 border-blue-200 text-xs sm:text-sm"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Edit
              </Button>
            </>
          )}
          {/* Public action buttons */}
          <Button variant="outline" size="sm" className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-2 sm:px-4 py-2 text-gray-800 text-xs sm:text-sm">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-2 sm:px-4 py-2 text-gray-800 text-xs sm:text-sm">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Main Grid - Mobile responsive */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Gallery - Mobile first approach */}
        <div className="lg:col-span-2">
          <div className="relative">
            {/* Mobile Gallery Layout */}
            <div className="sm:hidden">
              <div className="relative">
                <img
                  src={property.images?.[0] || propertyPlaceholder}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = propertyPlaceholder;
                  }}
                />
                <button 
                  onClick={handleViewAllPhotos}
                  className="absolute bottom-3 right-3 bg-black/70 text-white rounded-lg px-3 py-1.5 text-sm font-medium backdrop-blur-sm"
                >
                  <Image className="w-4 h-4 mr-1 inline" />
                  {property.images?.length || 1} Photos
                </button>
              </div>
            </div>

            {/* Desktop Gallery Layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-4 gap-2 h-64 md:h-[360px]">
                {/* Primary Image */}
                <div 
                  className="col-span-3 relative cursor-pointer group overflow-hidden rounded-xl"
                  onClick={() => handleImageClick(0)}
                >
                  <img
                    src={property.images?.[0] || propertyPlaceholder}
                    alt={property.title}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = propertyPlaceholder;
                    }}
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <Image className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              
              {/* Secondary Images */}
              <div className="flex flex-col gap-2">
                <div 
                  className="flex-1 relative cursor-pointer group overflow-hidden rounded-xl"
                  onClick={() => handleImageClick(1)}
                >
                  <img
                    src={property.images?.[1] || propertyPlaceholder}
                    alt={`${property.title} - Image 2`}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = propertyPlaceholder;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div 
                  className="flex-1 relative cursor-pointer group overflow-hidden rounded-xl"
                  onClick={() => handleImageClick(2)}
                >
                  <img
                    src={property.images?.[2] || propertyPlaceholder}
                    alt={`${property.title} - Image 3`}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = propertyPlaceholder;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  {/* Show "+X more" overlay if there are more than 3 images */}
                  {property.images && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
                      <div className="text-white text-sm font-semibold">
                        +{property.images.length - 3} more
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* View all photos button - Desktop only */}
            <button 
              onClick={handleViewAllPhotos}
              className="hidden sm:block absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] transition-colors"
            >
              <Image className="w-4 h-4 mr-1 inline" />
              View all photos
            </button>
            </div>
          </div>
        </div>

        {/* Price Card - Mobile responsive */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {(() => {
                  const isPG = property.property_type?.toLowerCase().includes('pg') ||
                               property.property_type?.toLowerCase().includes('hostel') ||
                               property.property_type?.toLowerCase().includes('coliving');
                  const price = isPG ? property.expected_rent : property.expected_price;
                  return price ? `₹${price.toLocaleString()}` : '—';
                })()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {(() => {
                  const isPG = property.property_type?.toLowerCase().includes('pg') ||
                               property.property_type?.toLowerCase().includes('hostel') ||
                               property.property_type?.toLowerCase().includes('coliving');
                  if (isPG) return 'Monthly Rent';
                  return property.listing_type === 'sale' ? 'Total Price' : 'Monthly Rent';
                })()}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Button 
                onClick={onContactOwner}
                className="w-full bg-[#d21404] text-white hover:bg-[#b80f03] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] text-sm sm:text-base"
              >
                Contact Owner
              </Button>
              
              <Button 
                onClick={onScheduleVisit}
                variant="outline"
                className="w-full ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-gray-800 text-sm sm:text-base"
              >
                <CalendarClock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Schedule Visit
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={onEMICalculator}
                  variant="link"
                  className="flex-1 text-[#d21404] hover:underline text-xs sm:text-sm px-2"
                >
                  <BadgeIndianRupee className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">EMI Calculator</span>
                  <span className="sm:hidden">EMI</span>
                </Button>
                <Link 
                  to="/legal-services"
                  className="flex-1 text-[#d21404] hover:underline text-xs sm:text-sm text-center py-2"
                >
                  <span className="hidden sm:inline">Legal Check</span>
                  <span className="sm:hidden">Legal</span>
                </Link>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Phone className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Safe calls via Home HNI</span>
                <span className="sm:hidden">Safe calls</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      {property.images && (
        <PropertyImageModal
          images={property.images}
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          initialIndex={initialImageIndex}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
};