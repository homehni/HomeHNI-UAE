import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, Camera, Shield, Star, Facebook, Tag, ArrowLeft, Crown, Loader2 } from 'lucide-react';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';

interface LandPlotSuccessStepProps {
  onPreviewListing: () => void;
  onGoToDashboard: () => void;
  createdSubmissionId?: string | null;
  onEdit?: (step: number) => void;
  gallery?: { images?: any[] };
  propertyData?: {
    expected_price?: number;
    locality?: string;
    property_type?: string;
    listing_type?: string;
  };
  userEmail?: string;
  userName?: string;
}

export const LandPlotSuccessStep = ({
  onPreviewListing,
  onGoToDashboard,
  createdSubmissionId,
  onEdit,
  gallery,
  propertyData,
  userEmail,
  userName
}: LandPlotSuccessStepProps) => {
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);
  
  // Check if there are photos uploaded
  const hasPhotos = gallery?.images && gallery.images.length > 0;

  const handleGoPremium = async () => {
    if (!userEmail) {
      toast.error('Email address is required');
      return;
    }

    setIsLoadingPremium(true);
    try {
      await emailService.sendPlanUpgradeEmail({
        to: userEmail,
        userName: userName || 'Valued Customer',
        locality: propertyData?.locality || '',
        yourPrice: propertyData?.expected_price?.toString() || '',
        propertyType: 'residential',
        listingType: propertyData?.listing_type as 'sell' | 'rent' || 'sell',
        userType: 'seller'
      });
      
      toast.success('Premium plan information sent to your email!');
      // Still open the plans page after sending email
      window.open('/plans', '_blank');
    } catch (error) {
      console.error('Failed to send premium email:', error);
      toast.error('Failed to send email. Please try again.');
      // Fallback: still open the plans page
      window.open('/plans', '_blank');
    } finally {
      setIsLoadingPremium(false);
    }
  };

  const handleUploadPhotos = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('Photos uploaded:', files);
        // Handle photo upload logic here
        // For now, we'll simulate that photos were added
        if (gallery) {
          gallery.images = gallery.images || [];
          for (let i = 0; i < files.length; i++) {
            gallery.images.push(files[i]);
          }
        }
        // Force re-render to show success message
        window.location.reload();
      }
    };
    fileInput.click();
  };

  const handleIDontHavePhotos = () => {
    setShowNoPhotosMessage(true);
  };

  const handleSendPhotos = () => {
    const phoneNumber = '+91 80740 17388';
    const message = encodeURIComponent('Upload the photos');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Success Header */}
      <div className="text-center space-y-4 bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            Congratulations! Your Land listing has been posted.
          </h2>
          <p className="text-green-700">
            Your property is now live and potential buyers can view it. Here's what you can do next:
          </p>
          <p className="text-green-600 text-sm mt-2 font-medium">Your Property will be reviewed and made live in 12 Hours</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleGoPremium}
          disabled={isLoadingPremium}
          className="h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg flex items-center gap-2"
        >
          {isLoadingPremium ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Email...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Go Premium
            </>
          )}
        </Button>
        
        <Button
          onClick={onPreviewListing}
          variant="outline"
          className="h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg flex items-center gap-2"
        >
          <Tag className="w-5 h-5" />
          Preview Listing
        </Button>
      </div>

      {/* Photo Status Messages */}
      {hasPhotos ? (
        /* Photos Success Message */
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800 mb-1">Great! Your property has photos</p>
              <p className="text-green-700 text-sm">
                Properties with photos get 5X more responses. You're all set!
              </p>
            </div>
          </div>
        </div>
      ) : showNoPhotosMessage ? (
        /* No Photos Message */
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800 mb-1">Thanks for letting us know!</p>
              <p className="text-blue-700 text-sm">
                No worries! Your property listing will still be active. You can always add photos later to get better responses.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Photo Upload Notice */
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
              <Camera className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-yellow-800 mb-1">Add photos to get 5X more responses!</p>
              <p className="text-yellow-700 text-sm mb-4">
                Properties with photos get much better responses from potential buyers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleUploadPhotos}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-9 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Now
                </Button>
                
                <Button
                  onClick={handleSendPhotos}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-2 h-9 text-sm"
                >
                  <Facebook className="w-4 h-4" />
                  Send Photos
                </Button>
              </div>
              
              <Button
                onClick={handleIDontHavePhotos}
                variant="ghost"
                className="text-yellow-700 hover:text-yellow-800 mt-2 h-8 text-sm"
              >
                I Don't Have Photos
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
            <Shield className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 mb-1">Need to make changes?</p>
            <p className="text-gray-600 text-sm mb-3">
              You can edit your property details anytime to keep your listing updated.
            </p>
            
            <Button
              onClick={() => onEdit?.(1)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 h-9 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Property
            </Button>
          </div>
        </div>
      </div>

      {/* Go to Dashboard Button */}
      <div className="text-center pt-4">
        <Button
          onClick={onGoToDashboard}
          variant="outline"
          className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium h-12 px-8"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};