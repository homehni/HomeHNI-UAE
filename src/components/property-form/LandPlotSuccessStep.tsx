import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, Camera, Shield, Star, Facebook, Tag, ArrowLeft, Crown, Check } from 'lucide-react';
import { sendPriceSuggestionsEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { OwnerInfo } from '@/types/property';

interface LandPlotSuccessStepProps {
  onPreviewListing: () => void;
  onGoToDashboard: () => void;
  createdSubmissionId?: string | null;
  onEdit?: (step: number) => void;
  gallery?: { images?: any[] };
  ownerInfo?: Partial<OwnerInfo>;
}

export const LandPlotSuccessStep = ({
  onPreviewListing,
  onGoToDashboard,
  createdSubmissionId,
  onEdit,
  gallery,
  ownerInfo
}: LandPlotSuccessStepProps) => {
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { toast } = useToast();
  
  // Check if there are photos uploaded
  const hasPhotos = gallery?.images && gallery.images.length > 0;

  const handleGoPremium = async () => {
    if (!ownerInfo?.email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address to receive premium plan details.",
        variant: "destructive"
      });
      return;
    }

    setIsEmailLoading(true);
    try {
      const result = await sendPriceSuggestionsEmail(
        ownerInfo.email,
        ownerInfo.fullName || 'there',
        {
          locality: 'your area',
          rangeMin: 0,
          rangeMax: 0,
          yourPrice: 0,
          propertyType: 'land/plot',
          listingType: 'sell',
          userType: 'seller'
        }
      );

      if (result.success) {
        toast({
          title: "Premium Plans Sent!",
          description: "Check your email for personalized land/plot premium plan recommendations.",
        });
        window.open('/plans?tab=seller', '_blank');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending premium plan email:', error);
      toast({
        title: "Email Failed",
        description: "Unable to send premium plan details. Please try again later.",
        variant: "destructive"
      });
      window.open('/plans?tab=seller', '_blank');
    } finally {
      setIsEmailLoading(false);
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

  const handleGoDashboard = () => {
    window.open('/dashboard', '_blank');
  };

  const handleEditProperty = () => {
    if (onEdit) {
      onEdit(1); // Go back to first step
    }
  };

  const handleUploadNow = () => {
    if (onEdit) {
      onEdit(5); // Navigate to gallery step
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-900">Congratulations!</h2>
            <p className="text-red-700">Your property is submitted successfully! It will be reviewed and made live in 12 Hours.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleEditProperty}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Edit Property
          </Button>
          <Button
            onClick={onPreviewListing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Preview Listing
          </Button>
          <Button
            onClick={handleGoDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Premium Plans Section */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          You just said No to Brokerage, now say No to Unwanted Calls
        </h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Get buyers faster with our premium plans!</h4>
              <p className="text-gray-600 text-sm">Unlock access to 100% buyers and enjoy a super-fast closure.</p>
            </div>
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleGoPremium}
            disabled={isEmailLoading}
          >
            {isEmailLoading ? 'Sending...' : 'Go Premium'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Dedicated personal assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Property promotion on site</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">5X more responses from buyers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">No direct calls from buyers</span>
          </div>
        </div>
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
              <span className="text-yellow-600 text-sm font-semibold">!</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-yellow-800 mb-1">Your land don't have any photos</p>
              <p className="text-yellow-700 text-sm mb-3">
                Your property will be live but in order to get the right buyer faster, we suggest to upload your property photos ASAP
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-300"
                  onClick={handleIDontHavePhotos}
                >
                  I Don't Have Photos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-300"
                  onClick={handleSendPhotos}
                >
                  Send Photos
                </Button>
                <Button 
                  size="sm" 
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleUploadNow}
                >
                  Upload Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};