import React, { useState, useEffect, useMemo } from 'react';
import { PgHostelSidebar } from './PgHostelSidebar';
import { PgHostelOwnerInfoStep } from './PgHostelOwnerInfoStep';
import { PgHostelPropertyInfoStep } from './PgHostelPropertyInfoStep';
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
  role: 'Owner' | 'Agent' | 'Builder';
  city: string;
  whatsappUpdates: boolean;
}

interface PGHostelMultiStepFormProps {
  onSubmit: (data: PGHostelFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<LocalOwnerInfo>;
}

export const PGHostelMultiStepForm: React.FC<PGHostelMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // PG/Hostel specific state
  const [ownerInfo, setOwnerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: 'Owner' as const,
    city: '',
    whatsappUpdates: false,
    ...initialOwnerInfo
  });

  const [propertyInfo, setPropertyInfo] = useState({
    propertyType: 'PG/Hostel',
    buildingType: '',
    propertyAge: '',
    totalFloors: 0,
    floorNo: 0,
    furnishingStatus: '',
    superBuiltUpArea: 0,
    onMainRoad: false,
    cornerProperty: false
  });

  const [roomDetails, setRoomDetails] = useState({
    expectedRent: 0,
    expectedDeposit: 0,
    cupboard: false,
    geyser: false,
    tv: false,
    ac: false,
    bedding: false,
    attachedBathroom: false
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
    roomType: 'single' as const,
    genderPreference: 'any' as const,
    mealOptions: 'optional' as const,
    timingRestrictions: '',
    houseRules: ''
  });

  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    security: false,
    powerBackup: false,
    lift: false,
    washrooms: false,
    waterStorage: false,
    laundry: false,
    meals: false,
    commonArea: false,
    cleaning: false
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

  const completedSteps = useMemo(() => {
    const steps = [];
    if (ownerInfo.fullName && ownerInfo.email && ownerInfo.phoneNumber) steps.push(1);
    if (propertyInfo.propertyType && propertyInfo.buildingType) steps.push(2);
    if (roomDetails.expectedRent > 0) steps.push(3);
    if (localityDetails.state && localityDetails.city) steps.push(4);
    if (pgDetails.roomType) steps.push(5);
    if (amenities.wifi !== undefined) steps.push(6);
    if (gallery.images.length >= 3) steps.push(7);
    if (scheduleInfo.availability) steps.push(8);
    return steps;
  }, [ownerInfo, propertyInfo, roomDetails, localityDetails, pgDetails, amenities, gallery, scheduleInfo]);

  // Step handlers
  const handleOwnerInfoNext = (data: any) => {
    setOwnerInfo(data);
    setCurrentStep(2);
  };

  const handlePropertyInfoNext = (data: any) => {
    setPropertyInfo(data);
    setCurrentStep(3);
  };

  const handleRoomDetailsNext = (data: any) => {
    setRoomDetails(data);
    setCurrentStep(4);
  };

  const handleLocalityDetailsNext = (data: any) => {
    setLocalityDetails(data);
    setCurrentStep(5);
  };

  const handlePgDetailsNext = (data: any) => {
    setPgDetails(data);
    setCurrentStep(6);
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCurrentStep(7);
  };

  const handleGalleryNext = (data: any) => {
    setGallery(data);
    setCurrentStep(8);
  };

  const handleScheduleNext = (data: any) => {
    setScheduleInfo(data);
    // Form complete, submit
    handleSubmit();
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getFormData = (): PGHostelFormData => ({
    ownerInfo: {
      fullName: ownerInfo.fullName,
      phoneNumber: ownerInfo.phoneNumber,
      email: ownerInfo.email,
      role: ownerInfo.role,
      city: ownerInfo.city,
      whatsappUpdates: ownerInfo.whatsappUpdates,
      propertyType: 'Residential',
      listingType: 'PG/Hostel'
    },
    propertyInfo: {
      propertyDetails: {
        title: `${pgDetails.roomType} room in PG/Hostel`,
        propertyType: propertyInfo.propertyType,
        buildingType: propertyInfo.buildingType,
        bhkType: pgDetails.roomType,
        bathrooms: roomDetails.attachedBathroom ? 1 : 0,
        balconies: 0,
        propertyAge: propertyInfo.propertyAge,
        totalFloors: propertyInfo.totalFloors,
        floorNo: propertyInfo.floorNo,
        furnishingStatus: propertyInfo.furnishingStatus,
        parkingType: amenities.parking ? 'Available' : 'Not Available',
        superBuiltUpArea: propertyInfo.superBuiltUpArea,
        onMainRoad: propertyInfo.onMainRoad,
        cornerProperty: propertyInfo.cornerProperty
      },
      locationDetails: localityDetails,
      pgDetails: {
        listingType: 'PG/Hostel',
        expectedPrice: roomDetails.expectedRent,
        roomType: pgDetails.roomType,
        genderPreference: pgDetails.genderPreference,
        mealOptions: pgDetails.mealOptions,
        securityDeposit: roomDetails.expectedDeposit,
        timingRestrictions: pgDetails.timingRestrictions,
        houseRules: pgDetails.houseRules,
        rentNegotiable: true,
        maintenanceExtra: false,
        maintenanceCharges: 0,
        depositNegotiable: true,
        leaseDuration: '',
        lockinPeriod: '',
        brokerageType: '',
        availableFrom: '',
        preferredTenants: '',
        idealFor: []
      },
      amenities: {
        ...amenities,
        powerBackup: amenities.powerBackup ? 'Available' : 'Not Available',
        lift: amenities.lift ? 'Available' : 'Not Available',
        parking: amenities.parking ? 'Available' : 'Not Available',
        washrooms: amenities.washrooms ? 'Available' : 'Not Available',
        waterStorageFacility: amenities.waterStorage ? 'Available' : 'Not Available',
        security: amenities.security ? 'Available' : 'Not Available',
        wifi: amenities.wifi ? 'Available' : 'Not Available',
        meals: amenities.meals ? 'breakfast' : 'none',
        laundry: amenities.laundry ? 'included' : 'not-available',
        commonArea: amenities.commonArea ? 'tv-room' : undefined,
        cleaning: amenities.cleaning ? 'daily' : 'self',
        currentPropertyCondition: '',
        currentBusiness: '',
        moreSimilarUnits: '',
        directionsTip: ''
      },
      gallery,
      additionalInfo: {
        description: '',
        previousOccupancy: '',
        whoWillShow: '',
        paintingRequired: '',
        cleaningRequired: '',
        secondaryNumber: ''
      },
      scheduleInfo
    }
  });

  const handleSubmit = () => {
    const formData = getFormData();
    
    // Validation
    if (!ownerInfo.fullName || !ownerInfo.email || !ownerInfo.phoneNumber) {
      throw new Error('Owner information is incomplete');
    }
    
    if (!propertyInfo.propertyType || !propertyInfo.buildingType) {
      throw new Error('Property details are incomplete');
    }
    
    if (gallery.images.length < 3) {
      throw new Error('At least 3 images are required');
    }
    
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <PgHostelSidebar 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
      />
      
      {/* Main Content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <PgHostelOwnerInfoStep
            initialData={ownerInfo}
            onNext={handleOwnerInfoNext}
            currentStep={1}
            totalSteps={8}
          />
        )}

        {currentStep === 2 && (
          <PgHostelPropertyInfoStep
            initialData={propertyInfo}
            onNext={handlePropertyInfoNext}
            onBack={prevStep}
            currentStep={2}
            totalSteps={8}
          />
        )}

        {currentStep === 3 && (
          <PgHostelRoomDetailsStep
            initialData={roomDetails}
            onNext={handleRoomDetailsNext}
            onBack={prevStep}
            currentStep={3}
            totalSteps={8}
          />
        )}

        {currentStep === 4 && (
          <PgHostelLocalityDetailsStep
            initialData={localityDetails}
            onNext={handleLocalityDetailsNext}
            onBack={prevStep}
            currentStep={4}
            totalSteps={8}
          />
        )}

        {currentStep === 5 && (
          <PgHostelPgDetailsStep
            initialData={pgDetails}
            onNext={handlePgDetailsNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={8}
          />
        )}

        {currentStep === 6 && (
          <PgHostelAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={6}
            totalSteps={8}
          />
        )}

        {currentStep === 7 && (
          <PgHostelGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={7}
            totalSteps={8}
          />
        )}

        {currentStep === 8 && (
          <PgHostelScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
            currentStep={8}
            totalSteps={8}
          />
        )}
      </div>
    </div>
  );
};
