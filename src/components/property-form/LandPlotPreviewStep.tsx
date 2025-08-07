import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LandPlotFormData } from '@/types/landPlotProperty';
import { MapPin, Home, DollarSign, Calendar, FileText, Camera } from 'lucide-react';

interface LandPlotPreviewStepProps {
  formData: LandPlotFormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const LandPlotPreviewStep: React.FC<LandPlotPreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting,
}) => {
  const { ownerInfo, propertyInfo } = formData;
  const { plotDetails, locationDetails, saleDetails, amenities, gallery, additionalInfo, scheduleInfo } = propertyInfo;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Preview Your Listing
        </CardTitle>
        <p className="text-gray-600">
          Review all details before submitting your land/plot listing
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Overview */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{plotDetails.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{plotDetails.landType}</Badge>
            <Badge variant="outline">{plotDetails.plotArea} {plotDetails.plotAreaUnit}</Badge>
            <Badge variant="outline">{saleDetails.ownershipType}</Badge>
            {plotDetails.cornerPlot && <Badge variant="outline">Corner Plot</Badge>}
            {plotDetails.gatedCommunity && <Badge variant="outline">Gated Community</Badge>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>{locationDetails.locality}, {locationDetails.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>{formatPrice(saleDetails.expectedPrice || 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <span>₹{saleDetails.pricePerUnit || 0} per {plotDetails.plotAreaUnit}</span>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {ownerInfo.fullName}
            </div>
            <div>
              <span className="font-medium">Role:</span> {ownerInfo.role}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {ownerInfo.phoneNumber}
            </div>
            <div>
              <span className="font-medium">Email:</span> {ownerInfo.email}
            </div>
          </div>
        </div>

        {/* Plot Details */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Plot Details</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Plot Area:</span> {plotDetails.plotArea} {plotDetails.plotAreaUnit}
            </div>
            <div>
              <span className="font-medium">Land Type:</span> {plotDetails.landType}
            </div>
            <div>
              <span className="font-medium">Plot Shape:</span> {plotDetails.plotShape}
            </div>
            <div>
              <span className="font-medium">Road Facing:</span> {plotDetails.roadFacing}
            </div>
            <div>
              <span className="font-medium">Road Width:</span> {plotDetails.roadWidth} feet
            </div>
            <div>
              <span className="font-medium">Boundary Wall:</span> {plotDetails.boundaryWall}
            </div>
            {plotDetails.plotLength && plotDetails.plotWidth && (
              <>
                <div>
                  <span className="font-medium">Dimensions:</span> {plotDetails.plotLength} × {plotDetails.plotWidth} feet
                </div>
              </>
            )}
            {plotDetails.surveyNumber && (
              <div>
                <span className="font-medium">Survey Number:</span> {plotDetails.surveyNumber}
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Address:</span> {locationDetails.address}
            </div>
            <div>
              <span className="font-medium">City:</span> {locationDetails.city}, {locationDetails.state} - {locationDetails.pincode}
            </div>
            {locationDetails.landmark && (
              <div>
                <span className="font-medium">Landmark:</span> {locationDetails.landmark}
              </div>
            )}
          </div>
        </div>

        {/* Sale Details */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Sale Details</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Expected Price:</span> {formatPrice(saleDetails.expectedPrice || 0)}
            </div>
            <div>
              <span className="font-medium">Price per {plotDetails.plotAreaUnit}:</span> ₹{saleDetails.pricePerUnit}
            </div>
            <div>
              <span className="font-medium">Ownership Type:</span> {saleDetails.ownershipType}
            </div>
            <div>
              <span className="font-medium">Negotiable:</span> {saleDetails.priceNegotiable ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Clear Titles:</span> {saleDetails.clearTitles ? 'Yes' : 'No'}
            </div>
            {saleDetails.possessionDate && (
              <div>
                <span className="font-medium">Available From:</span> {saleDetails.possessionDate}
              </div>
            )}
          </div>
          {saleDetails.approvedBy && saleDetails.approvedBy.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Approvals:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {saleDetails.approvedBy.map((approval, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {approval}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Infrastructure & Amenities */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Infrastructure & Amenities</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Water Connection:</span> {amenities.waterConnection}
            </div>
            <div>
              <span className="font-medium">Electricity:</span> {amenities.electricityConnection}
            </div>
            <div>
              <span className="font-medium">Road Connectivity:</span> {amenities.roadConnectivity}
            </div>
            <div>
              <span className="font-medium">Drainage:</span> {amenities.drainage}
            </div>
          </div>
        </div>

        {/* Gallery Information */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos & Videos
            </h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(5)}>
              Edit
            </Button>
          </div>
          <div className="text-sm">
            <div>
              <span className="font-medium">Images:</span> {gallery.images?.length || 0} photos uploaded
            </div>
            {gallery.video && (
              <div>
                <span className="font-medium">Videos:</span> 1 video uploaded
              </div>
            )}
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Viewing Schedule
            </h3>
            <Button variant="outline" size="sm" onClick={() => onEdit(7)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Availability:</span> {scheduleInfo.availability}
            </div>
            <div>
              <span className="font-medium">All Day:</span> {scheduleInfo.availableAllDay ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ready to Submit?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please review all the information above. Once you submit, your land/plot listing will be reviewed and published on our platform.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> After submission, our team will review your listing within 24 hours. 
              You'll receive a confirmation email once your plot is live on the platform.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};