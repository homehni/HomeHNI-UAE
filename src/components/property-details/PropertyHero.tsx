import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Share2, Heart, Image, Phone, CalendarClock, BadgeIndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyImageModal } from '@/components/PropertyImageModal';

interface PropertyHeroProps {
  property: {
    id: string;
    title: string;
    bhk_type?: string;
    super_area?: number;
    carpet_area?: number;
    locality: string;
    city: string;
    state: string;
    expected_price: number;
    listing_type: string;
    images?: string[];
    status: string;
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

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowImageModal(true);
  };

  const handleViewAllPhotos = () => {
    setInitialImageIndex(0);
    setShowImageModal(true);
  };
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-[#d21404]">Home</Link>
        <span className="mx-2">›</span>
        <Link to={`/property-search?city=${property.city}`} className="hover:text-[#d21404]">{property.city}</Link>
        <span className="mx-2">›</span>
        <Link to={`/property-search?locality=${property.locality}`} className="hover:text-[#d21404]">{property.locality}</Link>
      </nav>

      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.locality}, {property.city}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified listing
            </div>
            <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm text-green-700 ring-1 ring-green-200">
              Active
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {property.bhk_type && <span>{property.bhk_type}</span>}
            {property.super_area && (
              <>
                <span>•</span>
                <span>{property.super_area} sqft</span>
              </>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 text-gray-800">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 text-gray-800">
            <Heart className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Gallery */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="grid grid-cols-4 gap-2 h-64 md:h-[360px]">
              {/* Primary Image */}
              <div 
                className="col-span-3 relative cursor-pointer group"
                onClick={() => handleImageClick(0)}
              >
                  <img
                    src={property.images?.[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-xl transition-opacity group-hover:opacity-90"
                    loading="lazy"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center rounded-xl">
                  <Image className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              
              {/* Secondary Images */}
              <div className="flex flex-col gap-2">
                <div 
                  className="flex-1 relative cursor-pointer group"
                  onClick={() => handleImageClick(1)}
                >
                  <img
                    src={property.images?.[1] || '/placeholder.svg'}
                    alt={`${property.title} - Image 2`}
                    className="w-full h-full object-cover rounded-xl transition-opacity group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center rounded-xl">
                    <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div 
                  className="flex-1 relative cursor-pointer group"
                  onClick={() => handleImageClick(2)}
                >
                  <img
                    src={property.images?.[2] || '/placeholder.svg'}
                    alt={`${property.title} - Image 3`}
                    className="w-full h-full object-cover rounded-xl transition-opacity group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center rounded-xl">
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
            
            {/* View all photos button */}
            <button 
              onClick={handleViewAllPhotos}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404] transition-colors"
            >
              <Image className="w-4 h-4 mr-1 inline" />
              View all photos
            </button>
          </div>
        </div>

        {/* Sticky Price Card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{property.expected_price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {property.listing_type === 'sale' ? 'Total Price' : 'Monthly Rent'}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onContactOwner}
                className="w-full bg-[#d21404] text-white hover:bg-[#b80f03] rounded-lg px-4 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d21404]"
              >
                Contact Owner
              </Button>
              
              <Button 
                onClick={onScheduleVisit}
                variant="outline"
                className="w-full ring-1 ring-gray-300 hover:bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
              >
                <CalendarClock className="w-4 h-4 mr-2" />
                Schedule Visit
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={onEMICalculator}
                  variant="link"
                  className="flex-1 text-[#d21404] hover:underline text-sm"
                >
                  <BadgeIndianRupee className="w-4 h-4 mr-1" />
                  EMI Calculator
                </Button>
                <Link 
                  to="/legal-services"
                  className="flex-1 text-[#d21404] hover:underline text-sm text-center py-2"
                >
                  Legal Check
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Phone className="w-3 h-3 mr-1" />
                Safe calls via Home HNI
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