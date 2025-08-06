import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LocationDetailsStep } from './LocationDetailsStep';
import { AmenitiesStep } from './AmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { AdditionalInfoStep } from './AdditionalInfoStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { ProgressIndicator } from './ProgressIndicator';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo, PGHostelDetails, PGHostelAmenities, PGHostelFormData } from '@/types/property';

interface PGHostelMultiStepFormProps {
  onSubmit: (data: PGHostelFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const PGHostelMultiStepForm: React.FC<PGHostelMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: 'Owner',
    city: '',
    whatsappUpdates: false,
    propertyType: 'Residential',
    listingType: 'PG/Hostel',
    ...initialOwnerInfo
  });

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    title: '',
    propertyType: 'PG/Hostel',
    buildingType: '',
    bhkType: '',
    bathrooms: 0,
    balconies: 0,
    propertyAge: '',
    totalFloors: 0,
    floorNo: 0,
    furnishingStatus: '',
    parkingType: '',
    superBuiltUpArea: 0,
    onMainRoad: false,
    cornerProperty: false
  });

  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    state: '',
    city: '',
    locality: '',
    pincode: '',
    societyName: '',
    landmark: ''
  });

  const [pgDetails, setPgDetails] = useState<PGHostelDetails>({
    listingType: 'PG/Hostel',
    expectedPrice: 0,
    roomType: 'single',
    genderPreference: 'any',
    mealOptions: 'optional',
    rentNegotiable: true,
    maintenanceExtra: false,
    maintenanceCharges: 0,
    securityDeposit: 0,
    depositNegotiable: true,
    leaseDuration: '',
    lockinPeriod: '',
    brokerageType: '',
    availableFrom: '',
    preferredTenants: '',
    idealFor: [],
    timingRestrictions: '',
    houseRules: ''
  });

  const [amenities, setAmenities] = useState<PGHostelAmenities>({
    powerBackup: '',
    lift: '',
    parking: '',
    washrooms: '',
    waterStorageFacility: '',
    security: '',
    wifi: '',
    currentPropertyCondition: '',
    currentBusiness: '',
    moreSimilarUnits: '',
    directionsTip: '',
    meals: 'none',
    laundry: 'not-available',
    commonArea: 'tv-room',
    cleaning: 'self'
  });

  const [gallery, setGallery] = useState<PropertyGallery>({
    images: [],
    video: undefined
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    description: '',
    previousOccupancy: '',
    whoWillShow: '',
    paintingRequired: '',
    cleaningRequired: '',
    secondaryNumber: ''
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
    }
  }, [initialOwnerInfo]);

  const completedSteps = useMemo(() => {
    const steps = [];
    if (propertyDetails.title && propertyDetails.bhkType) steps.push(1);
    if (locationDetails.state && locationDetails.city) steps.push(2);
    if (pgDetails.expectedPrice > 0) steps.push(3);
    if (amenities.powerBackup !== '') steps.push(4);
    if (gallery.images.length >= 3) steps.push(5);
    if (additionalInfo.description) steps.push(6);
    if (scheduleInfo.availability) steps.push(7);
    return steps;
  }, [propertyDetails, locationDetails, pgDetails, amenities, gallery, additionalInfo, scheduleInfo]);

  const handlePropertyDetailsNext = (data: PropertyDetails) => {
    setPropertyDetails(data);
    setCurrentStep(2);
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    setLocationDetails(data);
    setCurrentStep(3);
  };

  const handlePGDetailsNext = (data: PGHostelDetails) => {
    setPgDetails(data);
    setCurrentStep(4);
  };

  const handleAmenitiesNext = (data: PGHostelAmenities) => {
    setAmenities(data);
    setCurrentStep(5);
  };

  const handleGalleryNext = (data: PropertyGallery) => {
    setGallery(data);
    setCurrentStep(6);
  };

  const handleAdditionalInfoNext = (data: AdditionalInfo) => {
    setAdditionalInfo(data);
    setCurrentStep(7);
  };

  const handleScheduleNext = (data: ScheduleInfo) => {
    setScheduleInfo(data);
    setCurrentStep(8);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const getFormData = () => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails,
      locationDetails,
      pgDetails,
      amenities,
      gallery,
      additionalInfo,
      scheduleInfo
    }
  });

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Enhanced validation
    if (!formData.ownerInfo.fullName || !formData.ownerInfo.email || !formData.ownerInfo.phoneNumber) {
      throw new Error('Owner information is incomplete');
    }
    
    if (!formData.propertyInfo.propertyDetails.title || !formData.propertyInfo.propertyDetails.bhkType) {
      throw new Error('Property details are incomplete');
    }
    
    if (formData.propertyInfo.gallery.images.length < 3) {
      throw new Error('At least 3 images are required');
    }
    
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-yellow-100/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-6 py-2 text-lg font-semibold mb-4">
            🏠 PG/HOSTEL PROPERTY FORM
          </Badge>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            List your PG or hostel property with specialized details for student and working professional accommodation.
          </p>
        </div>

        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={8}
          completedSteps={completedSteps}
        />

        {currentStep === 1 && (
          <PropertyDetailsStep
            initialData={propertyDetails}
            onNext={handlePropertyDetailsNext}
            onBack={() => {}}
            currentStep={1}
            totalSteps={8}
          />
        )}

        {currentStep === 2 && (
          <LocationDetailsStep
            initialData={locationDetails}
            onNext={handleLocationDetailsNext}
            onBack={prevStep}
            currentStep={2}
            totalSteps={8}
          />
        )}

        {currentStep === 3 && (
          <PGDetailsStep
            initialData={pgDetails}
            onNext={handlePGDetailsNext}
            onBack={prevStep}
            currentStep={3}
            totalSteps={8}
          />
        )}

        {currentStep === 4 && (
          <AmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={4}
            totalSteps={8}
          />
        )}

        {currentStep === 5 && (
          <GalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={8}
          />
        )}

        {currentStep === 6 && (
          <AdditionalInfoStep
            initialData={additionalInfo}
            onNext={handleAdditionalInfoNext}
            onBack={prevStep}
          />
        )}

        {currentStep === 7 && (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
          />
        )}

        {currentStep === 8 && (
          <PreviewStep
            formData={getFormData()}
            onBack={prevStep}
            onEdit={goToStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

// PG Details Step Component
interface PGDetailsStepProps {
  initialData: PGHostelDetails;
  onNext: (data: PGHostelDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const PGDetailsStep: React.FC<PGDetailsStepProps> = ({
  initialData,
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">PG/Hostel Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Expected Rent (Monthly)</label>
            <input
              type="number"
              value={formData.expectedPrice}
              onChange={(e) => setFormData({...formData, expectedPrice: Number(e.target.value)})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Type</label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({...formData, roomType: e.target.value as 'single' | 'shared' | 'dormitory'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="single">Single Room</option>
              <option value="shared">Shared Room</option>
              <option value="dormitory">Dormitory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender Preference</label>
            <select
              value={formData.genderPreference}
              onChange={(e) => setFormData({...formData, genderPreference: e.target.value as 'male' | 'female' | 'any'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="any">Any</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meal Options</label>
            <select
              value={formData.mealOptions}
              onChange={(e) => setFormData({...formData, mealOptions: e.target.value as 'included' | 'optional' | 'not-available'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="included">Meals Included</option>
              <option value="optional">Meals Optional</option>
              <option value="not-available">No Meal Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Security Deposit</label>
            <input
              type="number"
              value={formData.securityDeposit}
              onChange={(e) => setFormData({...formData, securityDeposit: Number(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Timing Restrictions (Optional)</label>
          <textarea
            value={formData.timingRestrictions}
            onChange={(e) => setFormData({...formData, timingRestrictions: e.target.value})}
            className="w-full p-3 border rounded-lg"
            rows={3}
            placeholder="e.g., Entry time: 10 PM, No visitors after 9 PM"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">House Rules (Optional)</label>
          <textarea
            value={formData.houseRules}
            onChange={(e) => setFormData({...formData, houseRules: e.target.value})}
            className="w-full p-3 border rounded-lg"
            rows={3}
            placeholder="e.g., No smoking, No alcohol, Quiet hours after 10 PM"
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </form>
  );
};