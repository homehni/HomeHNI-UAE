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
import { FlattmatesPreviewStep } from './FlattmatesPreviewStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { Home, MapPin, DollarSign, Star, Camera, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPriceSuggestionsEmail } from '@/services/emailService';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyGallery, AdditionalInfo, ScheduleInfo, FlattmatesFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { Eye } from 'lucide-react';

interface FlattmatesMultiStepFormProps {
  onSubmit: (data: FlattmatesFormData, draftId?: string | null) => void;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(createdSubmissionId);
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
    apartmentName: '', // Add apartment name field
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

  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Handle preview functionality
  const handlePreview = async () => {
    if (!draftId) {
      toast({
        title: "No Preview Available",
        description: "Please complete at least one step to preview your property.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Open preview in new tab using the unified preview page
      window.open(`/buy/preview/${draftId}/detail`, '_blank');
    } catch (error) {
      console.error('Error opening preview:', error);
      toast({
        title: "Preview Error",
        description: "Failed to open preview. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  // Load draft data if resuming from a draft
  useEffect(() => {
    const resumeDraftId = sessionStorage.getItem('resumeDraftId');
    const resumeDraftData = sessionStorage.getItem('resumeDraftData');
    
    if (resumeDraftId && resumeDraftData) {
      try {
        const draftData = JSON.parse(resumeDraftData);
        console.log('Loading draft data for FlattmatesMultiStepForm:', draftData);
        
        // Load form data from draft
        if (draftData.propertyDetails) {
          setPropertyDetails(draftData.propertyDetails);
        }
        if (draftData.locationDetails) {
          setLocationDetails(draftData.locationDetails);
        }
        if (draftData.rentalDetails) {
          setRentalDetails(draftData.rentalDetails);
        }
        if (draftData.amenities) {
          setAmenities(draftData.amenities);
        }
        if (draftData.gallery) {
          setGallery(draftData.gallery);
        }
        if (draftData.additionalInfo) {
          setAdditionalInfo(draftData.additionalInfo);
        }
        if (draftData.scheduleInfo) {
          setScheduleInfo(draftData.scheduleInfo);
        }
        
        // Set draft ID for saving
        setDraftId(resumeDraftId);
        
        // Clear sessionStorage after loading
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
        
        console.log('Successfully loaded draft data for FlattmatesMultiStepForm');
      } catch (error) {
        console.error('Error loading draft data:', error);
        // Clear sessionStorage on error
        sessionStorage.removeItem('resumeDraftId');
        sessionStorage.removeItem('resumeDraftData');
      }
    }
  }, []);

  // Navigate to target step after draft data is loaded
  useEffect(() => {
    if (targetStep && targetStep > 0 && targetStep <= 7 && draftId) {
      console.log('Flatmates navigating to target step after draft loaded:', targetStep);
      setCurrentStep(targetStep);
    }
  }, [targetStep, draftId]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validation function for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!propertyDetails.apartmentType || !propertyDetails.bhkType) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required property details.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!locationDetails.city || !locationDetails.locality) {
          toast({
            title: "Missing Information", 
            description: "Please fill in all required location details.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!rentalDetails.expectedRent || rentalDetails.expectedRent <= 0) {
          toast({
            title: "Missing Information",
            description: "Please enter a valid expected rent amount.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Handle sticky button click - trigger form submission for proper validation
  const handleStickyButtonClick = () => {
    console.log('Flatmates sticky button clicked, step:', currentStep);
    
    // Trigger form submission to get the latest form data with validation
    const allForms = Array.from(document.querySelectorAll('form')) as HTMLFormElement[];
    const visibleForm = allForms.find(f => {
      const rects = f.getClientRects();
      const isVisible = rects.length > 0 && (f as any).offsetParent !== null;
      const style = window.getComputedStyle(f);
      return isVisible && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }) || allForms[0] || null;

    if (visibleForm) {
      console.log('Sticky button: Triggering requestSubmit on visible form for step', currentStep, visibleForm);
      if (typeof visibleForm.requestSubmit === 'function') {
        visibleForm.requestSubmit();
      } else {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        visibleForm.dispatchEvent(submitEvent);
      }
    } else {
      console.warn('No visible form found for step:', currentStep);
    }
    
    // Always scroll to top for better UX
    scrollToTop();
  };

  useEffect(() => {
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const currentFormId = 'flatmates-step-form';

  // Function to save intermediate data to database
  const saveIntermediateData = async (stepData: any, stepNumber: number) => {
    try {
      console.log(`=== saveIntermediateData CALLED ===`);
      console.log(`Saving intermediate data for step ${stepNumber}:`, stepData);
      
      // Save to localStorage as backup
      localStorage.setItem('flatmates-form-data', JSON.stringify(stepData));
      console.log('Saved to localStorage as backup:', stepData);

      // Use PropertyDraftService.saveFormData for proper form handling
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        stepData,
        stepNumber,
        'flatmates' // Use 'flatmates' as the form type for Flatmates properties
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Draft saved successfully with ID:', savedDraft.id);
        
        // Update the property_type and listing_type for Flatmates properties
        await PropertyDraftService.updateDraft(savedDraft.id, {
          property_type: 'Flatmates', // Use proper case
          listing_type: 'Flatmates' // Use proper case, not 'rent'
        });
        console.log('Updated property_type and listing_type to Flatmates');
      }

      console.log(`=== saveIntermediateData COMPLETED ===`);
    } catch (error) {
      console.error('Error saving intermediate data:', error);
      toast({
        title: "Save Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePropertyDetailsNext = async (data: any) => {
    console.log('=== handlePropertyDetailsNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Property Details data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating propertyDetails state...');
      console.log('Previous propertyDetails:', propertyDetails);
      console.log('New data to set:', data);
      setPropertyDetails(data);
      setCompletedSteps(prev => prev.includes(1) ? prev : [...prev, 1]);
      
      // Save intermediate data
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 1);
      
      // Navigate to next step
      console.log('Navigating to step 2...');
      setCurrentStep(2);
      scrollToTop();
      console.log('=== handlePropertyDetailsNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handlePropertyDetailsNext:', error);
      // Still navigate even if save fails
      setCurrentStep(2);
      scrollToTop();
    }
  };

  const handleLocationDetailsNext = async (data: LocationDetails) => {
    console.log('=== handleLocationDetailsNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Location Details data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating locationDetails state...');
      setLocationDetails(data);
      setCompletedSteps(prev => prev.includes(2) ? prev : [...prev, 2]);
      
      // Save intermediate data
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 2);
      
      // Navigate to next step
      console.log('Navigating to step 3...');
      setCurrentStep(3);
      scrollToTop();
      console.log('=== handleLocationDetailsNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handleLocationDetailsNext:', error);
      // Still navigate even if save fails
      setCurrentStep(3);
      scrollToTop();
    }
  };

  const handleRentalDetailsNext = async (data: any) => {
    console.log('=== handleRentalDetailsNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Rental Details data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating rentalDetails state...');
      setRentalDetails(data);
      setCompletedSteps(prev => prev.includes(3) ? prev : [...prev, 3]);
      
      // Save intermediate data
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 3);
      
      // Navigate to next step
      console.log('Navigating to step 4...');
      setCurrentStep(4);
      scrollToTop();
      console.log('=== handleRentalDetailsNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handleRentalDetailsNext:', error);
      // Still navigate even if save fails
      setCurrentStep(4);
      scrollToTop();
    }
  };

  const handleAmenitiesNext = async (data: any) => {
    console.log('=== handleAmenitiesNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Amenities data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating amenities state...');
      setAmenities(data);
      setCompletedSteps(prev => prev.includes(4) ? prev : [...prev, 4]);
      
      // Save intermediate data
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 4);
      
      // Navigate to next step
      console.log('Navigating to step 5...');
      setCurrentStep(5);
      scrollToTop();
      console.log('=== handleAmenitiesNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handleAmenitiesNext:', error);
      // Still navigate even if save fails
      setCurrentStep(5);
      scrollToTop();
    }
  };

  const handleGalleryNext = async (data: PropertyGallery) => {
    console.log('=== handleGalleryNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Gallery data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating gallery state...');
      setGallery(data);
      setCompletedSteps(prev => prev.includes(5) ? prev : [...prev, 5]);
      
      // Save intermediate data
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 5);
      
      // Navigate to next step
      console.log('Navigating to step 6...');
      setCurrentStep(6);
      scrollToTop();
      console.log('=== handleGalleryNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handleGalleryNext:', error);
      // Still navigate even if save fails
      setCurrentStep(6);
      scrollToTop();
    }
  };

  const handleScheduleNext = async (data: ScheduleInfo) => {
    console.log('=== handleScheduleNext CALLED ===');
    console.log('FlattmatesMultiStepForm - Schedule data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    
    try {
      // Update state first
      console.log('Updating scheduleInfo state...');
      setScheduleInfo(data);
      setCompletedSteps(prev => prev.includes(6) ? prev : [...prev, 6]);
      
      // Save intermediate data before final submission
      console.log('Calling saveIntermediateData...');
      await saveIntermediateData(data, 6);
      
      // Mark the draft as completed after successful submission
      if (draftId) {
        console.log('[FlattmatesMultiStepForm] Marking draft as completed:', draftId);
        try {
          await PropertyDraftService.updateDraft(draftId, { 
            is_completed: true,
            current_step: 7 // Mark as completed at preview step
          });
        } catch (error) {
          console.error('[FlattmatesMultiStepForm] Error marking draft as completed:', error);
        }
      }
      
      // Final submission
      console.log('Preparing final submission...');
      const formData = getFormData();
      console.log('FlattmatesMultiStepForm - Submitting at Schedule step with data:', formData);
      onSubmit(formData, draftId);
      setCurrentStep(7);
      scrollToTop();
      console.log('=== handleScheduleNext COMPLETED ===');
    } catch (error) {
      console.error('Error in handleScheduleNext:', error);
      // Still proceed with submission even if save fails
      const formData = getFormData();
      onSubmit(formData);
      setCurrentStep(7);
      scrollToTop();
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };
  const goToStep = (step: number) => setCurrentStep(step);

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
          locality: locationDetails?.locality || 'your area',
          rangeMin: Math.round((rentalDetails?.expectedRent || 0) * 0.8),
          rangeMax: Math.round((rentalDetails?.expectedRent || 0) * 1.2),
          yourPrice: rentalDetails?.expectedRent || 0,
          propertyType: 'flatmates',
          listingType: 'rent',
          userType: 'owner'
        }
      );

      if (result.success) {
        toast({
          title: "Premium Plans Sent!",
          description: "Check your email for personalized flatmates premium plan recommendations.",
        });
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
      window.open('/plans?tab=owner', '_blank');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const getFormData = (): FlattmatesFormData => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails: {
        title: propertyDetails.apartmentName 
          ? `${propertyDetails.bhkType} ${propertyDetails.apartmentType} - ${propertyDetails.apartmentName} for Flatmates`
          : `${propertyDetails.bhkType} ${propertyDetails.apartmentType} for Flatmates`,
        propertyType: 'apartment',
        buildingType: propertyDetails.apartmentType,
        apartmentName: propertyDetails.apartmentName, // Include apartment name
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

  const handleSubmit = async () => {
    console.log('FlattmatesMultiStepForm - Final submission called');
    
    // Mark the draft as completed after successful submission
    if (draftId) {
      console.log('[FlattmatesMultiStepForm] Marking draft as completed in handleSubmit:', draftId);
      try {
        await PropertyDraftService.updateDraft(draftId, { 
          is_completed: true,
          current_step: 7 // Mark as completed at preview step
        });
      } catch (error) {
        console.error('[FlattmatesMultiStepForm] Error marking draft as completed:', error);
      }
    }
    
    const formData = getFormData();
    console.log('FlattmatesMultiStepForm - Complete form data:', formData);
    onSubmit(formData, draftId);
    setIsSubmitted(true);
  };

  const handlePreviewListing = () => {
    if (createdSubmissionId) {
      window.open(`/buy/preview/${createdSubmissionId}/detail`, '_blank');
    } else {
      window.open('/search', '_blank');
    }
  };

  const handleSendPhotos = () => {
    const phoneNumber = '+91 80740 17388';
    const message = encodeURIComponent('Upload the photos');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
    { title: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { title: 'Preview', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <PropertyFormSidebar
              currentStep={7} // All steps completed
              completedSteps={[1, 2, 3, 4, 5, 6, 7]}
              steps={sidebarSteps}
              onPreview={handlePreview}
              draftId={draftId}
              isSavingDraft={isSavingDraft}
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
                      <h2 className="text-lg sm:text-xl font-semibold text-red-800 mb-1">Congratulations!</h2>
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
                      className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-full sm:w-auto"
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
                        onClick={handleGoPremium}
                        disabled={isEmailLoading}
                      >
                        {isEmailLoading ? 'Sending...' : 'Go Premium'}
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
                          <Button 
                            size="sm" 
                            className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                            onClick={handleSendPhotos}
                          >
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
            <GetTenantsFasterSection ownerInfo={ownerInfo} />
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
                    <h2 className="text-lg sm:text-xl font-semibold text-red-800 mb-1">Congratulations!</h2>
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
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-full sm:w-auto"
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
                      onClick={handleGoPremium}
                      disabled={isEmailLoading}
                    >
                      {isEmailLoading ? 'Sending...' : 'Go Premium'}
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
                        <Button 
                          size="sm" 
                          className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                          onClick={handleSendPhotos}
                        >
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
        <div className="p-4 pb-28 sm:pb-32">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {currentStep === 1 && (
              <FlattmatesPropertyDetailsStep
                key={`step-1-${JSON.stringify(propertyDetails)}`}
                initialData={(() => {
                  console.log('Passing propertyDetails as initialData:', propertyDetails);
                  return propertyDetails;
                })()}
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
              <>
            <ScheduleStep
              initialData={scheduleInfo}
              onNext={handleScheduleNext}
              onBack={prevStep}
              onSubmit={handleScheduleNext}
              ownerInfo={ownerInfo}
              propertyInfo={{
                propertyDetails,
                locationDetails,
                rentalDetails,
                amenities,
                gallery,
                additionalInfo,
                scheduleInfo
              }}
            />
              </>
            )}

            {currentStep === 7 && (
              <FlattmatesPreviewStep
                formData={getFormData()}
                onBack={prevStep}
                onEdit={goToStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                previewPropertyId={createdSubmissionId || undefined}
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
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          {/* Form Content - Scrollable */}
          <div className="flex-1 p-2 pb-20">
              {currentStep === 1 && (
                <FlattmatesPropertyDetailsStep
                  key={`mobile-step-1-${JSON.stringify(propertyDetails)}`}
                  initialData={propertyDetails}
                  onNext={handlePropertyDetailsNext}
                  onBack={() => {}} // No back on first step
                  currentStep={currentStep}
                  totalSteps={7}
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
                totalSteps={7}
                formId={currentFormId}
              />
            )}

            {currentStep === 3 && (
              <FlattmatesRentalDetailsStep
                initialData={rentalDetails}
                onNext={handleRentalDetailsNext}
                onBack={prevStep}
                currentStep={currentStep}
                totalSteps={7}
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
                  onSubmit={handleScheduleNext}
                  ownerInfo={ownerInfo}
                  propertyInfo={{
                    propertyDetails,
                    locationDetails,
                    rentalDetails,
                    amenities,
                    gallery,
                    additionalInfo,
                    scheduleInfo
                  }}
                />
              )}

              {currentStep === 7 && (
                <FlattmatesPreviewStep
                  formData={getFormData()}
                  onBack={prevStep}
                  onEdit={goToStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  previewPropertyId={createdSubmissionId || undefined}
                />
              )}
          </div>


        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar - Visible on all screens */}
      {currentStep !== 7 && (
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
              onClick={handleStickyButtonClick}
              className="h-12 sm:h-10 px-6 sm:px-6 bg-[#22c55e] hover:bg-[#16a34a] text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
            >
              {currentStep === 6 ? 'Submit Property' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
