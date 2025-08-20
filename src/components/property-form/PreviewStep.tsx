import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyFormData } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bed, Bath, Square, Calendar, IndianRupee, Edit, Building, Sparkles, Camera, FileText, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreviewStepProps {
  formData: any;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting = false,
  currentStep = 8,
  totalSteps = 8
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

  const steps = [
    { number: 1, title: "Property Details", icon: Home, active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Location Details", icon: MapPin, active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "Rental Details", icon: Building, active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: "Amenities", icon: Sparkles, active: currentStep === 4, completed: currentStep > 4 },
    { number: 5, title: "Photos & Videos", icon: Camera, active: currentStep === 5, completed: currentStep > 5 },
    { number: 6, title: "Additional Info", icon: FileText, active: currentStep === 6, completed: currentStep > 6 },
    { number: 7, title: "Schedule", icon: Calendar, active: currentStep === 7, completed: currentStep > 7 },
    { number: 8, title: "Preview & Submit", icon: Clock, active: currentStep === 8, completed: currentStep > 8 },
  ];

  return (
    <>
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-52 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      step.active 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                        : step.completed 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-gray-500'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.active 
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : step.completed 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-gray-300 bg-white'
                    }`}>
                      {step.completed ? (
                        <span className="text-xs">✓</span>
                      ) : (
                        <span className="text-xs">{step.number}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </nav>
            
            {/* Help Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-sm text-gray-900 mb-2">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-3">
                Contact our support team for assistance with your property listing.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
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
                  <Button onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};