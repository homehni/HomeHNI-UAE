import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { FlattmatesPropertyDetailsStep } from './FlattmatesPropertyDetailsStep';
import { FlattmatesLocationDetailsStep } from './FlattmatesLocationDetailsStep';
import { FlattmatesRentalDetailsStep } from './FlattmatesRentalDetailsStep';
import { FlattmatesAmenitiesStep } from './FlattmatesAmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import { FlattmatesSidebar } from './FlattmatesSidebar';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyGallery, AdditionalInfo, ScheduleInfo, FlattmatesFormData } from '@/types/property';

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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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
    furnishing: '',
    parking: '',
    description: ''
  });

  const [amenities, setAmenities] = useState({
    attachedBathroom: false,
    acRoom: false,
    balcony: false,
    nonVegAllowed: false,
    smokingAllowed: false,
    drinkingAllowed: false,
    gym: false,
    gatedSecurity: false,
    whoWillShow: '',
    secondaryNumber: '',
    waterSupply: '',
    directionsTip: '',
    selectedAmenities: []
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
      if (initialOwnerInfo.fullName && initialOwnerInfo.email && initialOwnerInfo.phoneNumber) {
        setCompletedSteps(prev => prev.includes(0) ? prev : [...prev, 0]);
      }
    }
  }, [initialOwnerInfo]);

  const handlePropertyDetailsNext = (data: any) => {
    setPropertyDetails(data);
    setCompletedSteps(prev => prev.includes(1) ? prev : [...prev, 1]);
    setCurrentStep(2);
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    setLocationDetails(data);
    setCompletedSteps(prev => prev.includes(2) ? prev : [...prev, 2]);
    setCurrentStep(3);
  };

  const handleRentalDetailsNext = (data: any) => {
    setRentalDetails(data);
    setCompletedSteps(prev => prev.includes(3) ? prev : [...prev, 3]);
    setCurrentStep(4);
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCompletedSteps(prev => prev.includes(4) ? prev : [...prev, 4]);
    setCurrentStep(5);
  };

  const handleGalleryNext = (data: PropertyGallery) => {
    setGallery(data);
    setCompletedSteps(prev => prev.includes(5) ? prev : [...prev, 5]);
    setCurrentStep(6);
  };

  const handleScheduleNext = (data: ScheduleInfo) => {
    setScheduleInfo(data);
    setCompletedSteps(prev => prev.includes(6) ? prev : [...prev, 6]);
    setCurrentStep(7);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const getFormData = (): FlattmatesFormData => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails: {
        title: `${propertyDetails.bhkType} ${propertyDetails.apartmentType} for Flatmates`,
        propertyType: 'Flatmates',
        buildingType: propertyDetails.apartmentType,
        bhkType: propertyDetails.bhkType,
        bathrooms: amenities.attachedBathroom ? 1 : 0,
        balconies: amenities.balcony ? 1 : 0,
        propertyAge: propertyDetails.propertyAge,
        totalFloors: propertyDetails.totalFloors,
        floorNo: propertyDetails.floorNo,
        furnishingStatus: rentalDetails.furnishing,
        parkingType: rentalDetails.parking,
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
        smokingAllowed: amenities.smokingAllowed,
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
        powerBackup: amenities.selectedAmenities.includes('power-backup') ? 'Yes' : 'No',
        lift: amenities.selectedAmenities.includes('lift') ? 'Yes' : 'No',
        parking: rentalDetails.parking,
        washrooms: amenities.attachedBathroom ? 'Attached' : 'Common',
        waterStorageFacility: amenities.waterSupply,
        security: amenities.gatedSecurity ? 'Yes' : 'No',
        wifi: '',
        currentPropertyCondition: '',
        currentBusiness: '',
        moreSimilarUnits: false,
        directionsTip: amenities.directionsTip,
        sharedKitchen: true,
        sharedLivingRoom: true,
        dedicatedBathroom: amenities.attachedBathroom,
        sharedParking: rentalDetails.parking !== 'None'
      },
      gallery,
      additionalInfo: {
        ...additionalInfo,
        description: rentalDetails.description,
        whoWillShow: amenities.whoWillShow,
        secondaryNumber: amenities.secondaryNumber
      },
      scheduleInfo
    }
  });

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-teal-100/30">
      <div className="text-center py-8">
        <Badge variant="secondary" className="bg-green-100 text-green-800 px-6 py-2 text-lg font-semibold mb-4">
          🏠 FLATMATES PROPERTY FORM
        </Badge>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find the perfect flatmate by listing your shared accommodation with detailed preferences and amenities.
        </p>
      </div>
      
      <div className="flex min-h-screen">
        <FlattmatesSidebar 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
        
        <div className="flex-1 p-8">
        {currentStep === 1 && (
          <FlattmatesPropertyDetailsStep
            initialData={propertyDetails}
            onNext={handlePropertyDetailsNext}
            onBack={() => {}}
            currentStep={1}
            totalSteps={6}
            completedSteps={completedSteps}
          />
        )}

        {currentStep === 2 && (
          <FlattmatesLocationDetailsStep
            initialData={locationDetails}
            onNext={handleLocationDetailsNext}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <FlattmatesRentalDetailsStep
            initialData={rentalDetails}
            onNext={handleRentalDetailsNext}
            onBack={prevStep}
            currentStep={3}
            totalSteps={6}
            completedSteps={completedSteps}
          />
        )}

        {currentStep === 4 && (
          <FlattmatesAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={4}
            totalSteps={6}
            completedSteps={completedSteps}
          />
        )}

        {currentStep === 5 && (
          <GalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={6}
          />
        )}

        {currentStep === 6 && (
          <ScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
          />
        )}

        {currentStep === 7 && (
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
    </div>
  );
};
