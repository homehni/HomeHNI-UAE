import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from './ProgressIndicator';
import { PgHostelSidebar } from './PgHostelSidebar';
import { PgHostelRoomTypeStep } from './PgHostelRoomTypeStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { ArrowLeft, CheckCircle } from 'lucide-react';

import { PgHostelRoomDetailsStep } from './PgHostelRoomDetailsStep';
import { PgHostelLocalityDetailsStep } from './PgHostelLocalityDetailsStep';
import { PgHostelPgDetailsStep } from './PgHostelPgDetailsStep';
import { PgHostelAmenitiesStep } from './PgHostelAmenitiesStep';
import { PgHostelGalleryStep } from './PgHostelGalleryStep';
import { PgHostelScheduleStep } from './PgHostelScheduleStep';
import { PGHostelFormData, OwnerInfo } from '@/types/property';

// Define local interfaces to match the components
interface LocalOwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  whatsappUpdates: boolean;
}

interface PGHostelMultiStepFormProps {
  onSubmit: (data: PGHostelFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<LocalOwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
}

export const PGHostelMultiStepForm: React.FC<PGHostelMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId
}) => {
  // Skip owner info and property info - start from room details
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  
  // PG/Hostel specific state
  const [ownerInfo, setOwnerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    whatsappUpdates: false,
    ...initialOwnerInfo
  });

