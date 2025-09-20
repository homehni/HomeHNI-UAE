import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Building, MapPin, IndianRupee, Sparkles, Camera, Calendar } from 'lucide-react';
import { CommercialPropertyDetails, LocationDetails, CommercialRentalDetails, CommercialAmenities, PropertyGallery, ScheduleInfo } from '@/types/property';

interface CommercialPreviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  propertyDetails: Partial<CommercialPropertyDetails>;
  locationDetails: Partial<LocationDetails>;
  rentalDetails: Partial<CommercialRentalDetails>;
  amenities: Partial<CommercialAmenities>;
  gallery: Partial<PropertyGallery>;
  scheduleInfo: Partial<ScheduleInfo>;
}

export const CommercialPreviewStep = ({
  onBack,
  onSubmit,
  currentStep,
  totalSteps,
  isSubmitting,
  propertyDetails,
  locationDetails,
  rentalDetails,
  amenities,
  gallery,
  scheduleInfo
}: CommercialPreviewStepProps) => {
  const completedSteps = [
    { icon: Building, label: 'Property Details', description: 'Commercial space details added' },
    { icon: MapPin, label: 'Locality Details', description: 'Location information provided' },
    { icon: IndianRupee, label: 'Rental Details', description: 'Pricing and terms configured' },
    { icon: Sparkles, label: 'Amenities', description: 'Amenities and facilities listed' },
    { icon: Camera, label: 'Gallery', description: 'Photos and videos uploaded' },
    { icon: Calendar, label: 'Schedule', description: 'Contact schedule set' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to Submit Your Commercial Property
        </h2>
        <p className="text-gray-600">
          Review your property details below and submit when ready.
        </p>
      </div>

      {/* Property Details Preview */}
      <div className="space-y-6 mb-8">
        {/* Basic Details */}
        {propertyDetails.title && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Property Title</p>
                <p className="font-medium">{propertyDetails.title}</p>
              </div>
              {propertyDetails.propertyType && (
                <div>
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-medium">{propertyDetails.propertyType}</p>
                </div>
              )}
              {propertyDetails.spaceType && (
                <div>
                  <p className="text-sm text-gray-600">Space Type</p>
                  <p className="font-medium">{propertyDetails.spaceType}</p>
                </div>
              )}
              {propertyDetails.superBuiltUpArea && (
                <div>
                  <p className="text-sm text-gray-600">Super Built-up Area</p>
                  <p className="font-medium">{propertyDetails.superBuiltUpArea} sq ft</p>
                </div>
              )}
              {propertyDetails.buildingType && (
                <div>
                  <p className="text-sm text-gray-600">Building Type</p>
                  <p className="font-medium">{propertyDetails.buildingType}</p>
                </div>
              )}
              {propertyDetails.powerLoad && (
                <div>
                  <p className="text-sm text-gray-600">Power Load</p>
                  <p className="font-medium">{propertyDetails.powerLoad}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Details */}
        {(locationDetails.locality || locationDetails.city) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationDetails.locality && (
                <div>
                  <p className="text-sm text-gray-600">Locality</p>
                  <p className="font-medium">{locationDetails.locality}</p>
                </div>
              )}
              {locationDetails.city && (
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-medium">{locationDetails.city}</p>
                </div>
              )}
              {locationDetails.societyName && (
                <div>
                  <p className="text-sm text-gray-600">Society/Building Name</p>
                  <p className="font-medium">{locationDetails.societyName}</p>
                </div>
              )}
              {locationDetails.pincode && (
                <div>
                  <p className="text-sm text-gray-600">Pincode</p>
                  <p className="font-medium">{locationDetails.pincode}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rental Details */}
        {(rentalDetails.expectedPrice || rentalDetails.securityDeposit) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Rental Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rentalDetails.expectedPrice && (
                <div>
                  <p className="text-sm text-gray-600">Expected Rent</p>
                  <p className="font-medium">₹{rentalDetails.expectedPrice}/month</p>
                </div>
              )}
              {rentalDetails.securityDeposit && (
                <div>
                  <p className="text-sm text-gray-600">Security Deposit</p>
                  <p className="font-medium">₹{rentalDetails.securityDeposit}</p>
                </div>
              )}
              {rentalDetails.maintenanceCharges && (
                <div>
                  <p className="text-sm text-gray-600">Maintenance</p>
                  <p className="font-medium">₹{rentalDetails.maintenanceCharges}/month</p>
                </div>
              )}
              {rentalDetails.availableFrom && (
                <div>
                  <p className="text-sm text-gray-600">Available From</p>
                  <p className="font-medium">{rentalDetails.availableFrom}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.images && gallery.images.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Property Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.images.slice(0, 8).map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {gallery.images.length > 8 && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-600">+{gallery.images.length - 8} more</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your property will be reviewed by our team</li>
          <li>• Once approved, it will be live on the platform</li>
          <li>• You'll start receiving inquiries from potential tenants</li>
          <li>• We'll send you notifications for all activities</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-white hover:bg-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Property Listing'}
        </Button>
      </div>
    </div>
  );
};