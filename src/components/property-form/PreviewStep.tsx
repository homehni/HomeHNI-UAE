import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyFormData } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bed, Bath, Square, Calendar, IndianRupee, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreviewStepProps {
  formData: any;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting = false
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const { ownerInfo, propertyInfo } = formData;
  
  // Extract nested data for easier access
  const propertyDetails = propertyInfo?.propertyDetails || {};
  const locationDetails = propertyInfo?.locationDetails || {};
  const rentalDetails = propertyInfo?.rentalDetails || propertyInfo?.flattmatesDetails || {};
  const amenities = propertyInfo?.amenities || {};
  const gallery = propertyInfo?.gallery || {};
  const additionalInfo = propertyInfo?.additionalInfo || {};

  // Debug: Log the amenities data
  console.log('PreviewStep amenities data:', amenities);

  const handleSubmit = () => {
    onSubmit();
    setShowThankYou(true);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatAmenityValue = (key: string, value: string) => {
    const amenityLabels: { [key: string]: { [value: string]: string } } = {
      powerBackup: {
        'full': 'Full Power Backup',
        'partial': 'Partial Power Backup',
        'dg-backup': 'DG Backup',
        'no-backup': 'No Power Backup'
      },
      lift: {
        'available': 'Lift Available',
        'not-available': 'No Lift'
      },
      parking: {
        'bike': 'Bike Parking',
        'car': 'Car Parking',
        'both': 'Both Bike & Car Parking',
        'none': 'No Parking'
      },
      waterStorageFacility: {
        'overhead-tank': 'Overhead Tank',
        'underground-tank': 'Underground Tank',
        'both': 'Both Overhead & Underground',
        'borewell': 'Borewell',
        'none': 'No Water Storage'
      },
      security: {
        'yes': 'Security Available',
        'no': 'No Security'
      },
      wifi: {
        'available': 'WiFi Available',
        'not-available': 'No WiFi'
      },
      currentPropertyCondition: {
        'excellent': 'Excellent Condition',
        'good': 'Good Condition',
        'average': 'Average Condition',
        'needs-renovation': 'Needs Renovation'
      }
    };

    return amenityLabels[key]?.[value] || value;
  };

  const getSelectedAmenities = () => {
    const selectedAmenities: string[] = [];
    
    Object.entries(amenities).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        const formattedValue = formatAmenityValue(key, value);
        // Only show amenities that are positive (not "No" or "None" options)
        if (formattedValue && 
            !formattedValue.includes('No ') && 
            !formattedValue.includes('None') &&
            !formattedValue.includes('not-available') &&
            !formattedValue.includes('no-backup')) {
          selectedAmenities.push(formattedValue);
        }
      }
    });

    return selectedAmenities;
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-primary">Preview Your Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Images */}
          {gallery?.images && gallery.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.images.slice(0, 6).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {gallery.images.length > 6 && (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">+{gallery.images.length - 6} more</span>
                </div>
              )}
            </div>
          )}

          {/* Property Title & Price */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{propertyDetails?.title || 'Untitled Property'}</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {rentalDetails?.expectedPrice && formatPrice(rentalDetails.expectedPrice)}
              </span>
              <Badge variant="secondary" className="text-sm">
                For {rentalDetails?.listingType || 'Rent'}
              </Badge>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyDetails?.bhkType && (
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <span>{propertyDetails.bhkType}</span>
              </div>
            )}
            {propertyDetails?.bathrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{propertyDetails.bathrooms} Bathrooms</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-muted-foreground" />
              <span>{propertyDetails?.superBuiltUpArea || 0} sqft</span>
            </div>
            {propertyDetails?.balconies !== undefined && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{propertyDetails.balconies} Balconies</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{locationDetails?.locality || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">
                {locationDetails?.landmark ? 
                  (locationDetails.landmark.toLowerCase().startsWith('near') ? 
                    locationDetails.landmark : 
                    `Near ${locationDetails.landmark}`) : 
                  'Location details'}
              </p>
            </div>
          </div>

          {/* What You Get */}
          {getSelectedAmenities().length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What You Get</h3>
              <div className="flex flex-wrap gap-2">
                {getSelectedAmenities().map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {additionalInfo?.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{additionalInfo.description}</p>
            </div>
          )}

          {/* Owner Information */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Contact Information</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{ownerInfo?.fullName}</p>
                <p className="text-sm text-muted-foreground">{ownerInfo?.role}</p>
              </div>
              <div>
                <p className="text-sm">{ownerInfo?.phoneNumber}</p>
                <p className="text-sm">{ownerInfo?.email}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <div className="space-x-4">
              <Button variant="ghost" onClick={() => onEdit(2)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Info
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Listing'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your property has been published successfully and is now live on the platform!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};