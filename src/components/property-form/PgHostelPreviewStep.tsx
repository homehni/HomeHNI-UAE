import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, CheckCircle, Users, Calendar, Car, Clock, Utensils, Key, Shield, Zap, Droplets, Heart, ForkKnife } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Utility function to convert 24-hour format to 12-hour format
const convertTo12HourFormat = (time24: string): string => {
  if (!time24 || time24 === 'Not Provided') {
    return 'Not Provided';
  }
  
  // Handle time format like "23:00" or "09:30"
  const timeMatch = time24.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeMatch) {
    return time24; // Return as-is if format doesn't match
  }
  
  const hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2];
  
  if (hours === 0) {
    return `12:${minutes} AM`;
  } else if (hours < 12) {
    return `${hours}:${minutes} AM`;
  } else if (hours === 12) {
    return `12:${minutes} PM`;
  } else {
    return `${hours - 12}:${minutes} PM`;
  }
};

interface PgHostelPreviewStepProps {
  formData: {
    ownerInfo: any;
    propertyInfo: any;
    roomTypes: any;
    roomDetails: any;
    localityDetails: any;
    pgDetails: any;
    amenities: any;
    gallery: any;
    scheduleInfo: any;
  };
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  previewPropertyId?: string;
}

export const PgHostelPreviewStep: React.FC<PgHostelPreviewStepProps> = ({
  formData,
  onBack,
  onSubmit,
  isSubmitting,
  previewPropertyId
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ownerInfo, propertyInfo, roomTypes, roomDetails, localityDetails, pgDetails, amenities, gallery, scheduleInfo } = formData;
  
  // Get PG details (from form data)
  const pgDetailsData = pgDetails || (formData as any)?.additional_info;
  
  // Get room amenities (from form data)
  const roomAmenitiesData = roomDetails?.roomAmenities || (formData as any)?.additional_info?.room_amenities;

  const handleSubmit = () => {
    onSubmit();
    setShowSuccess(true);
  };

  const handlePreviewListing = () => {
    console.log('PgHostelPreviewStep handlePreviewListing called');
    console.log('previewPropertyId:', previewPropertyId);
    console.log('formData:', formData);
    
    if (previewPropertyId) {
      console.log('Opening preview page:', `/buy/preview/${previewPropertyId}/detail`);
      // Use the unified preview page instead of separate property page
      window.open(`/buy/preview/${previewPropertyId}/detail`, '_blank');
    } else {
      console.log('No previewPropertyId, creating preview URL with form data');
      // Create a temporary preview URL with form data
      const previewData = encodeURIComponent(JSON.stringify(formData));
      const previewUrl = `/preview?data=${previewData}&type=pg-hostel`;
      console.log('Opening preview URL:', previewUrl);
      window.open(previewUrl, '_blank');
    }
  };

  const hasPhotos = gallery?.images && gallery.images.length > 0;

  // Generate property title
  const generatePropertyTitle = () => {
    const propertyType = propertyInfo?.propertyType || 'PG/Hostel';
    const roomType = roomTypes?.selectedTypes?.[0] || 'single';
    const roomTypeMap = {
      'single': 'Single',
      'double': 'Double', 
      'three': 'Three',
      'four': 'Four'
    };
    const formattedRoomType = roomTypeMap[roomType as keyof typeof roomTypeMap] || 'Single';
    return `${formattedRoomType} ${propertyType} Property`;
  };

  // Get the first room type details for pricing
  const getFirstRoomTypeDetails = () => {
    const firstRoomType = roomTypes?.selectedTypes?.[0];
    if (firstRoomType && roomDetails?.roomTypeDetails?.[firstRoomType]) {
      return roomDetails.roomTypeDetails[firstRoomType];
    }
    
    // Fallback: try to get rent/deposit from formData
    const fallbackRent = (formData as any)?.expected_rent || (formData as any)?.additional_info?.expected_rent || 0;
    const fallbackDeposit = (formData as any)?.expected_deposit || (formData as any)?.additional_info?.expected_deposit || 0;
    
    return { 
      expectedRent: fallbackRent, 
      expectedDeposit: fallbackDeposit 
    };
  };

  const firstRoomDetails = getFirstRoomTypeDetails();
  
  // Debug logging
  console.log('PgHostelPreviewStep - Debug data:', {
    roomTypes: roomTypes,
    roomDetails: roomDetails,
    formData: formData,
    firstRoomDetails: firstRoomDetails,
    expected_rent: (formData as any)?.expected_rent,
    additional_info: (formData as any)?.additional_info,
    amenities: JSON.stringify(amenities, null, 2),
    pgDetailsData: pgDetailsData,
    services: {
      laundry: amenities?.laundry,
      roomCleaning: amenities?.roomCleaning,
      wardenFacility: amenities?.wardenFacility
    }
  });

  // Format amenities for display
  const getAmenitiesList = () => {
    const amenityList = [];
    
    // Room amenities (from form data or additional_info)
    if (roomAmenitiesData) {
      if (roomAmenitiesData.cupboard) amenityList.push('Cupboard');
      if (roomAmenitiesData.geyser) amenityList.push('Geyser');
      if (roomAmenitiesData.tv) amenityList.push('TV');
      if (roomAmenitiesData.ac) amenityList.push('AC');
      if (roomAmenitiesData.bedding) amenityList.push('Bedding');
      if (roomAmenitiesData.attachedBathroom) amenityList.push('Attached Bathroom');
    }

    // Property amenities
    if (amenities) {
      if (amenities.powerBackup === 'yes') amenityList.push('Power Backup');
      if (amenities.lift === 'yes') amenityList.push('Lift');
      if (amenities.parking === 'yes') amenityList.push('Parking');
      if (amenities.waterStorageFacility === 'yes') amenityList.push('Water Storage');
      if (amenities.security === 'yes') amenityList.push('Security');
      if (amenities.wifi === 'yes') amenityList.push('WiFi');
    }

    return amenityList;
  };

  const amenitiesList = getAmenitiesList();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Preview Your PG/Hostel Listing</h2>
        <p className="text-muted-foreground">Review your property details before publishing</p>
      </div>

      {/* Preview Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section */}
          <div className="bg-white p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{generatePropertyTitle()}</h1>
                  <p className="text-gray-600">
                    {localityDetails?.locality && `${localityDetails.locality}, `}
                    {localityDetails?.city && `${localityDetails.city}, `}
                    {localityDetails?.state && `${localityDetails.state}`}
                    {localityDetails?.pincode && ` ${localityDetails.pincode}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{firstRoomDetails.expectedRent?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">₹{firstRoomDetails.expectedDeposit?.toLocaleString()} Deposit</div>
                <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                  Apply Loan
                </Button>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="p-6">
            {hasPhotos ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {gallery.images.slice(0, 2).map((image: any, index: number) => (
                  <div key={index} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={typeof image === 'string' ? image : image.url} 
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-3 left-3">
                        <Button size="sm" variant="secondary" className="bg-gray-800 text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          Photos
                        </Button>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Button size="sm" variant="secondary" className="bg-gray-800 text-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-600">No photos uploaded</p>
                <p className="text-sm text-gray-500">Add photos to make your listing more attractive</p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {pgDetailsData?.gender_preference === 'anyone' ? 'Any Preferred Tenant' : 
                     pgDetailsData?.gender_preference === 'male' ? 'Male Preferred' : 'Female Preferred'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {scheduleInfo?.postedOn ? new Date(scheduleInfo.postedOn).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Recently Posted'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Car className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {amenities?.parking === 'yes' ? 'Parking Available' : 'No Parking'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {pgDetailsData?.available_from ? 'Available From ' + new Date(pgDetailsData.available_from).toLocaleDateString('en-IN') : 'Immediately Available'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Utensils className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {pgDetailsData?.food_included === 'yes' ? 'Food Available' : 'Not Available Food Facility'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Key className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {pgDetailsData?.gate_closing_time ? `${convertTo12HourFormat(pgDetailsData.gate_closing_time)} Gate Closing Time` : 'Not Provided Gate Closing Time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Contact
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Schedule Visit
              </Button>
            </div>

            {/* Report Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-3">Report what was not correct in this property</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                  Listed by Broker
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                  Rented Out
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                  Wrong Info
                </Button>
              </div>
            </div>

            {/* Overview Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2 inline-block">
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {amenities?.powerBackup === 'yes' ? 'Available' : 'Not Available'}
                    </div>
                    <div className="text-xs text-gray-500">Power Backup</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Droplets className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {roomAmenitiesData?.attachedBathroom ? 'Attached' : 'Shared'}
                    </div>
                    <div className="text-xs text-gray-500">Washrooms</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {pgDetailsData?.pg_rules?.noNonVeg ? 'No' : 'Yes'}
                    </div>
                    <div className="text-xs text-gray-500">Pet Allowed</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {amenities?.security === 'yes' ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-500">Gated Security</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <ForkKnife className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {pgDetailsData?.pg_rules?.noNonVeg ? 'No' : 'Yes'}
                    </div>
                    <div className="text-xs text-gray-500">Non-Veg Allowed</div>
                  </div>
                </div>

                {/* Services Section */}
                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Droplets className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {amenities?.laundry === 'yes' ? 'Available' : 'Not Available'}
                    </div>
                    <div className="text-xs text-gray-500">Laundry Service</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {amenities?.roomCleaning === 'yes' ? 'Daily' : 'Self Service'}
                    </div>
                    <div className="text-xs text-gray-500">Room Cleaning</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {amenities?.wardenFacility === 'yes' ? 'Available' : 'Not Available'}
                    </div>
                    <div className="text-xs text-gray-500">Warden Facility</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            {amenitiesList.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-red-600 pb-2 inline-block">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <div className="text-sm font-medium text-gray-900">{amenity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handlePreviewListing}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Listing</span>
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Property'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Published Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your PG/Hostel property has been published and is now visible to potential tenants.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/post-property')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Post Another Property
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
