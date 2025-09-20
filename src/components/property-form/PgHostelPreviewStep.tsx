import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { PGHostelFormData } from '@/types/property';

interface PgHostelPreviewStepProps {
  formData: PGHostelFormData;
  onBack: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  createdSubmissionId?: string | null;
}

export const PgHostelPreviewStep: React.FC<PgHostelPreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting = false,
  createdSubmissionId
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    onSubmit();
    setShowSuccess(true);
  };

  const handlePreviewListing = () => {
    console.log('PgHostelPreviewStep handlePreviewListing called');
    console.log('createdSubmissionId:', createdSubmissionId);
    if (createdSubmissionId) {
      window.open(`/property/${createdSubmissionId}`, '_blank');
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Success Message */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-md">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 text-base font-bold">✓</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">Congratulations!</h2>
              <p className="text-base text-red-700 font-medium">Your PG/Hostel is submitted successfully!</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onEdit} 
              className="border-gray-500 text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Edit Property
            </Button>
            <Button 
              type="button" 
              onClick={handlePreviewListing} 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Preview Listing
            </Button>
            <Button 
              type="button" 
              onClick={() => window.open('/dashboard', '_blank')} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* No Brokerage Message */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 text-center">You just said No to Brokerage, now say No to Unwanted Calls</h3>
        </div>

        {/* Premium Plans Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🏠</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Find tenants faster with our premium plans!</h3>
                <p className="text-base text-gray-600 mb-4">Unlock access to 100% tenants and enjoy a super-fast booking.</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Dedicated personal assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Property promotion on site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">5X more responses from tenants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">No direct calls from tenants</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
                onClick={() => window.open('/plans', '_blank')}
              >
                Go Premium
              </Button>
            </div>
          </div>
        </div>

        {/* Other Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Rental Agreements</h4>
            <p className="text-sm text-gray-600 mb-3">Get your rental agreement drafted by legal experts</p>
            <Button variant="outline" size="sm">Learn More</Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Painting & Maintenance</h4>
            <p className="text-sm text-gray-600 mb-3">Professional services to maintain your property</p>
            <Button variant="outline" size="sm">Learn More</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Property Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Property Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {formData.propertyInfo.propertyDetails.title}</p>
              <p><span className="font-medium">Type:</span> {formData.propertyInfo.propertyDetails.propertyType}</p>
              <p><span className="font-medium">Rent:</span> ₹{formData.propertyInfo.pgDetails.expectedPrice?.toLocaleString()}/month</p>
              <p><span className="font-medium">Deposit:</span> ₹{formData.propertyInfo.pgDetails.securityDeposit?.toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">City:</span> {formData.propertyInfo.locationDetails.city}</p>
              <p><span className="font-medium">Locality:</span> {formData.propertyInfo.locationDetails.locality}</p>
              <p><span className="font-medium">State:</span> {formData.propertyInfo.locationDetails.state}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Owner Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {formData.ownerInfo.fullName}</p>
            <p><span className="font-medium">Phone:</span> {formData.ownerInfo.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {formData.ownerInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Congratulations Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-md">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 text-base font-bold">✓</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-800">Ready to Submit!</h2>
            <p className="text-base text-red-700 font-medium">Your PG/Hostel listing is complete and ready to go live!</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onEdit} 
            className="border-gray-500 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Property
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Property'}
          </Button>
        </div>
      </div>

      {/* Photo Guidelines */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-orange-600 font-bold text-sm">!</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Photos boost visibility by 2X!</h3>
            <p className="text-sm text-gray-600 mb-3">
              Properties with photos get 2X more responses. Make sure you've uploaded good quality images of your PG/Hostel.
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};
