import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLandPlotPropertyForm } from '@/hooks/useLandPlotPropertyForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { LandPlotPropertyDetailsStep } from './LandPlotPropertyDetailsStep';
import { LandPlotLocationDetailsStep } from './LandPlotLocationDetailsStep';
import { LandPlotSaleDetailsStep } from './LandPlotSaleDetailsStep';
import { LandPlotAmenitiesStep } from './LandPlotAmenitiesStep';
import { LandPlotGalleryStep } from './LandPlotGalleryStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { LandPlotSidebar } from './LandPlotSidebar';

import { LandPlotScheduleStep } from './LandPlotScheduleStep';
import { LandPlotSuccessStep } from './LandPlotSuccessStep';
import { IndustrialLandSuccessStep } from './IndustrialLandSuccessStep';
import { AgriculturalLandSuccessStep } from './AgriculturalLandSuccessStep';
import { CommercialLandSuccessStep } from './CommercialLandSuccessStep';
import { Badge } from '@/components/ui/badge';
import { OwnerInfo, ScheduleInfo, PropertyGallery } from '@/types/property';
import { LandPlotFormData, LandPlotDetails, LandPlotLocationDetails, LandPlotSaleDetails, LandPlotAmenities } from '@/types/landPlotProperty';
import { PropertyDraftService } from '@/services/propertyDraftService';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';

