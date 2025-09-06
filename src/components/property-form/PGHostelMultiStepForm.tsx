import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ProgressIndicator } from './ProgressIndicator';
import { PgHostelSidebar } from './PgHostelSidebar';
import { PgHostelOwnerInfoStep } from './PgHostelOwnerInfoStep';
import { PgHostelPropertyInfoStep } from './PgHostelPropertyInfoStep';
import { PgHostelRoomTypeStep } from './PgHostelRoomTypeStep';

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
  role: 'Owner' | 'Agent' | 'Builder' | 'Tenant';
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
  // Skip owner info - start from room types
  const hasOwnerInfo = initialOwnerInfo && Object.keys(initialOwnerInfo).length > 0;
  const [currentStep, setCurrentStep] = useState(2);
  
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
  title: '',
  propertyType: '',
});

  const [roomTypes, setRoomTypes] = useState({
    selectedType: '' as 'single' | 'double' | 'three' | 'four' | '',
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
      // Mark step 1 as completed if we have owner info
      if (hasOwnerInfo) {
        setCompletedSteps(prev => [...prev.filter(step => step !== 1), 1]);
      }
    }
  }, [initialOwnerInfo, hasOwnerInfo]);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Step handlers
  const handleOwnerInfoNext = (data: any) => {
    setOwnerInfo(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 1), 1]);
    setCurrentStep(2);
    scrollToTop();
  };

  const handlePropertyInfoNext = (data: any) => {
    setPropertyInfo(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 2), 2]);
    setCurrentStep(3);
    scrollToTop();
  };

  const handleRoomTypesNext = (data: any) => {
    setRoomTypes(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 3), 3]);
    setCurrentStep(4);
    scrollToTop();
  };

  const handleRoomDetailsNext = (data: any) => {
    setRoomDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 4), 4]);
    setCurrentStep(5);
    scrollToTop();
  };

  const handleLocalityDetailsNext = (data: any) => {
    setLocalityDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 5), 5]);
    setCurrentStep(6);
    scrollToTop();
  };

  const handlePgDetailsNext = (data: any) => {
    setPgDetails(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 6), 6]);
    setCurrentStep(7);
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 7), 7]);
    setCurrentStep(8);
    scrollToTop();
  };

  const handleGalleryNext = (data: any) => {
    setGallery(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 8), 8]);
    setCurrentStep(9);
    scrollToTop();
  };

  const handleScheduleNext = (data: any) => {
    setScheduleInfo(data);
    setCompletedSteps(prev => [...prev.filter(step => step !== 9), 9]);
    // Form complete, submit
    handleSubmit();
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 2));

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
        title: propertyInfo.title || 'PG/Hostel Property',
        propertyType: 'PG/Hostel',
        buildingType: 'PG',
        bhkType: 'PG/Hostel',
        bathrooms: roomDetails.attachedBathroom ? 1 : 0,
        balconies: 0,
        propertyAge: 'New',
        totalFloors: 1,
        floorNo: 1,
        furnishingStatus: 'Furnished',
        parkingType: amenities.parking !== 'none' ? 'Available' : 'Not Available',
        superBuiltUpArea: roomDetails.roomCount || 1,
        onMainRoad: false,
        cornerProperty: false
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
        moreSimilarUnits: false,
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
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-100/30">      
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <PgHostelSidebar 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
        
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <ProgressIndicator 
              currentStep={currentStep - 1} 
              totalSteps={7} 
              completedSteps={completedSteps.map(step => step - 1)} 
            />
        
        {!hasOwnerInfo && currentStep === 1 && (
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
            currentStep={1}
            totalSteps={8}
          />
        )}

        {currentStep === 3 && (
          <PgHostelRoomTypeStep
            initialData={roomTypes}
            onNext={handleRoomTypesNext}
            onBack={prevStep}
            currentStep={2}
            totalSteps={8}
          />
        )}

        {currentStep === 4 && (
          <PgHostelRoomDetailsStep
            initialData={roomDetails}
            roomTypes={roomTypes}
            onNext={handleRoomDetailsNext}
            onBack={prevStep}
            currentStep={3}
            totalSteps={8}
          />
        )}

        {currentStep === 5 && (
          <PgHostelLocalityDetailsStep
            initialData={localityDetails}
            onNext={handleLocalityDetailsNext}
            onBack={prevStep}
            currentStep={4}
            totalSteps={8}
          />
        )}

        {currentStep === 6 && (
          <PgHostelPgDetailsStep
            initialData={pgDetails}
            onNext={handlePgDetailsNext}
            onBack={prevStep}
            currentStep={5}
            totalSteps={8}
          />
        )}

        {currentStep === 7 && (
          <PgHostelAmenitiesStep
            initialData={amenities}
            onNext={handleAmenitiesNext}
            onBack={prevStep}
            currentStep={6}
            totalSteps={8}
          />
        )}

        {currentStep === 8 && (
          <PgHostelGalleryStep
            initialData={gallery}
            onNext={handleGalleryNext}
            onBack={prevStep}
            currentStep={7}
            totalSteps={8}
          />
        )}

        {currentStep === 9 && (
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
      </div>
    </div>
  );
};
