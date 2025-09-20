import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { FlattmatesPropertyDetailsStep } from './FlattmatesPropertyDetailsStep';
import { FlattmatesLocationDetailsStep } from './FlattmatesLocationDetailsStep';
import { FlattmatesRentalDetailsStep } from './FlattmatesRentalDetailsStep';
import { FlattmatesAmenitiesStep } from './FlattmatesAmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { ScheduleStep } from './ScheduleStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { Home, MapPin, DollarSign, Star, Camera, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyGallery, AdditionalInfo, ScheduleInfo, FlattmatesFormData } from '@/types/property';

interface FlattmatesMultiStepFormProps {
  onSubmit: (data: FlattmatesFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const FlattmatesMultiStepForm: React.FC<FlattmatesMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId = null
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    whatsappUpdates: false,
    propertyType: 'Residential',
    listingType: 'Flatmates',
    ...initialOwnerInfo
  });

  const [propertyDetails, setPropertyDetails] = useState({
    apartmentType: '',
    bhkType: '',
    floorNo: 0,
    totalFloors: 0,
    roomType: '',
    tenantType: '',
    propertyAge: '',
    facing: '',
    builtUpArea: 0
  });

  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    state: '',
    city: '',
    locality: '',
    pincode: '',
    societyName: '',
    landmark: ''
  });

  const [rentalDetails, setRentalDetails] = useState({
    expectedRent: 0,
    expectedDeposit: 0,
    rentNegotiable: false,
    monthlyMaintenance: '',
    availableFrom: '',
    description: ''
  });

  const [amenities, setAmenities] = useState({
    powerBackup: '',
    lift: '',
    parking: '',
    waterStorageFacility: '',
    security: '',
    wifi: '',
    currentPropertyCondition: '',
    directionsTip: ''
  });

  const [gallery, setGallery] = useState<PropertyGallery>({
    images: [],
    video: undefined
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    description: '',
    previousOccupancy: '',
    paintingRequired: '',
    cleaningRequired: ''
  });

  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo>({
    availability: 'everyday',
    paintingService: 'decline',
    cleaningService: 'decline',
    startTime: '',
    endTime: '',
    availableAllDay: true
  });

  useEffect(() => {
    if (initialOwnerInfo) {
      setOwnerInfo(prev => ({ ...prev, ...initialOwnerInfo }));
      if (initialOwnerInfo.fullName && initialOwnerInfo.email && initialOwnerInfo.phoneNumber) {
        setCompletedSteps(prev => prev.includes(0) ? prev : [...prev, 0]);
      }
    }
  }, [initialOwnerInfo]);

  // Navigate to target step if provided
  useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7) {
      setCurrentStep(targetStep);
    }
  }, [targetStep]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const currentFormId = 'flatmates-step-form';

  const handlePropertyDetailsNext = (data: any) => {
    setPropertyDetails(data);
    setCompletedSteps(prev => prev.includes(1) ? prev : [...prev, 1]);
    setCurrentStep(2);
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    setLocationDetails(data);
    setCompletedSteps(prev => prev.includes(2) ? prev : [...prev, 2]);
    setCurrentStep(3);
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: any) => {
    setRentalDetails(data);
    setCompletedSteps(prev => prev.includes(3) ? prev : [...prev, 3]);
    setCurrentStep(4);
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCompletedSteps(prev => prev.includes(4) ? prev : [...prev, 4]);
    setCurrentStep(5);
    scrollToTop();
  };

  const handleGalleryNext = (data: PropertyGallery) => {
    setGallery(data);
    setCompletedSteps(prev => prev.includes(5) ? prev : [...prev, 5]);
    setCurrentStep(6);
    scrollToTop();
  };

  const handleScheduleNext = (data: ScheduleInfo) => {
    setScheduleInfo(data);
    setCompletedSteps(prev => prev.includes(6) ? prev : [...prev, 6]);
    handleSubmit();
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const getFormData = (): FlattmatesFormData => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails: {
        title: `${propertyDetails.bhkType} ${propertyDetails.apartmentType} for Flatmates`,
        propertyType: 'apartment',
        buildingType: propertyDetails.apartmentType,
        bhkType: propertyDetails.bhkType,
        propertyAge: propertyDetails.propertyAge,
        totalFloors: propertyDetails.totalFloors,
        floorNo: propertyDetails.floorNo,
        superBuiltUpArea: propertyDetails.builtUpArea,
        onMainRoad: false,
        cornerProperty: false
      },
      locationDetails,
      flattmatesDetails: {
        listingType: 'Flatmates',
        expectedPrice: rentalDetails.expectedRent,
        existingFlatmates: 1,
        genderPreference: propertyDetails.tenantType === 'Male' ? 'male' : propertyDetails.tenantType === 'Female' ? 'female' : 'any',
        occupation: 'any',
        lifestylePreference: 'mixed',
        smokingAllowed: false,
        petsAllowed: false,
        rentNegotiable: rentalDetails.rentNegotiable,
        maintenanceExtra: rentalDetails.monthlyMaintenance === 'Extra',
        maintenanceCharges: 0,
        securityDeposit: rentalDetails.expectedDeposit,
        depositNegotiable: true,
        leaseDuration: '',
        lockinPeriod: '',
        brokerageType: '',
        availableFrom: rentalDetails.availableFrom,
        preferredTenants: '',
        idealFor: []
      },
      amenities: {
        powerBackup: amenities.powerBackup ? 'Available' : 'Not Available',
        lift: amenities.lift ? 'Available' : 'Not Available',
        parking: amenities.parking,
        waterStorageFacility: amenities.waterStorageFacility ? 'Available' : 'Not Available',
        security: amenities.security ? 'Available' : 'Not Available',
        wifi: amenities.wifi ? 'Available' : 'Not Available',
        currentPropertyCondition: amenities.currentPropertyCondition,
        directionsTip: amenities.directionsTip,
        sharedKitchen: true,
        sharedLivingRoom: true,
        dedicatedBathroom: true,
        sharedParking: amenities.parking !== 'none'
      },
      gallery,
      additionalInfo: {
        ...additionalInfo,
        description: rentalDetails.description
      },
      scheduleInfo
    }
  });

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const handlePreviewListing = () => {
    if (createdSubmissionId) {
      window.open(`/property/${createdSubmissionId}`, '_blank');
    } else {
      window.open('/search', '_blank');
    }
  };

  const hasPhotos = useMemo(() => {
    return gallery.images && gallery.images.length > 0;
  }, [gallery.images]);

  const sidebarSteps = [
    { title: 'Property Details', icon: <Home className="w-4 h-4" /> },
    { title: 'Locality Details', icon: <MapPin className="w-4 h-4" /> },
    { title: 'Rental Details', icon: <DollarSign className="w-4 h-4" /> },
    { title: 'Amenities', icon: <Star className="w-4 h-4" /> },
    { title: 'Gallery', icon: <Camera className="w-4 h-4" /> },
    { title: 'Schedule', icon: <Calendar className="w-4 h-4" /> }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <PropertyFormSidebar
              currentStep={6} // All steps completed
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

        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <FlattmatesPropertyDetailsStep
                initialData={propertyDetails}
                onNext={handlePropertyDetailsNext}
                onBack={() => {}}
                currentStep={currentStep}
                totalSteps={6}
                completedSteps={completedSteps}
                formId={currentFormId}
              />
            )}

            {currentStep === 2 && (
              <FlattmatesLocationDetailsStep
                initialData={locationDetails}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
              />
            )}

            {currentStep === 3 && (
              <FlattmatesRentalDetailsStep
                initialData={rentalDetails}
                onNext={handleRentalDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
                completedSteps={completedSteps}
              />
            )}

            {currentStep === 4 && (
              <FlattmatesAmenitiesStep
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
                onNext={handleScheduleNext}
                onBack={prevStep}
              />
            )}
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
                <FlattmatesPropertyDetailsStep
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                  currentStep={currentStep}
                  totalSteps={6}
                  completedSteps={completedSteps}
                />
              )}

            {currentStep === 2 && (
              <FlattmatesLocationDetailsStep
                initialData={locationDetails}
                onNext={handleLocationDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
                formId={currentFormId}
              />
            )}

            {currentStep === 3 && (
              <FlattmatesRentalDetailsStep
                initialData={rentalDetails}
                onNext={handleRentalDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={6}
                completedSteps={completedSteps}
                formId={currentFormId}
              />
            )}

            {currentStep === 4 && (
              <FlattmatesAmenitiesStep
                initialData={amenities}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
                formId={currentFormId}
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
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                />
              )}
            </div>
          </div>

          {/* Sticky Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
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
                onClick={() => {
                  console.log('FlattmatesMultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Always scroll to top first
                  scrollToTop();
                  
                  // Prefer submitting the active form so the latest child state is captured
                  const formIdToUse = currentStep === 5
                    ? 'gallery-form'
                    : currentStep === 6
                      ? 'schedule-form'
                      : currentFormId;

                  // Try several strategies to find the active form
                  const candidates: (HTMLFormElement | null)[] = [
                    document.getElementById(formIdToUse) as HTMLFormElement | null,
                    document.querySelector(`#${formIdToUse}`) as HTMLFormElement | null,
                    document.querySelector('form#flatmates-step-form') as HTMLFormElement | null,
                    document.querySelector('.max-w-4xl form') as HTMLFormElement | null,
                    document.querySelector('form') as HTMLFormElement | null,
                  ];
                  const formEl = candidates.find(Boolean) as HTMLFormElement | null;

                  if (formEl) {
                    // Ensure focused elements are committed
                    (document.activeElement as HTMLElement | null)?.blur?.();

                    if (typeof (formEl as any).requestSubmit === 'function') {
                      console.log('Submitting form via requestSubmit:', formEl.id || '[no id]');
                      (formEl as any).requestSubmit();
                    } else {
                      console.log('Submitting form via dispatchEvent fallback:', formEl.id || '[no id]');
                      const ev = new Event('submit', { bubbles: true, cancelable: true });
                      formEl.dispatchEvent(ev);
                    }
                    return; // Stop here, handler will be executed by the form
                  }

                  console.warn('Form element not found, falling back to direct handlers');
                  if (currentStep === 1) {
                    handlePropertyDetailsNext(propertyDetails);
                  } else if (currentStep === 2) {
                    handleLocationDetailsNext(locationDetails);
                  } else if (currentStep === 3) {
                    handleRentalDetailsNext(rentalDetails);
                  } else if (currentStep === 4) {
                    handleAmenitiesNext(amenities);
                  } else if (currentStep === 5) {
                    handleGalleryNext(gallery);
                  } else if (currentStep === 6) {
                    handleScheduleNext(scheduleInfo);
                  }
                }}
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
