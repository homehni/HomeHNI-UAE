import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PgHostelSidebar } from './PgHostelSidebar';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { ArrowLeft, CheckCircle, Check } from 'lucide-react';
import { sendPriceSuggestionsEmail } from '@/services/emailService';

import { PgHostelRoomTypeStep } from './PgHostelRoomTypeStep';
import { PgHostelRoomDetailsStep } from './PgHostelRoomDetailsStep';
import { PgHostelLocalityDetailsStep } from './PgHostelLocalityDetailsStep';
import { PgHostelPgDetailsStep } from './PgHostelPgDetailsStep';
import { PgHostelAmenitiesStep } from './PgHostelAmenitiesStep';
import { PgHostelGalleryStep } from './PgHostelGalleryStep';
import { PgHostelScheduleStep } from './PgHostelScheduleStep';
import { PreviewStep } from './PreviewStep';
import { PGHostelFormData, OwnerInfo } from '@/types/property';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { Eye } from 'lucide-react';

// Define local interfaces to match the components
interface LocalOwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  whatsappUpdates: boolean;
}

interface LocalPropertyInfo {
  title: string;
  propertyType: string;
}

interface LocalRoomTypes {
  selectedTypes: ('single' | 'double' | 'three' | 'four')[];
}

interface LocalRoomDetails {
  roomTypeDetails: Record<string, {
    expectedRent: number;
    expectedDeposit: number;
    availableRooms: number;
  }>;
  roomAmenities: {
    cupboard: boolean;
    geyser: boolean;
    tv: boolean;
    ac: boolean;
    bedding: boolean;
    attachedBathroom: boolean;
  };
}

interface LocalLocalityDetails {
  state: string;
  city: string;
  locality: string;
  pincode: string;
  societyName: string;
  landmark: string;
}

interface LocalPgDetails {
  genderPreference: 'male' | 'female' | 'anyone';
  preferredGuests: string;
  gateClosingTime: string;
  foodIncluded: string;
}

interface LocalAmenities {
  laundry: '' | 'yes' | 'no';
  roomCleaning: '' | 'yes' | 'no';
  wardenFacility: '' | 'yes' | 'no';
  waterStorageFacility: boolean;
  wifi: boolean;
  commonTv: boolean;
  refrigerator: boolean;
  mess: boolean;
  cookingAllowed: boolean;
  powerBackup: boolean;
  lift: boolean;
  parking: string;
  security: string;
  currentPropertyCondition: string;
  directionsTip: string;
}

interface LocalGallery {
  images: File[];
  video: string | null;
}

interface LocalScheduleInfo {
  startTime: string;
  endTime: string;
  availability: string;
  availableAllDay: boolean;
  cleaningService: string;
  paintingService: string;
}

interface PGHostelMultiStepFormProps {
  onSubmit: (data: PGHostelFormData, submittedDraftId?: string | null) => void;
  isSubmitting: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number;
  createdSubmissionId?: string | null;
}