const [propertyInfo, setPropertyInfo] = useState({
  title: '',
  propertyType: '',
});

  const [roomTypes, setRoomTypes] = useState({
    selectedTypes: [] as ('single' | 'double' | 'three' | 'four')[],
  });


  const [roomDetails, setRoomDetails] = useState({
    roomTypeDetails: {} as { [key: string]: { expectedRent: number; expectedDeposit: number } },
    roomAmenities: {
    cupboard: false,
    geyser: false,
    tv: false,
    ac: false,
    bedding: false,
      attachedBathroom: false,
    },
  });

  const [localityDetails, setLocalityDetails] = useState({
    state: '',
    city: '',
    locality: '',
    pincode: '',
    societyName: '',
    landmark: ''
  });

  const [pgDetails, setPgDetails] = useState({
    genderPreference: 'anyone' as const,
    preferredGuests: 'any' as const,
    availableFrom: '',
    foodIncluded: 'no' as const,
    rules: {
      noSmoking: false,
      noGuardiansStay: false,
      noGirlsEntry: false,
      noDrinking: false,
      noNonVeg: false,
    },
    gateClosingTime: '',
    description: '',
  });

  const [amenities, setAmenities] = useState({
    laundry: '' as 'yes' | 'no' | '',
    roomCleaning: '' as 'yes' | 'no' | '',
    wardenFacility: '' as 'yes' | 'no' | '',
    directionsTip: '',
    commonTv: false,
    mess: false,
    lift: false,
    refrigerator: false,
    wifi: false,
    cookingAllowed: false,
    powerBackup: false,
    parking: 'none' as 'none' | 'bike' | 'car' | 'both',
  });

  const [gallery, setGallery] = useState({
    images: [],
    video: undefined
  });

  const [scheduleInfo, setScheduleInfo] = useState({
    availability: 'everyday' as const,
    paintingService: 'decline' as const,
    cleaningService: 'decline' as const,
    startTime: '',
    endTime: '',
    availableAllDay: true
  });

  useEffect(() => {
    if (initialOwnerInfo) {
      setOwnerInfo(prev => ({ ...prev, ...initialOwnerInfo }));
    }
  }, [initialOwnerInfo]);

  // Navigate to target step if provided
  useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 6) {
      console.log('Navigating to target step:', targetStep);
      setCurrentStep(targetStep);
    }
  }, [targetStep]);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  // Step handlers


  const handleRoomTypesNext = (data: any) => {
    setRoomTypes(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 1), 1]);
    setCurrentStep(2);
    scrollToTop();
  };

  const handleRoomDetailsNext = (data: any) => {
    setRoomDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 2), 2]);
    setCurrentStep(3);
    scrollToTop();
  };

  const handleLocalityDetailsNext = (data: any) => {
    setLocalityDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 3), 3]);
    setCurrentStep(4);
    scrollToTop();
  };

  const handlePgDetailsNext = (data: any) => {
    setPgDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 4), 4]);
    setCurrentStep(5);
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 5), 5]);
    setCurrentStep(6);
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    setGallery(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 6), 6]);
    setCurrentStep(7);
    scrollToTop();
  };

  const handleScheduleNext = (data: any) => {
    setScheduleInfo(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 7), 7]);
    // Form complete, submit
    handleSubmit();
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const goToStep = (step: number) => {
    setCurrentStep(step);
    scrollToTop();
  };

  const getFormData = (): PGHostelFormData => ({
    ownerInfo: {
      fullName: ownerInfo.fullName,
      phoneNumber: ownerInfo.phoneNumber,
      email: ownerInfo.email,
      whatsappUpdates: ownerInfo.whatsappUpdates,
      propertyType: 'Residential',
      listingType: 'PG/Hostel'
    },
    propertyInfo: {
      propertyDetails: {
        title: propertyInfo.title || 'PG/Hostel Property',
        propertyType: 'PG/Hostel',
        buildingType: 'PG',
        bhkType: roomTypes.selectedTypes.length > 1 
          ? 'Multiple room types' 
          : 'PG/Hostel',
        propertyAge: 'New',
        totalFloors: 1,
        floorNo: 1,
        superBuiltUpArea: 1,
        onMainRoad: false,
        cornerProperty: false
      },
      locationDetails: localityDetails,
      pgDetails: {
        listingType: 'PG/Hostel',
        expectedPrice: (() => {
          if (roomTypes.selectedTypes.length === 0) return 0;
          const prices = roomTypes.selectedTypes
            .map(type => roomDetails.roomTypeDetails[type]?.expectedRent || 0)
            .filter(price => price > 0);
          return prices.length > 0 ? Math.min(...prices) : 0;
        })(),
        roomType: 'shared',
        genderPreference: pgDetails.genderPreference === 'anyone' ? 'any' : pgDetails.genderPreference,
        mealOptions: (pgDetails.foodIncluded as string) === 'yes' ? 'included' as const : 'not-available' as const,
        securityDeposit: (() => {
          if (roomTypes.selectedTypes.length === 0) return 0;
          const deposits = roomTypes.selectedTypes
            .map(type => roomDetails.roomTypeDetails[type]?.expectedDeposit || 0)
            .filter(deposit => deposit > 0);
          return deposits.length > 0 ? Math.min(...deposits) : 0;
        })(),
        timingRestrictions: pgDetails.gateClosingTime,
        houseRules: pgDetails.description,
        rentNegotiable: true,
        maintenanceExtra: false,
        maintenanceCharges: 0,
        depositNegotiable: true,
        leaseDuration: '',
        lockinPeriod: '',
        brokerageType: '',
        availableFrom: pgDetails.availableFrom,
        preferredTenants: pgDetails.preferredGuests,
        idealFor: []
      },
      amenities: {
        powerBackup: amenities.powerBackup ? 'Available' : 'Not Available',
        lift: amenities.lift ? 'Available' : 'Not Available',
        parking: amenities.parking !== 'none' ? 'Available' : 'Not Available',
        waterStorageFacility: 'Available',
        security: 'Available',
        wifi: amenities.wifi ? 'Available' : 'Not Available',
        meals: amenities.mess ? 'breakfast' : 'none',
        laundry: amenities.laundry === 'yes' ? 'included' : 'not-available',
        commonArea: amenities.commonTv ? 'tv-room' : undefined,
        cleaning: amenities.roomCleaning === 'yes' ? 'daily' : 'self',
        roomAmenities: {
          cupboard: roomDetails.roomAmenities.cupboard,
          geyser: roomDetails.roomAmenities.geyser,
          tv: roomDetails.roomAmenities.tv,
          ac: roomDetails.roomAmenities.ac,
          bedding: roomDetails.roomAmenities.bedding,
          attachedBathroom: roomDetails.roomAmenities.attachedBathroom,
        },
        directionsTip: amenities.directionsTip
      },
      gallery,
      additionalInfo: {
        description: '',
        previousOccupancy: '',
        paintingRequired: '',
        cleaningRequired: '',
      },
      scheduleInfo
    }
  });

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData);
    setIsSubmitted(true);
  };

  const hasPhotos = useMemo(() => {
    return gallery.images && gallery.images.length > 0;
  }, [gallery.images]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen bg-gray-50">
          {/* Desktop Layout */}
          <div className="hidden lg:flex w-full">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <PgHostelSidebar 
                currentStep={7} // All steps completed
                completedSteps={[1, 2, 3, 4, 5, 6, 7]} 
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
                        <p className="text-sm sm:text-base text-red-700 font-medium">Your PG/Hostel is submitted successfully!</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsSubmitted(false);
                          setCurrentStep(1);
                        }} 
                        className="border-gray-500 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Edit Property
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => window.open(`/property/${createdSubmissionId}`, '_blank')} 
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
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Find tenants faster with our premium plans!</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">Unlock access to 100% tenants and enjoy a super-fast booking.</p>

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
                              <span className="text-gray-700">5X more responses from tenants</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <span className="text-gray-700">No direct calls from tenants</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <Button
                          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 w-full sm:w-auto"
                          onClick={() => window.open('/plans?tab=buyer', '_blank')}
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
                              Your property will be live but in order to get the right tenant faster, we suggest to upload your property photos ASAP
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
                              setCurrentStep(6);
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
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Excellent! You have uploaded photos</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-3">
                            Your PG/Hostel now has <strong>2X better visibility</strong> and will attract more potential tenants. Properties with photos get rented out much faster!
                          </p>
                          <div className="text-xs sm:text-sm text-gray-700">
                            <p className="mb-1">✅ <strong>Higher visibility</strong> in search results</p>
                            <p className="mb-1">✅ <strong>More tenant inquiries</strong> and faster bookings</p>
                            <p className="mb-0">✅ <strong>Professional appearance</strong> that builds trust</p>
                          </div>
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
                            Your property will be live but in order to get the right tenant faster, we suggest to upload your property photos ASAP
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
                      <p className="text-sm sm:text-base text-red-700 font-medium">Your PG/Hostel is submitted successfully!</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setCurrentStep(1);
                      }} 
                      className="border-gray-500 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Property
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => window.open(`/property/${createdSubmissionId}`, '_blank')} 
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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Find tenants faster with our premium plans!</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">Unlock access to 100% tenants and enjoy a super-fast booking.</p>

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
                            <span className="text-gray-700">5X more responses from tenants</span>
                          </div>
                          <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700">No direct calls from tenants</span>
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
                              Your property will be live but in order to get the right tenant faster, we suggest to upload your property photos ASAP
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
                              setCurrentStep(6);
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
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Excellent! You have uploaded photos</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-3">
                            Your PG/Hostel now has <strong>2X better visibility</strong> and will attract more potential tenants. Properties with photos get rented out much faster!
                          </p>
                          <div className="text-xs sm:text-sm text-gray-700">
                            <p className="mb-1">✅ <strong>Higher visibility</strong> in search results</p>
                            <p className="mb-1">✅ <strong>More tenant inquiries</strong> and faster bookings</p>
                            <p className="mb-0">✅ <strong>Professional appearance</strong> that builds trust</p>
                          </div>
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
                            Your property will be live but in order to get the right tenant faster, we suggest to upload your property photos ASAP
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <PgHostelSidebar 
            currentStep={currentStep} 
            completedSteps={completedSteps} 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          <div className="flex-1 p-4 pb-20">
            <div className="bg-white max-w-4xl mx-auto">
              {currentStep === 1 && (
                <PgHostelRoomTypeStep
                  initialData={roomTypes}
                  onNext={handleRoomTypesNext}
                  onBack={prevStep}
            currentStep={1}
            totalSteps={6}
          />
        )}

        {currentStep === 2 && (
                <PgHostelRoomDetailsStep
                  initialData={roomDetails}
                  roomTypes={roomTypes}
                  onNext={handleRoomDetailsNext}
            onBack={prevStep}
                  currentStep={2}
            totalSteps={6}
          />
        )}

        {currentStep === 3 && (
                <PgHostelLocalityDetailsStep
                  initialData={localityDetails}
                  onNext={handleLocalityDetailsNext}
                  onBack={prevStep}
                  currentStep={3}
                  totalSteps={6}
                />
              )}

              {currentStep === 4 && (
                <PgHostelPgDetailsStep
                  initialData={pgDetails}
                  onNext={handlePgDetailsNext}
                  onBack={prevStep}
                  currentStep={4}
                  totalSteps={6}
                />
              )}

              {currentStep === 5 && (
                <PgHostelAmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                  currentStep={5}
                  totalSteps={6}
                />
              )}

              {currentStep === 6 && (
                <PgHostelGalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                  currentStep={6}
                  totalSteps={6}
                />
              )}

              {currentStep === 7 && (
                <PgHostelScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                  currentStep={7}
                  totalSteps={6}
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
                  if (currentStep === 1) {
                    handleRoomTypesNext(roomTypes);
                  } else if (currentStep === 2) {
                    handleRoomDetailsNext(roomDetails);
                  } else if (currentStep === 3) {
                    handleLocalityDetailsNext(localityDetails);
                  } else if (currentStep === 4) {
                    handlePgDetailsNext(pgDetails);
                  } else if (currentStep === 5) {
                    handleAmenitiesNext(amenities);
                  } else if (currentStep === 6) {
                    handleGalleryNext(gallery);
                  } else if (currentStep === 7) {
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

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 px-4 pt-8 pb-4 md:pt-12 lg:pt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentStep === 1 && 'Room Types'}
              {currentStep === 2 && 'Room Details'}
              {currentStep === 3 && 'Locality Details'}
              {currentStep === 4 && 'PG Details'}
              {currentStep === 5 && 'Amenities'}
              {currentStep === 6 && 'Gallery'}
              {currentStep === 7 && 'Schedule'}
            </h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
          <PgHostelRoomTypeStep
            initialData={roomTypes}
            onNext={handleRoomTypesNext}
            onBack={prevStep}
                currentStep={1}
            totalSteps={6}
          />
        )}

            {currentStep === 2 && (
          <PgHostelRoomDetailsStep
            initialData={roomDetails}
            roomTypes={roomTypes}
            onNext={handleRoomDetailsNext}
            onBack={prevStep}
                currentStep={2}
            totalSteps={6}
          />
        )}

            {currentStep === 3 && (
          <PgHostelLocalityDetailsStep
            initialData={localityDetails}
            onNext={handleLocalityDetailsNext}
            onBack={prevStep}
                currentStep={3}
            totalSteps={6}
          />
        )}

            {currentStep === 4 && (
          <PgHostelPgDetailsStep
            initialData={pgDetails}
            onNext={handlePgDetailsNext}
                onBack={prevStep}
                currentStep={4}
                totalSteps={6}
              />
            )}

            {currentStep === 5 && (
              <PgHostelAmenitiesStep
                initialData={amenities}
                onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={6}
          />
        )}

            {currentStep === 6 && (
          <PgHostelGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
                currentStep={6}
            totalSteps={6}
          />
        )}

            {currentStep === 7 && (
          <PgHostelScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
                currentStep={7}
            totalSteps={6}
          />
        )}

          {/* Sticky Bottom Navigation Bar - Hidden on Preview step */}
          {currentStep !== 10 && (
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
                  console.log('PGHostelMultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Always scroll to top first
                  scrollToTop();
                  
                  // Directly call the appropriate handler based on current step
                  if (currentStep === 1) {
                    console.log('Calling handleRoomTypeNext');
                    handleRoomTypesNext(roomTypes);
                  } else if (currentStep === 2) {
                    console.log('Calling handleRoomDetailsNext');
                    handleRoomDetailsNext(roomDetails);
                  } else if (currentStep === 3) {
                    console.log('Calling handleLocalityDetailsNext');
                    handleLocalityDetailsNext(localityDetails);
                  } else if (currentStep === 4) {
                    console.log('Calling handlePgDetailsNext');
                    handlePgDetailsNext(pgDetails);
                  } else if (currentStep === 5) {
                    console.log('Calling handleAmenitiesNext');
                    handleAmenitiesNext(amenities);
                  } else if (currentStep === 6) {
                    console.log('Calling handleGalleryNext');
                    handleGalleryNext(gallery);
                  } else if (currentStep === 7) {
                    console.log('Calling handleScheduleNext');
                    handleScheduleNext(scheduleInfo);
                  }
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                Save & Continue
              </Button>
            </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};