import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Upload, Camera, Shield, Star, Facebook, Tag, ArrowLeft } from 'lucide-react';
import { LandPlotFormData } from '@/types/landPlotProperty';

interface LandPlotPreviewStepProps {
  formData: LandPlotFormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  previewPropertyId?: string;
}

export const LandPlotPreviewStep: React.FC<LandPlotPreviewStepProps> = ({
  formData,
  onBack,
  onEdit,
  onSubmit,
  isSubmitting,
  previewPropertyId
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const navigate = useNavigate();
  const { ownerInfo, propertyInfo } = formData;

  const handleSubmit = () => {
    onSubmit();
    setShowSuccess(true);
  };

  const handlePreviewListing = () => {
    console.log('LandPlotPreviewStep handlePreviewListing called');
    console.log('previewPropertyId:', previewPropertyId);
    console.log('formData:', formData);
    
    if (previewPropertyId) {
      console.log('Opening property page:', `/property/${previewPropertyId}`);
      // Open the specific property details page in a new tab
      window.open(`/property/${previewPropertyId}`, '_blank');
    } else {
      console.log('No previewPropertyId, creating preview URL with form data');
      // Create a temporary preview URL with form data
      const previewData = encodeURIComponent(JSON.stringify(formData));
      const previewUrl = `/preview?data=${previewData}&type=land-plot`;
      console.log('Opening preview URL:', previewUrl);
      window.open(previewUrl, '_blank');
    }
  };

  const hasPhotos = propertyInfo?.gallery?.images && propertyInfo.gallery.images.length > 0;

  const handleSendPhotos = () => {
    const phoneNumber = '+91 80740 17388';
    const message = encodeURIComponent('Upload the photos');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showSuccess) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <Edit className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Congratulations!</h1>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                You have successfully posted your land/plot, it will be live within 12 Hrs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* No Brokerage Message */}
        <div className="text-center py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 px-4">
            You just said No to Brokerage, now say No to Unwanted Calls
          </h2>
        </div>

        {/* Premium Plans */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">Sell your land/plot faster with our premium plans!</h3>
                  <p className="text-sm sm:text-base text-gray-600">Unlock access to 100% buyers and enjoy a super-fast closure.</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto" onClick={() => window.open('/plans?tab=builder-lifetime', '_blank')}>
                Go Premium
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Dedicated personal assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Property promotion on site</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">5X more responses from buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">No direct calls from buyers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">Other services from NoBroker</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Create Rental Agreement */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Create Rental Agreement</h4>
                    <p className="text-sm text-gray-600">Get your rental agreement delivered to your doorstep</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Create Now
                </Button>
              </CardContent>
            </Card>

            {/* Property Management Services */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Property Management Services</h4>
                    <p className="text-sm text-gray-600">From inspection to the tenant placement, we make renting your property a breeze</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Know More
                </Button>
              </CardContent>
            </Card>

            {/* Painting & Maintenance Services */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Painting & Maintenance Services</h4>
                    <p className="text-sm text-gray-600">Get Painting, Cleaning, Plumbing, Electrician, Carpentry and Pest Control services all under one roof.</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Property Preview Section - Hidden */}
      <div className="hidden bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Land/Plot Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Plot Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {propertyInfo?.plotDetails?.title || 'Not specified'}</p>
              <p><span className="font-medium">Type:</span> Land/Plot</p>
              <p><span className="font-medium">Land Type:</span> {propertyInfo?.plotDetails?.landType || 'Not specified'}</p>
              <p><span className="font-medium">Price:</span> ₹{propertyInfo?.saleDetails?.expectedPrice?.toLocaleString() || 'Not specified'}</p>
              <p><span className="font-medium">Area:</span> {propertyInfo?.plotDetails?.plotArea || 'Not specified'} {propertyInfo?.plotDetails?.plotAreaUnit || 'sq ft'}</p>
            </div>
          </div>

          {/* Location & Owner */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Location & Contact</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Location:</span> {propertyInfo?.locationDetails?.locality || 'Not specified'}, {propertyInfo?.locationDetails?.city || 'Not specified'}</p>
              <p><span className="font-medium">Owner:</span> {ownerInfo?.fullName || 'Not specified'}</p>
              <p><span className="font-medium">Email:</span> {ownerInfo?.email || 'Not specified'}</p>
              <p><span className="font-medium">Phone:</span> {ownerInfo?.phoneNumber || 'Not specified'}</p>
              <p><span className="font-medium">Images:</span> {propertyInfo?.gallery?.images?.length || 0} uploaded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Congratulations Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm sm:text-base font-bold">✓</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-red-800 mb-1">Congratulations!</h2>
            <p className="text-sm sm:text-base text-red-700 font-medium">Your property is submitted successfully!</p>
          </div>
        </div>
         <div className="flex flex-col sm:flex-row gap-3">
           <Button 
             type="button" 
             variant="outline" 
             onClick={() => onEdit && onEdit(1)} 
             className="border-gray-500 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             Edit Property
           </Button>
           <Button 
             type="button" 
             onClick={handlePreviewListing} 
             disabled={isSubmitting}
             className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
             title="Click to preview your property listing"
           >
             Preview Listing
           </Button>
           <Button 
             type="button" 
             onClick={() => window.open('/dashboard', '_blank')} 
             className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
           >
             Go to Dashboard
           </Button>
         </div>
      </div>

      {/* No Brokerage Message */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center">You just said No to Brokerage, now say No to Unwanted Calls</h3>
      </div>

      {/* Premium Plans Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-3 flex-1 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">🏞️</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Sell your land/plot faster with our premium plans!</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Unlock access to 100% buyers and enjoy a super-fast closure.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Dedicated personal assistant</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Property promotion on site</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">5X more responses from buyers</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">No direct calls from buyers</span>
                </div>
              </div>
            </div>
          </div>
           <div className="flex-shrink-0 w-full sm:w-auto">
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 w-full sm:w-auto"
                onClick={() => window.open('/plans?tab=builder-lifetime', '_blank')}
              >
                Go Premium
              </Button>
           </div>
        </div>
      </div>

      {/* Missing Photos Warning */}
      {!hasPhotos && !showNoPhotosMessage && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 w-full sm:w-auto">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600 font-bold text-xs sm:text-sm">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your land/plot don't have any photos</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your property will be live but in order to get the right buyer faster, we suggest to upload your property photos ASAP
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                onClick={() => setShowNoPhotosMessage(true)}
              >
                I Don't Have Photos
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                onClick={handleSendPhotos}
              >
                Send Photos
              </Button>
               <Button 
                 size="sm" 
                 className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                 onClick={() => onEdit && onEdit(5)}
               >
                 Upload Now
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message for Photos */}
      {hasPhotos && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Great! Your land/plot has photos</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your property listing will be more attractive to potential buyers with photos included.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Photos Message */}
      {showNoPhotosMessage && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-orange-600 font-bold text-sm">!</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 mb-1">Your property don't have any photos</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your property will be live but in order to get the right buyer faster, we suggest to upload your property photos ASAP
              </p>
              
              {/* Divider */}
              <div className="border-t border-orange-200 my-3"></div>
              
              {/* Additional Message */}
              <div className="text-sm text-gray-700 mb-3">
                <p className="mb-2">
                  In our experience, properties with photos go out <strong>2.5 times faster</strong>. To add photos just send your photos to
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">W</span>
                  </div>
                  <span className="text-green-600 font-semibold text-sm">+918035263382</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-teal-500 text-teal-600 hover:bg-teal-50"
                  onClick={() => setShowNoPhotosMessage(false)}
                >
                  Close
                </Button>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Send Photos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-start pt-4 sm:pt-6">
        <Button type="button" variant="outline" onClick={onBack} className="h-9 sm:h-10 px-3 sm:px-4 md:h-12 md:px-8 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};