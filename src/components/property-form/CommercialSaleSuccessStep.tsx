import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Check } from 'lucide-react';
import { sendPlanUpgradeEmail } from '@/services/emailService';
import { OwnerInfo } from '@/types/property';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface CommercialSaleSuccessStepProps {
  onEditProperty: () => void;
  onPreviewListing: () => void;
  onGoToDashboard: () => void;
  createdSubmissionId?: string | null;
  onEdit?: (step: number) => void;
  gallery?: { images?: Array<{ url: string; alt?: string }> };
  ownerInfo?: Partial<OwnerInfo>;
}

export const CommercialSaleSuccessStep = ({
  onEditProperty,
  onPreviewListing,
  onGoToDashboard,
  createdSubmissionId,
  onEdit,
  gallery,
  ownerInfo
}: CommercialSaleSuccessStepProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  
  // Check if there are photos uploaded
  const hasPhotos = gallery?.images && gallery.images.length > 0;

  // Resolve contact details from multiple sources
  const getResolvedContact = () => {
    const emailCandidates = [
      ownerInfo?.email,
      user?.email,
    ] as (string | undefined)[];

    const fullNameCandidates = [
      (user as { user_metadata?: { full_name?: string; name?: string } })?.user_metadata?.full_name,
      (user as { user_metadata?: { full_name?: string; name?: string } })?.user_metadata?.name,
      ownerInfo?.fullName
    ] as (string | undefined)[];

    const email = emailCandidates.find(Boolean);
    const fullName = fullNameCandidates.find(Boolean);

    return { email, fullName } as { email?: string; fullName?: string };
  };

  const handleGoPremium = async () => {
    const { email, fullName } = getResolvedContact();
    
    if (!email || !fullName) {
      toast({
        title: "Error",
        description: "Unable to send request. Please ensure your email and name are properly entered.",
        variant: "destructive"
      });
      console.warn('[CommercialSaleSuccessStep] Missing contact details for Premium upgrade', { email, fullName, ownerInfo, user });
      window.open(`/property/${createdSubmissionId}/plans?skipWizard=true`, '_blank');
      return;
    }

    setIsEmailLoading(true);
    try {
      await sendPlanUpgradeEmail(email, fullName);
      
      toast({
        title: "Request submitted successfully!",
        description: "We'll contact you shortly with premium plan details.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error sending upgrade email:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEmailLoading(false);
    }
    
    window.open('/plans?tab=seller&category=commercial', '_blank');
  };

  const handleGoDashboard = () => {
    window.open('/dashboard', '_blank');
  };

  const handleUploadNow = () => {
    if (onEdit) {
      onEdit(6); // Navigate to gallery step
    }
  };

  const handleSendPhotos = () => {
    const phoneNumber = '+91 80740 17388';
    const message = encodeURIComponent('Upload the photos');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleIDontHavePhotos = () => {
    setShowNoPhotosMessage(true);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Success Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 mt-20 sm:mt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-red-900">Congratulations!</h2>
            <p className="text-sm sm:text-base text-red-700">Your property is submitted successfully! It will be reviewed and made live in 12 Hours.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onEditProperty}
            className="border-green-300 text-green-700 hover:bg-green-50 w-full sm:w-auto"
          >
            Edit Property
          </Button>
          <Button
            onClick={onPreviewListing}
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white w-full sm:w-auto"
          >
            Preview Listing
          </Button>
          <Button
            onClick={handleGoDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
        </div>
        
        
      </div>

      {/* Premium Plans Section */}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 px-4">
          You just said No to Brokerage, now say No to Unwanted Calls
        </h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-start sm:items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">Get tenants faster with our premium plans!</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Unlock access to 100% tenants and enjoy a super-fast closure.</p>
            </div>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
            onClick={handleGoPremium}
            disabled={isEmailLoading}
          >
            {isEmailLoading ? 'Sending...' : 'Go Premium'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">Dedicated personal assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">Property promotion on site</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">5X more responses from tenants</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">No direct calls from tenants</span>
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-yellow-600 text-xs sm:text-sm font-semibold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-yellow-800 mb-1">Your commercial property don't have any photos</p>
              <p className="text-yellow-700 text-xs sm:text-sm mb-3">
                Your property will be live but in order to get the right tenant faster, we suggest to upload your property photos ASAP
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-300 w-full sm:w-auto"
                  onClick={handleIDontHavePhotos}
                >
                  I Don't Have Photos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-300 w-full sm:w-auto"
                  onClick={handleSendPhotos}
                >
                  Send Photos
                </Button>
                <Button 
                  size="sm" 
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
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
