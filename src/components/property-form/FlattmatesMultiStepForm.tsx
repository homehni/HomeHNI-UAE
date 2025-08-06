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
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyAmenities, PropertyGallery, AdditionalInfo, ScheduleInfo, FlattmatesDetails, FlattmatesAmenities, FlattmatesFormData } from '@/types/property';

interface FlattmatesMultiStepFormProps {
  onSubmit: (data: FlattmatesFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
}

export const FlattmatesMultiStepForm: React.FC<FlattmatesMultiStepFormProps> = ({
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
    listingType: 'Flatmates',
    ...initialOwnerInfo
  });

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    title: '',
    propertyType: 'Flatmates',
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

  const [flattmatesDetails, setFlattmatesDetails] = useState<FlattmatesDetails>({
    listingType: 'Flatmates',
    expectedPrice: 0,
    existingFlatmates: 1,
    genderPreference: 'any',
    occupation: 'any',
    lifestylePreference: 'mixed',
    smokingAllowed: false,
    petsAllowed: false,
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
    idealFor: []
  });

  const [amenities, setAmenities] = useState<FlattmatesAmenities>({
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
    sharedKitchen: true,
    sharedLivingRoom: true,
    dedicatedBathroom: false,
    sharedParking: false
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
    if (flattmatesDetails.expectedPrice > 0) steps.push(3);
    if (amenities.powerBackup !== '') steps.push(4);
    if (gallery.images.length >= 3) steps.push(5);
    if (additionalInfo.description) steps.push(6);
    if (scheduleInfo.availability) steps.push(7);
    return steps;
  }, [propertyDetails, locationDetails, flattmatesDetails, amenities, gallery, additionalInfo, scheduleInfo]);

  const handlePropertyDetailsNext = (data: PropertyDetails) => {
    setPropertyDetails(data);
    setCurrentStep(2);
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    setLocationDetails(data);
    setCurrentStep(3);
  };

  const handleFlattmatesDetailsNext = (data: FlattmatesDetails) => {
    setFlattmatesDetails(data);
    setCurrentStep(4);
  };

  const handleAmenitiesNext = (data: FlattmatesAmenities) => {
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
      flattmatesDetails,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-teal-100/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-6 py-2 text-lg font-semibold mb-4">
            🏠 FLATMATES PROPERTY FORM
          </Badge>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect flatmate by listing your shared accommodation with detailed preferences and amenities.
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
          <FlattmatesDetailsStep
            initialData={flattmatesDetails}
            onNext={handleFlattmatesDetailsNext}
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

// Flatmates Details Step Component
interface FlattmatesDetailsStepProps {
  initialData: FlattmatesDetails;
  onNext: (data: FlattmatesDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const FlattmatesDetailsStep: React.FC<FlattmatesDetailsStepProps> = ({
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
        <h2 className="text-2xl font-bold text-foreground mb-6">Flatmate Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Rent Share</label>
            <input
              type="number"
              value={formData.expectedPrice}
              onChange={(e) => setFormData({...formData, expectedPrice: Number(e.target.value)})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Existing Flatmates</label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.existingFlatmates}
              onChange={(e) => setFormData({...formData, existingFlatmates: Number(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            />
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
            <label className="block text-sm font-medium mb-2">Occupation Preference</label>
            <select
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value as 'student' | 'working' | 'any'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="any">Any</option>
              <option value="student">Student</option>
              <option value="working">Working Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lifestyle Preference</label>
            <select
              value={formData.lifestylePreference}
              onChange={(e) => setFormData({...formData, lifestylePreference: e.target.value as 'social' | 'quiet' | 'mixed'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="mixed">Mixed</option>
              <option value="social">Social</option>
              <option value="quiet">Quiet</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smokingAllowed"
              checked={formData.smokingAllowed}
              onChange={(e) => setFormData({...formData, smokingAllowed: e.target.checked})}
              className="mr-3"
            />
            <label htmlFor="smokingAllowed" className="text-sm font-medium">Smoking Allowed</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="petsAllowed"
              checked={formData.petsAllowed}
              onChange={(e) => setFormData({...formData, petsAllowed: e.target.checked})}
              className="mr-3"
            />
            <label htmlFor="petsAllowed" className="text-sm font-medium">Pets Allowed</label>
          </div>
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