interface LandPlotMultiStepFormProps {
  onSubmit: (data: LandPlotFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
  createdSubmissionId?: string | null;
  listingType?: 'Industrial land' | 'Agricultural Land' | 'Commercial land';
}

export const LandPlotMultiStepForm: React.FC<LandPlotMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null,
  createdSubmissionId,
  listingType = 'Industrial land'
}) => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentFormId = isMobile ? 'landplot-step-form-m' : 'landplot-step-form-d';
  
  console.log('LandPlotMultiStepForm rendering with props:', {
    isSubmitting,
    initialOwnerInfo,
    targetStep,
    createdSubmissionId
  });
  
  const {
    currentStep,
    ownerInfo,
    plotDetails,
    locationDetails,
    saleDetails,
    amenities,
    gallery,
    additionalInfo,
    scheduleInfo,
    nextStep,
    prevStep,
    goToStep,
    updateOwnerInfo,
    updatePlotDetails,
    updateLocationDetails,
    updateSaleDetails,
    updateAmenities,
    updateGallery,
    updateAdditionalInfo,
    updateScheduleInfo,
    getFormData,
    isStepValid
  } = useLandPlotPropertyForm(targetStep || 1);


  // Handle preview functionality
  const handlePreview = async () => {
    if (!draftId) {
      toast({
        title: "No Draft Available",
        description: "Please save your progress first before previewing.",
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

  console.log('LandPlotMultiStepForm currentStep:', currentStep);

  // Ensure plotDetails.landType reflects the selected listingType category
  React.useEffect(() => {
    if (!listingType) return;
    const map: Record<string, 'industrial' | 'agricultural' | 'commercial'> = {
      'Industrial land': 'industrial',
      'Agricultural Land': 'agricultural',
      'Commercial land': 'commercial',
    };
    const mapped = map[listingType];
    if (mapped) {
      const patch: Partial<LandPlotDetails> = { landType: mapped, propertyType: 'Land/Plot' };
      updatePlotDetails(patch);
    }
  }, [listingType, updatePlotDetails]);

  // Initialize with owner info if provided
  React.useEffect(() => {
    if (initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0) {
      updateOwnerInfo(initialOwnerInfo);
    }
  }, [initialOwnerInfo, updateOwnerInfo]);

  // Load draft data if available (without navigation override)
  React.useEffect(() => {
    const loadDraftData = async () => {
      if (targetStep && targetStep >= 1) {
        console.log('LandPlotMultiStepForm - Loading draft data for step:', targetStep);
        try {
          // Get the draft ID from session storage or find it
          const resumeDraftData = sessionStorage.getItem('resumeDraftData');
          
          if (resumeDraftData) {
            const draftData = JSON.parse(resumeDraftData);
            console.log('Loading draft data for LandPlotMultiStepForm:', draftData);
            
            // Load plot details - data is at root level, not in plotDetails object
            const plotDetailsData = {
              plotArea: draftData.plotArea,
              plotAreaUnit: draftData.plotAreaUnit,
              plotLength: draftData.plotLength,
              plotWidth: draftData.plotWidth,
              boundaryWall: draftData.boundaryWall,
              cornerPlot: draftData.cornerPlot,
              roadFacing: draftData.roadFacing,
              roadWidth: draftData.roadWidth,
              landType: draftData.landType,
              plotShape: draftData.plotShape,
              gatedCommunity: draftData.gatedCommunity,
              gatedProject: draftData.gatedProject,
              floorsAllowed: draftData.floorsAllowed,
              surveyNumber: draftData.surveyNumber,
              subDivision: draftData.subDivision,
              villageName: draftData.villageName
            };
            
            console.log('Extracted plotDetailsData:', plotDetailsData);
            
            // Check if we have any plot data
            const hasPlotData = Object.values(plotDetailsData).some(value => 
              value !== undefined && value !== null && value !== '' && value !== 0
            );
            
            if (hasPlotData) {
              console.log('Loading extracted plotDetails:', plotDetailsData);
              updatePlotDetails(plotDetailsData);
              console.log('Plot details updated in form state');
            } else {
              console.log('No plot data found in draft');
            }
            
            // Load location details - data might be at root level too
            const locationDetailsData = {
              city: draftData.city,
              locality: draftData.locality,
              landmark: draftData.landmark,
              state: draftData.state,
              pincode: draftData.pincode,
              societyName: draftData.societyName
            };
            
            console.log('Extracted locationDetailsData:', locationDetailsData);
            
            // Check if we have any location data
            const hasLocationData = Object.values(locationDetailsData).some(value => 
              value !== undefined && value !== null && value !== ''
            );
            
            if (hasLocationData) {
              console.log('Loading extracted locationDetails:', locationDetailsData);
              updateLocationDetails(locationDetailsData);
              console.log('Location details updated in form state');
            } else {
              console.log('No location data found in draft');
            }
            
            // Load sale details - data might be at root level too
            const saleDetailsData = {
              expectedPrice: draftData.expectedPrice,
              possessionDate: draftData.possessionDate,
              priceNegotiable: draftData.priceNegotiable,
              ownershipType: draftData.ownershipType,
              approvedBy: draftData.approvedBy,
              clearTitles: draftData.clearTitles,
              description: draftData.description
            };
            
            console.log('Extracted saleDetailsData:', saleDetailsData);
            
            // Check if we have any sale data
            const hasSaleData = Object.values(saleDetailsData).some(value => 
              value !== undefined && value !== null && value !== '' && value !== 0
            );
            
            if (hasSaleData) {
              console.log('Loading extracted saleDetails:', saleDetailsData);
              updateSaleDetails(saleDetailsData);
              console.log('Sale details updated in form state');
            } else {
              console.log('No sale data found in draft');
            }
            
            // Load amenities
            if (draftData.amenities) {
              console.log('Loading amenities:', draftData.amenities);
              updateAmenities(draftData.amenities);
            }
            
            // Load gallery
            if (draftData.gallery) {
              console.log('Loading gallery:', draftData.gallery);
              updateGallery(draftData.gallery);
            }
            
            // Load schedule info
            if (draftData.scheduleInfo) {
              console.log('Loading scheduleInfo:', draftData.scheduleInfo);
              updateScheduleInfo(draftData.scheduleInfo);
            }
            
            console.log('Draft data loaded successfully');
          }
        } catch (error) {
          console.error('Error loading draft data:', error);
        }
      }
    };
    
    loadDraftData();
  }, [targetStep, updatePlotDetails, updateLocationDetails, updateSaleDetails, updateAmenities, updateGallery, updateScheduleInfo]);

  const completedSteps = React.useMemo(() => {
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      if (isStepValid(i)) completed.push(i);
    }
    return completed;
  }, [isStepValid, currentStep]);

  const scrollToTop = () => {
    try {
      const el = document.scrollingElement || document.documentElement || document.body;
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // no-op: best-effort scroll in non-browser environments
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const handlePlotDetailsNext = async (data: unknown) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Land/Plot - Saving draft for step:', currentStep, 'with data:', data);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        data,
        1, // Property Details step
        'land'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Land/Plot - Draft saved successfully with ID:', savedDraft.id);
      }
      
      updatePlotDetails(data as Partial<LandPlotDetails>);
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Land/Plot - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      updatePlotDetails(data as Partial<LandPlotDetails>);
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLocationDetailsNext = async (data: unknown) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Land/Plot - Saving draft for step:', currentStep, 'with data:', data);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        data,
        2, // Location Details step
        'land'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Land/Plot - Draft saved successfully with ID:', savedDraft.id);
      }
      
      updateLocationDetails(data as Partial<LandPlotLocationDetails>);
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Land/Plot - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      updateLocationDetails(data as Partial<LandPlotLocationDetails>);
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSaleDetailsNext = async (data: unknown) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Land/Plot - Saving draft for step:', currentStep, 'with data:', data);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        data,
        3, // Sale Details step
        'land'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Land/Plot - Draft saved successfully with ID:', savedDraft.id);
      }
      
      updateSaleDetails(data as Partial<LandPlotSaleDetails>);
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Land/Plot - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      updateSaleDetails(data as Partial<LandPlotSaleDetails>);
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleAmenitiesNext = async (data: unknown) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Land/Plot - Saving draft for step:', currentStep, 'with data:', data);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        data,
        4, // Amenities step
        'land'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Land/Plot - Draft saved successfully with ID:', savedDraft.id);
      }
      
      updateAmenities(data as Partial<LandPlotAmenities>);
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Land/Plot - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      updateAmenities(data as Partial<LandPlotAmenities>);
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleGalleryNext = async (data: unknown) => {
    if (isSavingDraft) return;
    
    setIsSavingDraft(true);
    try {
      console.log('Land/Plot - Saving draft for step:', currentStep, 'with data:', data);
      
      const savedDraft = await PropertyDraftService.saveFormData(
        draftId,
        data,
        5, // Gallery step
        'land'
      );
      
      if (savedDraft?.id) {
        setDraftId(savedDraft.id);
        console.log('Land/Plot - Draft saved successfully with ID:', savedDraft.id);
      }
      
      updateGallery(data as PropertyGallery);
      nextStep();
      scrollToTop();
    } catch (error) {
      console.error('Land/Plot - Failed to save draft:', error);
      // Still proceed to next step even if draft save fails
      updateGallery(data as PropertyGallery);
      nextStep();
      scrollToTop();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleScheduleNext = (data: Partial<ScheduleInfo>) => {
    console.log('LandPlotMultiStepForm handleScheduleNext called');
    updateScheduleInfo(data);
    nextStep();
    scrollToTop();
  };

  const handleScheduleSubmit = async (data: Partial<ScheduleInfo>) => {
    console.log('LandPlotMultiStepForm handleScheduleSubmit called');
    updateScheduleInfo(data);
    
    const formData = {
      ownerInfo,
      propertyInfo: {
        plotDetails,
        locationDetails,
        saleDetails,
        amenities,
        gallery,
        additionalInfo,
        scheduleInfo: data
      }
    };
    
    console.log('Complete form data for submission:', formData);
    
    await onSubmit(formData as LandPlotFormData);
    console.log('LandPlotMultiStepForm submission triggered. Going to Preview step (7)');
    goToStep(7);
    scrollToTop();
  };

  const handleEdit = (step: number) => {
    setIsSubmitted(false);
    goToStep(step);
  };

  const handlePreviewListing = () => {
    if (createdSubmissionId) {
      // Use the preview page instead of separate property page
      window.open(`/buy/preview/${createdSubmissionId}/detail`, '_blank');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const renderSuccessStep = () => {
    const successProps = {
      onPreviewListing: handlePreviewListing,
      onGoToDashboard: handleGoToDashboard,
      createdSubmissionId,
      onEdit: handleEdit,
      gallery,
      ownerInfo
    };

    switch (listingType) {
      case 'Industrial land':
        return <IndustrialLandSuccessStep {...successProps} />;
      case 'Agricultural Land':
        return <AgriculturalLandSuccessStep {...successProps} />;
      case 'Commercial land':
        return <CommercialLandSuccessStep {...successProps} />;
      default:
        return <LandPlotSuccessStep {...successProps} />;
    }
  };



  const handleSubmit = () => {
    console.log('LandPlotMultiStepForm handleSubmit called');
    const formData = getFormData();
    console.log('Form data for submission:', formData);
    onSubmit(formData as LandPlotFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Three Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <LandPlotSidebar 
            currentStep={currentStep}
            completedSteps={completedSteps}
            onPreview={handlePreview}
            draftId={draftId}
            isSavingDraft={isSavingDraft}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-4xl mx-auto p-6 md:p-8 pb-64">
              {currentStep === 1 && (
                <LandPlotPropertyDetailsStep
                  initialData={plotDetails}
                  onNext={handlePlotDetailsNext}
                  onBack={() => {}} // No back on first step
                  listingType={listingType}
                />
              )}

              {currentStep === 2 && (
                <LandPlotLocationDetailsStep
                  initialData={locationDetails}
                  onNext={handleLocationDetailsNext}
                  onBack={prevStep}
                  currentStep={2}
                  totalSteps={7}
                  formId={`${currentFormId}-m`}
                />
              )}

              {currentStep === 3 && (
                <LandPlotSaleDetailsStep
                  initialData={saleDetails}
                  onNext={handleSaleDetailsNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 4 && (
                <LandPlotAmenitiesStep
                  initialData={amenities}
                  onNext={handleAmenitiesNext}
                  onBack={prevStep}
                  listingType={listingType}
                />
              )}

              {currentStep === 5 && (
                <LandPlotGalleryStep
                  initialData={gallery}
                  onNext={handleGalleryNext}
                  onBack={prevStep}
                />
              )}

              {currentStep === 6 && (
                <LandPlotScheduleStep
                  initialData={scheduleInfo}
                  onNext={handleScheduleNext}
                  onBack={prevStep}
                  onSubmit={handleScheduleSubmit}
                  ownerInfo={ownerInfo}
                  propertyInfo={{
                    plotDetails,
                    locationDetails,
                    saleDetails,
                    amenities,
                    gallery,
                    additionalInfo
                  }}
                />
              )}

              {(currentStep === 7 || isSubmitted) && renderSuccessStep()}
          </div>

          {/* Sticky Bottom Navigation Bar - Hidden on Success step */}
          {currentStep !== 7 && !isSubmitted && (
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
                  console.log('LandPlotMultiStepForm sticky Save & Continue button clicked');
                  console.log('Current step:', currentStep);
                  
                  // Trigger the current step's form submission
                  const currentStepElement = document.querySelector('form');
                  console.log('Found form element:', currentStepElement);
                  
                  if (currentStepElement) {
                    console.log('Dispatching submit event to form');
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    currentStepElement.dispatchEvent(submitEvent);
                  } else {
                    console.log('No form element found!');
                  }
                  
                  // Always scroll to top when Save & Continue is clicked
                  setTimeout(scrollToTop, 100);
                }}
                className="h-12 sm:h-10 px-6 sm:px-6 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto order-1 sm:order-2 font-semibold"
              >
                {currentStep === 6 ? 'Submit Property' : 'Save & Continue'}
              </Button>
            </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 min-h-screen">
          <GetTenantsFasterSection ownerInfo={ownerInfo} />
        </div>
      </div>
    </div>
  );
};