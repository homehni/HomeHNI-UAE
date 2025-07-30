import React, { useState } from 'react';
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-primary">Preview Your Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Images */}
          {propertyInfo?.images && propertyInfo.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {propertyInfo.images.slice(0, 6).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {propertyInfo.images.length > 6 && (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">+{propertyInfo.images.length - 6} more</span>
                </div>
              )}
            </div>
          )}

          {/* Property Title & Price */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{propertyInfo?.title}</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {propertyInfo?.expectedPrice && formatPrice(propertyInfo.expectedPrice)}
              </span>
              <Badge variant="secondary" className="text-sm">
                For {propertyInfo?.listingType}
              </Badge>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyInfo?.bhkType && (
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <span>{propertyInfo.bhkType}</span>
              </div>
            )}
            {propertyInfo?.bathrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{propertyInfo.bathrooms} Bathrooms</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-muted-foreground" />
              <span>{propertyInfo?.superArea} sqft</span>
            </div>
            {propertyInfo?.balconies !== undefined && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{propertyInfo.balconies} Balconies</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{propertyInfo?.locality}, {propertyInfo?.city}</p>
              <p className="text-sm text-muted-foreground">
                {propertyInfo?.state} - {propertyInfo?.pincode}
              </p>
            </div>
          </div>

          {/* Description */}
          {propertyInfo?.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{propertyInfo.description}</p>
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
              Your property has been submitted and is under review. It will be published within 4 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};