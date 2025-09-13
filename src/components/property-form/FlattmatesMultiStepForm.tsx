import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyFormSidebar } from './PropertyFormSidebar';
import { FlattmatesPropertyDetailsStep } from './FlattmatesPropertyDetailsStep';
import { FlattmatesLocationDetailsStep } from './FlattmatesLocationDetailsStep';
import { FlattmatesRentalDetailsStep } from './FlattmatesRentalDetailsStep';
import { FlattmatesAmenitiesStep } from './FlattmatesAmenitiesStep';
import { GalleryStep } from './GalleryStep';
import { ScheduleStep } from './ScheduleStep';
import { PreviewStep } from './PreviewStep';
import GetTenantsFasterSection from '@/components/GetTenantsFasterSection';
import { Home, MapPin, DollarSign, Sparkles, Camera, Calendar } from 'lucide-react';
import { OwnerInfo, PropertyDetails, LocationDetails, PropertyGallery, AdditionalInfo, ScheduleInfo, FlattmatesFormData } from '@/types/property';

interface FlattmatesMultiStepFormProps {
  onSubmit: (data: FlattmatesFormData) => void;
  isSubmitting?: boolean;
  initialOwnerInfo?: Partial<OwnerInfo>;
  targetStep?: number | null;
}

export const FlattmatesMultiStepForm: React.FC<FlattmatesMultiStepFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialOwnerInfo = {},
  targetStep = null
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handlePropertyDetailsNext = (data: any) => {
    setPropertyDetails(data);
    setCompletedSteps(prev => prev.includes(1) ? prev : [...prev, 1]);
    setCurrentStep(2);
    scrollToTop();
  };

  const handleLocationDetailsNext = (data: LocationDetails) => {
    setLocationDetails(data);
    setCompletedSteps(prev => prev.includes(2) ? prev : [...prev, 2]);
    setCurrentStep(3);
    scrollToTop();
  };

  const handleRentalDetailsNext = (data: any) => {
    setRentalDetails(data);
    setCompletedSteps(prev => prev.includes(3) ? prev : [...prev, 3]);
    setCurrentStep(4);
    scrollToTop();
  };

  const handleAmenitiesNext = (data: any) => {
    setAmenities(data);
    setCompletedSteps(prev => prev.includes(4) ? prev : [...prev, 4]);
    setCurrentStep(5);
    scrollToTop();
  };

  const handleGalleryNext = (data: PropertyGallery) => {
    setGallery(data);
    setCompletedSteps(prev => prev.includes(5) ? prev : [...prev, 5]);
    setCurrentStep(6);
    scrollToTop();
  };

  const handleScheduleNext = (data: ScheduleInfo) => {
    setScheduleInfo(data);
    setCompletedSteps(prev => prev.includes(6) ? prev : [...prev, 6]);
    setCurrentStep(7);
    scrollToTop();
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const getFormData = (): FlattmatesFormData => ({
    ownerInfo,
    propertyInfo: {
      propertyDetails: {
        title: `${propertyDetails.bhkType} ${propertyDetails.apartmentType} for Flatmates`,
        propertyType: 'apartment',
        buildingType: propertyDetails.apartmentType,
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

  const handleSubmit = () => {
    const formData = getFormData();
    onSubmit(formData);
  };

  const sidebarSteps = [
    { title: 'Property Details', icon: <Home className="w-4 h-4" /> },
    { title: 'Locality Details', icon: <MapPin className="w-4 h-4" /> },
    { title: 'Rental Details', icon: <DollarSign className="w-4 h-4" /> },
    { title: 'Amenities', icon: <Sparkles className="w-4 h-4" /> },
    { title: 'Gallery', icon: <Camera className="w-4 h-4" /> },
    { title: 'Schedule', icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="flex max-w-full mx-auto h-full">
        {/* Left Sidebar */}
        <div className="w-80">
          <PropertyFormSidebar currentStep={currentStep} completedSteps={completedSteps} steps={sidebarSteps} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white flex flex-col">
          {/* Progress Bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-base font-semibold text-gray-900">
                Provide additional details about your property to get maximum visibility
              </h1>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{currentStep}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-teal-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-3 min-h-0 max-h-full">
            <div className="bg-white h-full overflow-auto">
              <div className="max-w-4xl mx-auto">
                {currentStep === 1 && (
                  <FlattmatesPropertyDetailsStep
                    initialData={propertyDetails}
                    onNext={handlePropertyDetailsNext}
                    onBack={() => {}}
                    currentStep={1}
                    totalSteps={7}
                    completedSteps={completedSteps}
                  />
                )}

                {currentStep === 2 && (
                  <FlattmatesLocationDetailsStep
                    initialData={locationDetails}
                    onNext={handleLocationDetailsNext}
                    onBack={prevStep}
                    currentStep={2}
                    totalSteps={7}
                  />
                )}

                {currentStep === 3 && (
                  <FlattmatesRentalDetailsStep
                    initialData={rentalDetails}
                    onNext={handleRentalDetailsNext}
                    onBack={prevStep}
                    currentStep={3}
                    totalSteps={7}
                    completedSteps={completedSteps}
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
                    currentStep={5}
                    totalSteps={7}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {currentStep === 6 && (
                  <ScheduleStep initialData={scheduleInfo} onNext={handleScheduleNext} onBack={prevStep} />
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
        </div>

        {/* Right Sidebar - Get Tenants Faster */}
        <div className="w-80 flex-shrink-0 h-full">
          <GetTenantsFasterSection />
        </div>
      </div>
    </div>
  );
};