export const PGHostelMultiStepForm: React.FC<PGHostelMultiStepFormProps> = ({
  onSubmit,
  isSubmitting,
  initialOwnerInfo = {},
  targetStep,
  createdSubmissionId
}) => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  
  // Track one-time auto-navigation to congratulations page
  const hasNavigatedToCongratulations = React.useRef(false);

  // Navigate to congratulations page once if submission is complete
  React.useEffect(() => {
    if (createdSubmissionId && !hasNavigatedToCongratulations.current) {
      console.log('PG/Hostel submission complete, navigating to congratulations page');
      hasNavigatedToCongratulations.current = true;
      setCurrentStep(7);
    }
  }, [createdSubmissionId]);
  
  // Load draft data if resuming from a draft
  React.useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    console.log('PGHostelMultiStepForm checking for draft data:', { resumeDraftId, resumeDraftData: !!resumeDraftData });
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const draftData = JSON.parse(resumeDraftData);
        console.log('PGHostelMultiStepForm loading draft data:', draftData);
        console.log('PGHostelMultiStepForm draft data structure:', {
          ownerInfo: draftData.ownerInfo,
          propertyInfo: draftData.propertyInfo,
          roomTypes: draftData.roomTypes,
          roomDetails: draftData.roomDetails,
          localityDetails: draftData.localityDetails,
          pgDetails: draftData.pgDetails,
          amenities: draftData.amenities,
          gallery: draftData.gallery,
          scheduleInfo: draftData.scheduleInfo
        });
        
        // Load owner info from draft
        if (draftData.ownerInfo || (draftData.owner_name && draftData.owner_email)) {
          const ownerData = draftData.ownerInfo || {
            fullName: draftData.owner_name,
            phoneNumber: draftData.owner_phone,
            email: draftData.owner_email,
            city: draftData.city || '',
            whatsappUpdates: draftData.whatsapp_updates || false
          };
          console.log('PGHostelMultiStepForm setting ownerInfo:', ownerData);
          setOwnerInfo(ownerData);
        }
        
        // Load property info from draft
        if (draftData.propertyInfo || draftData.apartment_name) {
          const propertyData = draftData.propertyInfo || {
            title: draftData.apartment_name || '',
            propertyType: draftData.property_type || 'PG/Hostel'
          };
          console.log('PGHostelMultiStepForm setting propertyInfo:', propertyData);
          setPropertyInfo(propertyData);
        }
        
        // Load form data from draft
        if (draftData.roomTypes) {
          console.log('PGHostelMultiStepForm setting roomTypes:', draftData.roomTypes);
          setRoomTypes(draftData.roomTypes);
        }
        if (draftData.roomDetails) {
          console.log('PGHostelMultiStepForm setting roomDetails:', draftData.roomDetails);
          setRoomDetails(draftData.roomDetails);
        }
        if (draftData.localityDetails || draftData.locality) {
          const localityData = draftData.localityDetails || {
            state: draftData.state || '',
            city: draftData.city || '',
            locality: draftData.locality || '',
            pincode: draftData.pincode || '',
            societyName: draftData.society_name || '',
            landmark: draftData.landmark || ''
          };
          console.log('PGHostelMultiStepForm setting localityDetails:', localityData);
          setLocalityDetails(localityData);
        }
        if (draftData.pgDetails) {
          console.log('PGHostelMultiStepForm setting pgDetails:', draftData.pgDetails);
          setPgDetails(draftData.pgDetails);
        }
        if (draftData.amenities) {
          console.log('PGHostelMultiStepForm setting amenities:', draftData.amenities);
          setAmenities(draftData.amenities);
        }
        if (draftData.gallery) {
          console.log('PGHostelMultiStepForm setting gallery:', draftData.gallery);
          setGallery(draftData.gallery);
        }
        if (draftData.scheduleInfo || draftData.schedule_info) {
          const scheduleData = draftData.scheduleInfo || draftData.schedule_info;
          console.log('PGHostelMultiStepForm setting scheduleInfo:', scheduleData);
          setScheduleInfo(scheduleData);
        }
        
        // Set draft ID for saving
        setDraftId(resumeDraftId);
        console.log('PGHostelMultiStepForm set draftId:', resumeDraftId);
        
        // Clear sessionStorage after loading
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
        
        console.log('Successfully loaded draft data for PGHostelMultiStepForm');
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, []);

  // Navigate to target step if provided
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 8) {
      console.log('PG/Hostel navigating to target step:', targetStep);
      setCurrentStep(targetStep);
    }
  }, [targetStep]);

  // Navigate to target step after draft data is loaded
  const hasNavigatedToTargetStep = React.useRef(false);
  React.useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 8 && draftId && !hasNavigatedToTargetStep.current) {
      console.log('PG/Hostel navigating to target step after draft loaded:', targetStep);
      setCurrentStep(targetStep);
      hasNavigatedToTargetStep.current = true;
    }
  }, [targetStep, draftId]);

  // Skip owner info and property info - start from room details
  const [currentStep, setCurrentStep] = useState(1);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  
  // Total steps is 8 (including schedule and congratulations page)
  const totalSteps = 8;
  
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
    roomTypeDetails: {} as Record<string, {
      expectedRent: number;
      expectedDeposit: number;
      availableRooms: number;
    }>,
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
    landmark: '',
  });

  const [pgDetails, setPgDetails] = useState({
    genderPreference: 'anyone' as 'male' | 'female' | 'anyone',
    preferredGuests: '',
    gateClosingTime: '',
    foodIncluded: '',
  });

  const [amenities, setAmenities] = useState({
    laundry: '' as '' | 'yes' | 'no',
    roomCleaning: '' as '' | 'yes' | 'no',
    wardenFacility: '' as '' | 'yes' | 'no',
    waterStorageFacility: false,
    wifi: false,
    commonTv: false,
    refrigerator: false,
    mess: false,
    cookingAllowed: false,
    powerBackup: false,
    lift: false,
    parking: '',
    security: '',
    currentPropertyCondition: '',
    directionsTip: '',
  });

  const [gallery, setGallery] = useState({
    images: [] as File[],
    video: null as string | null,
  });

  const [scheduleInfo, setScheduleInfo] = useState({
    startTime: '',
    endTime: '',
    availability: '',
    availableAllDay: false,
    cleaningService: '',
    paintingService: '',
  });

  // Navigation functions
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Draft service
  const draftService = PropertyDraftService;

  // Save draft and move to next step
  const saveDraftAndNext = async (stepNumber: number, stepData: any) => {
    try {
      setIsSavingDraft(true);
      
      if (!draftId && !isCreatingDraft) {
        // Prevent multiple draft creation
        setIsCreatingDraft(true);
        try {
          // Create new draft
          const newDraft = await draftService.createDraft({
            user_id: ownerInfo.email || 'anonymous',
            property_type: 'PG/Hostel',
            listing_type: 'Rent',
            owner_name: ownerInfo.fullName,
            owner_email: ownerInfo.email,
            owner_phone: ownerInfo.phoneNumber,
            whatsapp_updates: ownerInfo.whatsappUpdates,
            additional_info: {}
          });
          setDraftId(newDraft.id);
          console.log('Created new PG/Hostel draft:', newDraft.id);
        } finally {
          setIsCreatingDraft(false);
        }
      }
      
      // Wait for draft ID to be set
      const currentDraftId = draftId || await new Promise<string>((resolve) => {
        const checkDraftId = setInterval(() => {
          if (draftId) {
            clearInterval(checkDraftId);
            resolve(draftId);
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkDraftId);
          resolve('');
        }, 5000);
      });
      
      if (!currentDraftId) {
        throw new Error('Failed to create draft');
      }
      
      // Save form data
      await draftService.saveFormData(currentDraftId, stepData, stepNumber, 'pg_hostel');
      
      // Update completed steps
      setCompletedSteps(prev => [...prev.filter(step => step !== stepNumber), stepNumber]);
      
      // Toast notification disabled for PG/Hostel form
      // toast({
      //   title: "Progress Saved",
      //   description: "Your progress has been saved successfully.",
      // });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Save Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle preview functionality
  const handlePreview = async () => {
    if (draftId) {
      window.open(`/buy/preview/${draftId}/detail`, '_blank');
    }
  };

  // Step handlers
  const handleRoomTypesNext = async (data: any) => {
    setRoomTypes(data);
    await saveDraftAndNext(1, data);
    nextStep();
  };

  const handleRoomDetailsNext = async (data: any) => {
    setRoomDetails(data);
    await saveDraftAndNext(2, data);
    nextStep();
  };

  const handleLocalityDetailsNext = async (data: any) => {
    setLocalityDetails(data);
    await saveDraftAndNext(3, data);
    nextStep();
  };

  const handlePgDetailsNext = async (data: any) => {
    setPgDetails(data);
    await saveDraftAndNext(4, data);
    nextStep();
  };

  const handleAmenitiesNext = async (data: any) => {
    setAmenities(data);
    await saveDraftAndNext(5, data);
    nextStep();
  };

  const handleGalleryNext = async (data: any) => {
    setGallery(data);
    await saveDraftAndNext(6, data);
    nextStep();
  };

  const handleScheduleNext = async (data: any) => {
    console.log('PGHostelMultiStepForm - handleScheduleNext called with data:', data);
    setScheduleInfo(data);
    await saveDraftAndNext(7, data);
    
    // Submit the form and navigate to congratulations page
    const formData = await getFormDataForSubmission();
    console.log('PG/Hostel form data for submission:', formData);
    console.log('PG/Hostel form data structure check:', {
      hasOwnerInfo: 'ownerInfo' in formData,
      hasPropertyInfo: 'propertyInfo' in formData,
      hasPgDetails: 'pgDetails' in formData.propertyInfo,
      hasAdditionalInfo: 'additional_info' in formData.propertyInfo,
      pgDetailsKeys: formData.propertyInfo?.pgDetails ? Object.keys(formData.propertyInfo.pgDetails) : 'no pgDetails',
      additionalInfoKeys: formData.propertyInfo?.additional_info ? Object.keys(formData.propertyInfo.additional_info) : 'no additional_info',
      propertyInfoKeys: formData.propertyInfo ? Object.keys(formData.propertyInfo) : 'no propertyInfo'
    });
    
    try {
      console.log('PGHostelMultiStepForm - About to call onSubmit with draftId:', draftId);
      await onSubmit(formData, draftId);
      console.log('PG/Hostel submission completed successfully');
      setCurrentStep(8);
    } catch (error) {
      console.error('PG/Hostel submission failed:', error);
      // Still navigate to step 8 to show the form, but with error
      setCurrentStep(8);
    }
  };

  // Get form data for submission (async version that fetches draft data)
  const getFormDataForSubmission = async (): Promise<any> => {
    let additionalInfo = {};
    
    // Fetch additional_info from draft if available
    if (draftId) {
      try {
        const draftData = await draftService.getDraft(draftId);
        additionalInfo = draftData?.additional_info || {};
        console.log('PG/Hostel - Retrieved additional_info from draft:', additionalInfo);
      } catch (error) {
        console.warn('PG/Hostel - Failed to fetch draft additional_info:', error);
      }
    }

    return {
      ownerInfo: {
        fullName: ownerInfo.fullName,
        phoneNumber: ownerInfo.phoneNumber,
        email: ownerInfo.email,
        whatsappUpdates: ownerInfo.whatsappUpdates,
        propertyType: 'Residential',
        listingType: 'PG/Hostel',
      },
      propertyInfo: {
        propertyDetails: {
          title: propertyInfo.title,
          propertyType: 'PG/Hostel', // Set the correct property type for PG/Hostel
          buildingType: '',
          bhkType: '',
          propertyAge: '',
          totalFloors: 0,
          floorNo: 0,
          superBuiltUpArea: 0,
          onMainRoad: false,
          cornerProperty: false,
        },
        locationDetails: localityDetails,
        pgDetails: {
          listingType: 'Rent' as const,
          expectedPrice: roomDetails.roomTypeDetails && Object.keys(roomDetails.roomTypeDetails).length > 0 
            ? Object.values(roomDetails.roomTypeDetails)[0]?.expectedRent || 0
            : 0,
          securityDeposit: roomDetails.roomTypeDetails && Object.keys(roomDetails.roomTypeDetails).length > 0 
            ? Object.values(roomDetails.roomTypeDetails)[0]?.expectedDeposit || 0
            : 0,
          // Add other PG/Hostel specific fields from pgDetails
          ...pgDetails
        },
        amenities: amenities,
        gallery: gallery,
        additionalInfo: {
          description: '',
          images: [],
          video: null,
        },
        scheduleInfo: scheduleInfo,
        // PG/Hostel specific fields
        roomTypes,
        roomDetails,
        // Include additional_info from draft
        additional_info: additionalInfo
      }
    };
  };

  // Get form data for rendering (synchronous version)
  const getFormData = (): any => ({
    ownerInfo: {
      fullName: ownerInfo.fullName,
      phoneNumber: ownerInfo.phoneNumber,
      email: ownerInfo.email,
      whatsappUpdates: ownerInfo.whatsappUpdates,
      propertyType: 'Residential',
      listingType: 'PG/Hostel',
    },
    propertyInfo: {
      propertyDetails: {
        title: propertyInfo.title,
        propertyType: 'PG/Hostel', // Set the correct property type for PG/Hostel
        buildingType: '',
        bhkType: '',
        propertyAge: '',
        totalFloors: 0,
        floorNo: 0,
        superBuiltUpArea: 0,
        onMainRoad: false,
        cornerProperty: false,
      },
      locationDetails: localityDetails,
      pgDetails: {
        listingType: 'Rent' as const,
        expectedPrice: roomDetails.roomTypeDetails && Object.keys(roomDetails.roomTypeDetails).length > 0 
          ? Object.values(roomDetails.roomTypeDetails)[0]?.expectedRent || 0
          : 0,
        securityDeposit: roomDetails.roomTypeDetails && Object.keys(roomDetails.roomTypeDetails).length > 0 
          ? Object.values(roomDetails.roomTypeDetails)[0]?.expectedDeposit || 0
          : 0,
        // Add other PG/Hostel specific fields from pgDetails
        ...pgDetails
      },
      amenities: amenities,
      gallery: gallery,
      additionalInfo: {
        description: '',
        images: [],
        video: null,
      },
      scheduleInfo: scheduleInfo,
      // PG/Hostel specific fields
      roomTypes,
      roomDetails,
    }
  });

  const hasPhotos = useMemo(() => {
    return gallery.images && gallery.images.length > 0;
  }, [gallery.images]);

  // No-op submit function since submission already happened in handleScheduleNext
  const handleNoOpSubmit = () => {
    console.log('PG/Hostel: Submission already completed, no-op submit called');
  };

  const handleSendPhotos = () => {
    const phoneNumber = '+91 80740 17388';
    const message = encodeURIComponent('Upload the photos');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendPremiumPlansEmail = async () => {
    try {
      const result = await sendPriceSuggestionsEmail(
        ownerInfo.email || 'test@example.com',
        ownerInfo.fullName || 'Property Owner',
        {
          locality: localityDetails.locality || 'Unknown',
          rangeMin: 0,
          rangeMax: 0,
          yourPrice: 0,
          listingType: 'rent',
          userType: 'owner'
        }
      );

      if (result.success) {
        toast({
          title: "Premium Plans Sent!",
          description: "Check your email for personalized PG/Hostel premium plan recommendations.",
        });
        // Still open the plans page
        window.open('/plans?tab=owner', '_blank');
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
    }
  };

  // Calculate completed steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Sticky button click handler
  const handleStickyButtonClick = () => {
    console.log('PGHostel sticky button clicked, step:', currentStep);
    
    // Trigger form submission for the current step
    const form = document.querySelector('form');
    console.log('PGHostel sticky button - form found:', !!form);
    if (form) {
      console.log('PGHostel sticky button - calling form.requestSubmit()');
      form.requestSubmit();
    } else {
      console.error('PGHostel sticky button - No form found!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 min-h-screen">
          <PgHostelSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
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
                  totalSteps={7}
                />
              )}

              {currentStep === 2 && (
                <PgHostelRoomDetailsStep
                  initialData={roomDetails}
                  roomTypes={roomTypes}
                  onNext={handleRoomDetailsNext}
                  onBack={prevStep}
                  currentStep={2}
                  totalSteps={7}
                />
              )}

              {currentStep === 3 && (
                <PgHostelLocalityDetailsStep
                  initialData={localityDetails}
                  onNext={handleLocalityDetailsNext}
                  onBack={prevStep}
                  currentStep={3}
                  totalSteps={7}
                />
              )}

              {currentStep === 4 && (
                <PgHostelPgDetailsStep
                  initialData={pgDetails as any}
                  onNext={handlePgDetailsNext}
                  onBack={prevStep}
                  currentStep={4}
                  totalSteps={7}
                />
              )}

              {currentStep === 5 && (
                <PgHostelAmenitiesStep
                  initialData={amenities as any}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                  currentStep={5}
                  totalSteps={8}
                />
              )}

              {currentStep === 6 && (
                <PgHostelGalleryStep
                  initialData={gallery as any}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                  currentStep={6}
                  totalSteps={8}
                />
              )}

              {currentStep === 7 && (
                <PgHostelScheduleStep
                  initialData={scheduleInfo as any}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                  onSubmit={handleScheduleNext}
                  ownerInfo={ownerInfo}
                  propertyInfo={getFormData().propertyInfo as any}
                  currentStep={7}
                  totalSteps={8}
                />
              )}

              {currentStep === 8 && (
                <>
                  {console.log('PG/Hostel PreviewStep render - createdSubmissionId:', createdSubmissionId)}
                  <PreviewStep
                    formData={getFormData()}
                    onBack={prevStep}
                    onEdit={setCurrentStep}
                    onSubmit={handleNoOpSubmit}
                    isSubmitting={isSubmitting}
                    previewPropertyId={createdSubmissionId || undefined}
                  />
                </>
              )}
            </div>
          </div>

          {/* Sticky Bottom Navigation Bar - Hidden on Congratulations step */}
          {currentStep !== 8 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentStep === 1 ? () => {} : prevStep}
                  className="h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleStickyButtonClick}
                  className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
                >
                  {currentStep === 8 ? 'Submit Property' : 'Save & Continue'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
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
              {currentStep === 8 && 'Congratulations'}
            </h1>
          </div>
        </div>
        
        <div className="p-4 pb-20">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <PgHostelRoomTypeStep
                initialData={roomTypes}
                onNext={handleRoomTypesNext}
                onBack={prevStep}
                currentStep={1}
                totalSteps={7}
              />
            )}

            {currentStep === 2 && (
              <PgHostelRoomDetailsStep
                initialData={roomDetails}
                roomTypes={roomTypes}
                onNext={handleRoomDetailsNext}
                onBack={prevStep}
                currentStep={2}
                totalSteps={7}
              />
            )}

            {currentStep === 3 && (
              <PgHostelLocalityDetailsStep
                initialData={localityDetails}
                onNext={handleLocalityDetailsNext}
                onBack={prevStep}
                currentStep={3}
                totalSteps={7}
              />
            )}

            {currentStep === 4 && (
              <PgHostelPgDetailsStep
                initialData={pgDetails as any}
                onNext={handlePgDetailsNext}
                onBack={prevStep}
                currentStep={4}
                totalSteps={7}
              />
            )}

            {currentStep === 5 && (
              <PgHostelAmenitiesStep
                initialData={amenities as any}
                onNext={handleAmenitiesNext}
                onBack={prevStep}
                currentStep={5}
                totalSteps={8}
              />
            )}

            {currentStep === 6 && (
              <PgHostelGalleryStep
                initialData={gallery as any}
                onNext={handleGalleryNext}
                onBack={prevStep}
                currentStep={6}
                totalSteps={8}
              />
            )}

            {currentStep === 7 && (
              <PgHostelScheduleStep
                initialData={scheduleInfo as any}
                onNext={handleScheduleNext}
                onBack={prevStep}
                onSubmit={handleScheduleNext}
                ownerInfo={ownerInfo}
                propertyInfo={getFormData().propertyInfo as any}
                currentStep={7}
                totalSteps={8}
              />
            )}

            {currentStep === 8 && (
              <>
                {console.log('PG/Hostel PreviewStep render (mobile) - createdSubmissionId:', createdSubmissionId)}
                <PreviewStep
                  formData={getFormData()}
                  onBack={prevStep}
                  onEdit={setCurrentStep}
                  onSubmit={handleNoOpSubmit}
                  isSubmitting={isSubmitting}
                  previewPropertyId={createdSubmissionId || undefined}
                />
              </>
            )}
          </div>
        </div>

        {/* Sticky Bottom Navigation Bar - Hidden on Congratulations step */}
        {currentStep !== 8 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? () => {} : prevStep}
                className="h-10 px-4 sm:px-6 w-full sm:w-auto order-2 sm:order-1"
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleStickyButtonClick}
                className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                {currentStep === 8 ? 'Submit Property' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
