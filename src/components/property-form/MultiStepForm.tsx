import React, { useState, useEffect, useRef } from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { RentalDetailsStep } from './RentalDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';

import { ScheduleStep } from './ScheduleStep';
import { Home, MapPin, DollarSign, Sparkles, Camera, Info, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';

import { OwnerInfo, PropertyInfo } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MultiStepFormProps {
  onSubmit: (data: { ownerInfo: OwnerInfo; propertyInfo: PropertyInfo }) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId = null
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = React.useState(false);
  
  // Refs for form components
  const propertyDetailsRef = useRef<any>(null);
  const locationDetailsRef = useRef<any>(null);
  const rentalDetailsRef = useRef<any>(null);
  const amenitiesRef = useRef<any>(null);
  const galleryRef = useRef<any>(null);
  const scheduleRef = useRef<any>(null);

  // Function to trigger form submission
  const triggerFormSubmission = () => {
    // Capture current form data and proceed to next step
    if (currentStep === 1) {
      // Update property details with current form data
      updatePropertyDetails(propertyDetails);
      nextStep();
      scrollToTop();
    } else if (currentStep === 2) {
      // Update location details with current form data
      updateLocationDetails(locationDetails);
      nextStep();
      scrollToTop();
    } else if (currentStep === 3) {
      // Update rental details with current form data
      updateRentalDetails(rentalDetails);
      nextStep();
      scrollToTop();
    } else if (currentStep === 4) {
      // Update amenities with current form data
      updateAmenities(amenities);
      nextStep();
      scrollToTop();
    } else if (currentStep === 5) {
      // Update gallery with current form data
      updateGallery(gallery);
      nextStep();
      scrollToTop();
    } else if (currentStep === 6) {
      // Update schedule info and submit
      updateScheduleInfo(scheduleInfo);
      handleSubmit();
    }
  };
  // Helper function to get state from city
  const getStateFromCity = (city: string | undefined): string | undefined => {
    if (!city) return undefined;
    
    const cityStateMap: { [key: string]: string } = {
      'mumbai': 'Maharashtra',
      'delhi': 'Delhi',
      'bangalore': 'Karnataka',
      'pune': 'Maharashtra',
      'chennai': 'Tamil Nadu',
      'kolkata': 'West Bengal',
      'hyderabad': 'Telangana',
      'ahmedabad': 'Gujarat',
      'gurgaon': 'Haryana',
      'noida': 'Uttar Pradesh',
      'jaipur': 'Rajasthan',
      'chandigarh': 'Chandigarh',
      'kochi': 'Kerala',
      'indore': 'Madhya Pradesh',
      'bhopal': 'Madhya Pradesh',
      'visakhapatnam': 'Andhra Pradesh',
      'vadodara': 'Gujarat',
      'coimbatore': 'Tamil Nadu',
      'nashik': 'Maharashtra',
      'rajkot': 'Gujarat'
    };
    
    return cityStateMap[city.toLowerCase()] || undefined;
  };
  
  
  const {
    currentStep,
    ownerInfo,
    propertyDetails,
    locationDetails,
    rentalDetails,
    amenities,
    gallery,
    additionalInfo,
    scheduleInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePropertyDetails,
    updateLocationDetails,
    updateRentalDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    updateScheduleInfo,
    getFormData,
    isStepValid
  } = usePropertyForm();

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo]);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 6) {
      console.log('Navigating to target step:', targetStep);
      goToStep(targetStep);
    }
  }, [targetStep]);


  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);



  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handlePropertyDetailsNext = (data: any) => {
    updatePropertyDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: any) => {
    updateLocationDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: any) => {
    updateRentalDetails(data);
    nextStep();
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    updateAmenities(data);
    nextStep();
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    updateGallery(data);
    nextStep();
    scrollToTop();
  };


  const handleScheduleSubmit = (data: any) => {
    updateScheduleInfo(data);
    console.log('Submitting property directly from Schedule step');
    handleSubmit();
  };

  const handleSubmit = () => {
    const formData = getFormData();
    
    console.log('Form submission with optional validation:', { formData });
    
    // Since all fields are now optional, we can submit with any data
    if (formData.ownerInfo && formData.propertyInfo) {
      onSubmit({
        ownerInfo: formData.ownerInfo as OwnerInfo,
        propertyInfo: formData.propertyInfo as PropertyInfo
      });
      // Show success page after submission
      setIsSubmitted(true);
    } else {
      console.error('Form data structure is invalid');
    }
  };

  const handlePreviewListing = () => {
    if (createdSubmissionId) {
      // Open the specific property details page in a new tab
      window.open(`/property/${createdSubmissionId}`, '_blank');
    } else {
      // Fallback: open property search in new tab if no ID available
      window.open('/search', '_blank');
    }
  };

  const hasPhotos = getFormData().propertyInfo?.gallery?.images && getFormData().propertyInfo.gallery.images.length > 0;

  const sidebarSteps = [
    { title: "Property Details", icon: <Home className="w-4 h-4" /> },
    { title: "Locality Details", icon: <MapPin className="w-4 h-4" /> },
    { title: "Rental Details", icon: <DollarSign className="w-4 h-4" /> },
    { title: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Gallery", icon: <Camera className="w-4 h-4" /> },
    { title: "Schedule", icon: <Calendar className="w-4 h-4" /> },
  ];

  // Show success page if property has been submitted
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <PropertyFormSidebar
              currentStep={6}
              completedSteps={[1, 2, 3, 4, 5, 6]}
              steps={sidebarSteps}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 bg-white flex flex-col">
            <div className="flex-1 p-4">
              <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                {/* Congratulations Section */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-sm sm:text-base font-bold">✓</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-1">Congratulations!</h2>
                      <p className="text-sm sm:text-base text-red-700 font-medium">Your property is submitted successfully!</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        goToStep(1);
                      }} 
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
                          <span className="text-white text-xs font-bold">🏠</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Sell your property faster with our premium plans!</h3>
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
                        onClick={() => window.open('/plans', '_blank')}
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
                          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your property don't have any photos</h3>
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
                        <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto">
                          Send Photos
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                          onClick={() => {
                            setIsSubmitted(false);
                            goToStep(5);
                          }}
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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Great! Your property has photos</h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          Your property listing will be more attractive to potential buyers with photos included.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Photos Message */}
                {showNoPhotosMessage && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-orange-600 font-bold text-xs sm:text-sm">!</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your property don't have any photos</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                          Your property will be live but in order to get the right buyer faster, we suggest to upload your property photos ASAP
                        </p>
                        
                        {/* Divider */}
                        <div className="border-t border-orange-200 my-3"></div>
                        
                        {/* Additional Message */}
                        <div className="text-xs sm:text-sm text-gray-700 mb-3">
                          <p className="mb-2">
                            In our experience, properties with photos go out <strong>2.5 times faster</strong>. To add photos just send your photos to
                          </p>
                          <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">W</span>
                            </div>
                            <span className="text-green-600 font-semibold text-xs sm:text-sm">+918035263382</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                            onClick={() => setShowNoPhotosMessage(false)}
                          >
                            Close
                          </Button>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto">
                            Send Photos
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Right Sidebar - Get Tenants Faster */}
          <div className="w-80 flex-shrink-0 min-h-screen">
            <GetTenantsFasterSection />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="bg-white border-b border-gray-200 px-4 pt-8 pb-4 md:pt-12 lg:pt-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold text-gray-900">Property Submitted</h1>
            </div>
          </div>
          
          <div className="p-4">
            <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
              {/* Congratulations Section */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm sm:text-base font-bold">✓</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-1">Congratulations!</h2>
                    <p className="text-sm sm:text-base text-red-700 font-medium">Your property is submitted successfully!</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsSubmitted(false);
                      goToStep(1);
                    }} 
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
                        <span className="text-white text-xs font-bold">🏠</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Sell your property faster with our premium plans!</h3>
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
                      onClick={() => window.open('/plans', '_blank')}
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
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your property don't have any photos</h3>
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
                      <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto">
                        Send Photos
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                        onClick={() => {
                          setIsSubmitted(false);
                          goToStep(5);
                        }}
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Great! Your property has photos</h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Your property listing will be more attractive to potential buyers with photos included.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Photos Message */}
              {showNoPhotosMessage && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-bold text-xs sm:text-sm">!</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your property don't have any photos</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Your property will be live but in order to get the right buyer faster, we suggest to upload your property photos ASAP
                      </p>
                      
                      {/* Divider */}
                      <div className="border-t border-orange-200 my-3"></div>
                      
                      {/* Additional Message */}
                      <div className="text-xs sm:text-sm text-gray-700 mb-3">
                        <p className="mb-2">
                          In our experience, properties with photos go out <strong>2.5 times faster</strong>. To add photos just send your photos to
                        </p>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">W</span>
                          </div>
                          <span className="text-green-600 font-semibold text-xs sm:text-sm">+918035263382</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-teal-500 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                          onClick={() => setShowNoPhotosMessage(false)}
                        >
                          Close
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto">
                          Send Photos
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 px-4 pt-8 pb-4 md:pt-12 lg:pt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">Property Details</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{currentStep}/6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-4 pb-20">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <PropertyDetailsStep
                initialData={propertyDetails}
                onNext={handlePropertyDetailsNext}
                onBack={() => {}}
                currentStep={currentStep}
                totalSteps={6}
              />
            )}

            {currentStep === 2 && (
              <LocationDetailsStep
                initialData={{
                  ...locationDetails
                }}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
              />
            )}

            {currentStep === 3 && (
              <RentalDetailsStep
                initialData={rentalDetails}
                onNext={handleRentalDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
              />
            )}

            {currentStep === 4 && (
              <AmenitiesStep
                initialData={amenities}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
              />
            )}

            {currentStep === 5 && (
              <GalleryStep
                initialData={gallery}
                onNext={handleGalleryNext}
                onBack={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {currentStep === 6 && (
              <ScheduleStep
                initialData={scheduleInfo}
                onNext={handleScheduleSubmit}
                onBack={prevStep}
              />
            )}

          </div>
        </div>
        
        {/* Mobile Sticky Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-lg">
          <div className="flex flex-col gap-3">
            <Button 
              type="button" 
              onClick={triggerFormSubmission}
              className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white w-full font-semibold"
            >
              Save & Continue
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 1 ? () => {} : prevStep}
              className="h-10 px-4 w-full"
              disabled={currentStep === 1}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <PropertyFormSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={sidebarSteps}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          {/* Form Content - Scrollable */}
          <div className="flex-1 p-4 pb-20">
            <div className="bg-white max-w-4xl mx-auto">
              {currentStep === 1 && (
                <PropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 2 && (
                <LocationDetailsStep
                  initialData={{
                    ...locationDetails
                  }}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 3 && (
                <RentalDetailsStep
                  initialData={rentalDetails}
                  onNext={handleRentalDetailsNext}
                  onBack={prevStep}
                  currentStep={currentStep}
                  totalSteps={6}
                />
              )}

              {currentStep === 4 && (
                <AmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 5 && (
                <GalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {currentStep === 6 && (
                <ScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleSubmit}
                  onBack={prevStep}
                />
              )}

            </div>
          </div>

          {/* Sticky Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? () => {} : prevStep}
                className="h-10 sm:h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={triggerFormSubmission}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 min-h-screen">
          <GetTenantsFasterSection />
        </div>
      </div>
    </div>
  );
};