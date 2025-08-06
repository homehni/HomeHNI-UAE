import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalePropertyFormData } from '@/types/saleProperty';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bed, Bath, Square, Calendar, IndianRupee, Edit, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ResalePreviewStepProps {
  formData: SalePropertyFormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ResalePreviewStep: React.FC<ResalePreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting = false
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const { ownerInfo, propertyInfo } = formData;

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

  return (
    <>
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-primary">Preview Your Property Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Property Images */}
            {propertyInfo?.gallery?.images && propertyInfo.gallery.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyInfo.gallery.images.slice(0, 6).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {propertyInfo.gallery.images.length > 6 && (
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">+{propertyInfo.gallery.images.length - 6} more</span>
                  </div>
                )}
              </div>
            )}

            {/* Property Title & Price */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{propertyInfo?.propertyDetails?.bhkType} {propertyInfo?.propertyDetails?.propertyType} for Sale</h2>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {propertyInfo?.saleDetails?.expectedPrice && formatPrice(propertyInfo.saleDetails.expectedPrice)}
                </span>
                <Badge variant="secondary" className="text-sm">
                  For Sale
                </Badge>
                {propertyInfo?.saleDetails?.priceNegotiable && (
                  <Badge variant="outline" className="text-sm">
                    Negotiable
                  </Badge>
                )}
              </div>
              {propertyInfo?.saleDetails?.pricePerSqFt && (
                <p className="text-sm text-muted-foreground">
                  ₹{propertyInfo.saleDetails.pricePerSqFt.toLocaleString()}/sq ft
                </p>
              )}
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyInfo?.propertyDetails?.bhkType && (
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span>{propertyInfo.propertyDetails.bhkType}</span>
                </div>
              )}
              {propertyInfo?.propertyDetails?.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{propertyInfo.propertyDetails.bathrooms} Bathrooms</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Square className="h-5 w-5 text-muted-foreground" />
                <span>{propertyInfo?.propertyDetails?.superBuiltUpArea} sq ft</span>
              </div>
              {propertyInfo?.propertyDetails?.balconies !== undefined && (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span>{propertyInfo.propertyDetails.balconies} Balconies</span>
                </div>
              )}
            </div>

            {/* Additional Property Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Property Age</p>
                <p className="font-medium">{propertyInfo?.saleDetails?.propertyAge}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{propertyInfo?.propertyDetails?.floorNo} of {propertyInfo?.propertyDetails?.totalFloors}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{propertyInfo?.saleDetails?.registrationStatus?.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{propertyInfo?.locationDetails?.locality}, {propertyInfo?.locationDetails?.city}</p>
                <p className="text-sm text-muted-foreground">
                  {propertyInfo?.locationDetails?.state} - {propertyInfo?.locationDetails?.pincode}
                </p>
                {propertyInfo?.locationDetails?.societyName && (
                  <p className="text-sm text-muted-foreground">{propertyInfo.locationDetails.societyName}</p>
                )}
              </div>
            </div>

            {/* Sale Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Sale Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyInfo?.saleDetails?.possessionDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Possession Date</p>
                    <p className="font-medium">{new Date(propertyInfo.saleDetails.possessionDate).toLocaleDateString()}</p>
                  </div>
                )}
                {propertyInfo?.saleDetails?.homeLoanAvailable && (
                  <div>
                    <p className="text-sm text-muted-foreground">Home Loan</p>
                    <p className="font-medium">Available</p>
                  </div>
                )}
                {propertyInfo?.saleDetails?.maintenanceCharges && (
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="font-medium">₹{propertyInfo.saleDetails.maintenanceCharges.toLocaleString()}/month</p>
                  </div>
                )}
                {propertyInfo?.saleDetails?.bookingAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Amount</p>
                    <p className="font-medium">₹{propertyInfo.saleDetails.bookingAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {propertyInfo?.additionalInfo?.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{propertyInfo.additionalInfo.description}</p>
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
                  Edit Property
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
      </div>

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your property has been submitted for sale and is under review. It will be published within 4 hours.
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