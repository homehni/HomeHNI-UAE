import React, { useState, useEffect, useMemo } from 'react';
import { PgHostelSidebar } from './PgHostelSidebar';
import { PgHostelOwnerInfoStep } from './PgHostelOwnerInfoStep';
import { PgHostelRoomTypeStep } from './PgHostelRoomTypeStep';
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

  const [roomTypes, setRoomTypes] = useState({
    single: false,
    double: false,
    three: false,
    four: false,
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

  const completedSteps = useMemo(() => {
    const steps = [];
    if (ownerInfo.fullName && ownerInfo.email && ownerInfo.phoneNumber) steps.push(1);
    if (roomTypes.single || roomTypes.double || roomTypes.three || roomTypes.four) steps.push(2);
    if (propertyInfo.propertyType && propertyInfo.buildingType) steps.push(3);
    if (roomDetails.expectedRent > 0) steps.push(4);
    if (localityDetails.state && localityDetails.city) steps.push(5);
    if (pgDetails.genderPreference && pgDetails.preferredGuests) steps.push(6);
    if (amenities.laundry !== '') steps.push(7);
    if (gallery.images.length >= 3) steps.push(8);
    if (scheduleInfo.availability) steps.push(9);
    return steps;
  }, [ownerInfo, roomTypes, propertyInfo, roomDetails, localityDetails, pgDetails, amenities, gallery, scheduleInfo]);

  // Step handlers
  const handleOwnerInfoNext = (data: any) => {
    setOwnerInfo(data);
    setCurrentStep(2);
  };

  const handleRoomTypesNext = (data: any) => {
    setRoomTypes(data);
    setCurrentStep(3);
  };

  const handlePropertyInfoNext = (data: any) => {
    setPropertyInfo(data);
    setCurrentStep(4);
  };

  const handleRoomDetailsNext = (data: any) => {
    setRoomDetails(data);
    setCurrentStep(5);
  };

  const handleLocalityDetailsNext = (data: any) => {
    setLocalityDetails(data);
    setCurrentStep(6);
  };

  const handlePgDetailsNext = (data: any) => {
    setPgDetails(data);
    setCurrentStep(7);
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCurrentStep(8);
  };

  const handleGalleryNext = (data: any) => {
    setGallery(data);
    setCurrentStep(9);
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
        title: `PG/Hostel with multiple room types`,
        propertyType: propertyInfo.propertyType,
        buildingType: propertyInfo.buildingType,
        bhkType: 'Multiple',
        bathrooms: roomDetails.attachedBathroom ? 1 : 0,
        balconies: 0,
        propertyAge: propertyInfo.propertyAge,
        totalFloors: propertyInfo.totalFloors,
        floorNo: propertyInfo.floorNo,
        furnishingStatus: propertyInfo.furnishingStatus,
        parkingType: amenities.parking !== 'none' ? 'Available' : 'Not Available',
        superBuiltUpArea: propertyInfo.superBuiltUpArea,
        onMainRoad: propertyInfo.onMainRoad,
        cornerProperty: propertyInfo.cornerProperty
      },
      locationDetails: localityDetails,
      pgDetails: {
        listingType: 'PG/Hostel',
        expectedPrice: roomDetails.expectedRent,
        roomType: 'shared',
        genderPreference: pgDetails.genderPreference === 'anyone' ? 'any' : pgDetails.genderPreference,
        mealOptions: (pgDetails.foodIncluded as string) === 'yes' ? 'included' as const : 'not-available' as const,
        securityDeposit: roomDetails.expectedDeposit,
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
        washrooms: 'Available',
        waterStorageFacility: 'Available',
        security: 'Available',
        wifi: amenities.wifi ? 'Available' : 'Not Available',
        meals: amenities.mess ? 'breakfast' : 'none',
        laundry: amenities.laundry === 'yes' ? 'included' : 'not-available',
        commonArea: amenities.commonTv ? 'tv-room' : undefined,
        cleaning: amenities.roomCleaning === 'yes' ? 'daily' : 'self',
        currentPropertyCondition: '',
        currentBusiness: '',
        moreSimilarUnits: '',
        directionsTip: amenities.directionsTip
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
    
    if (!roomTypes.single && !roomTypes.double && !roomTypes.three && !roomTypes.four) {
      throw new Error('At least one room type must be selected');
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
            totalSteps={9}
          />
        )}

        {currentStep === 2 && (
          <PgHostelRoomTypeStep
            initialData={roomTypes}
            onNext={handleRoomTypesNext}
            currentStep={2}
            totalSteps={9}
          />
        )}

        {currentStep === 3 && (
          <PgHostelPropertyInfoStep
            initialData={propertyInfo}
            onNext={handlePropertyInfoNext}
            onBack={prevStep}
            currentStep={3}
            totalSteps={9}
          />
        )}

        {currentStep === 4 && (
          <PgHostelRoomDetailsStep
            initialData={roomDetails}
            onNext={handleRoomDetailsNext}
            onBack={prevStep}
            currentStep={4}
            totalSteps={9}
          />
        )}

        {currentStep === 5 && (
          <PgHostelLocalityDetailsStep
            initialData={localityDetails}
            onNext={handleLocalityDetailsNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={9}
          />
        )}

        {currentStep === 6 && (
          <PgHostelPgDetailsStep
            initialData={pgDetails}
            onNext={handlePgDetailsNext}
            onBack={prevStep}
            currentStep={6}
            totalSteps={9}
          />
        )}

        {currentStep === 7 && (
          <PgHostelAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={7}
            totalSteps={9}
          />
        )}

        {currentStep === 8 && (
          <PgHostelGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={8}
            totalSteps={9}
          />
        )}

        {currentStep === 9 && (
          <PgHostelScheduleStep
            initialData={scheduleInfo}
            onNext={handleScheduleNext}
            onBack={prevStep}
            currentStep={9}
            totalSteps={9}
          />
        )}
      </div>
    </div>
  );
};
