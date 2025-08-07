export interface OwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  role: 'Owner' | 'Agent' | 'Builder';
  city: string;
  whatsappUpdates: boolean;
  propertyType: 'Residential' | 'Commercial' | 'Land/Plot';
  listingType: 'Rent' | 'Resale' | 'PG/Hostel' | 'Flatmates' | 'Sale';
}

export interface PropertyDetails {
  title: string;
  propertyType: string;
  buildingType: string;
  bhkType: string;
  bathrooms: number;
  balconies: number;
  propertyAge: string;
  totalFloors: number;
  floorNo: number;
  furnishingStatus: string;
  parkingType: string;
  superBuiltUpArea: number;
  onMainRoad: boolean;
  cornerProperty: boolean;
}

export interface LocationDetails {
  state: string;
  city: string;
  locality: string;
  pincode: string;
  societyName?: string;
  landmark?: string;
}

export interface RentalDetails {
  listingType: 'Sale' | 'Rent';
  expectedPrice: number;
  rentNegotiable?: boolean;
  maintenanceExtra?: boolean;
  maintenanceCharges?: number;
  securityDeposit?: number;
  depositNegotiable?: boolean;
  leaseDuration?: string;
  lockinPeriod?: string;
  brokerageType?: string;
  availableFrom?: string;
  preferredTenants?: string;
  idealFor?: string[];
}

export interface PropertyAmenities {
  powerBackup?: string;
  lift?: string;
  parking?: string;
  waterStorageFacility?: string;
  security?: boolean;
  wifi?: string;
}

export interface PropertyGallery {
  images: File[];
  video?: File;
}

export interface AdditionalInfo {
  description?: string;
  previousOccupancy?: string;
  whoWillShow?: string;
  paintingRequired?: string;
  cleaningRequired?: string;
  secondaryNumber?: string;
}

export interface ScheduleInfo {
  availability: 'everyday' | 'weekday' | 'weekend';
  paintingService?: 'book' | 'decline';
  cleaningService?: 'book' | 'decline';
  startTime?: string;
  endTime?: string;
  availableAllDay?: boolean;
}

export interface PropertyInfo {
  propertyDetails: PropertyDetails;
  locationDetails: LocationDetails;
  rentalDetails: RentalDetails;
  amenities: PropertyAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
  scheduleInfo: ScheduleInfo;
}

export interface PropertyFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: PropertyInfo;
}

// PG/Hostel specific interfaces
export interface PGHostelDetails extends Omit<RentalDetails, 'listingType'> {
  listingType: 'PG/Hostel';
  roomType: 'single' | 'shared' | 'dormitory';
  genderPreference: 'male' | 'female' | 'any';
  mealOptions: 'included' | 'optional' | 'not-available';
  timingRestrictions?: string;
  houseRules?: string;
}

export interface PGHostelAmenities extends PropertyAmenities {
  meals?: 'breakfast' | 'lunch' | 'dinner' | 'all-meals' | 'none';
  laundry?: 'included' | 'paid' | 'not-available';
  commonArea?: 'tv-room' | 'study-room' | 'recreation' | 'all';
  cleaning?: 'daily' | 'weekly' | 'self';
}

export interface PGHostelInfo {
  propertyDetails: PropertyDetails;
  locationDetails: LocationDetails;
  pgDetails: PGHostelDetails;
  amenities: PGHostelAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
  scheduleInfo: ScheduleInfo;
}

// Flatmates specific interfaces
export interface FlattmatesDetails extends Omit<RentalDetails, 'listingType'> {
  listingType: 'Flatmates';
  existingFlatmates: number;
  genderPreference: 'male' | 'female' | 'any';
  occupation: 'student' | 'working' | 'any';
  lifestylePreference: 'social' | 'quiet' | 'mixed';
  smokingAllowed: boolean;
  petsAllowed: boolean;
}

export interface FlattmatesAmenities extends PropertyAmenities {
  sharedKitchen?: boolean;
  sharedLivingRoom?: boolean;
  dedicatedBathroom?: boolean;
  sharedParking?: boolean;
}

export interface FlattmatesInfo {
  propertyDetails: PropertyDetails;
  locationDetails: LocationDetails;
  flattmatesDetails: FlattmatesDetails;
  amenities: FlattmatesAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
  scheduleInfo: ScheduleInfo;
}

// Form data interfaces
export interface PGHostelFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: PGHostelInfo;
}

export interface FlattmatesFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: FlattmatesInfo;
}

export interface PropertyDraft {
  id?: string;
  userId: string;
  step: number;
  ownerInfo?: Partial<OwnerInfo>;
  propertyInfo?: Partial<PropertyInfo>;
  createdAt?: string;
  updatedAt?: string;
}

// Commercial specific interfaces
export interface CommercialPropertyDetails extends Omit<PropertyDetails, 'bhkType' | 'bathrooms' | 'balconies'> {
  spaceType: 'office' | 'retail' | 'warehouse' | 'showroom' | 'restaurant' | 'co-working' | 'industrial' | 'medical' | 'educational';
  powerLoad?: string;
  ceilingHeight?: string;
  entranceWidth?: string;
  loadingFacility?: boolean;
}

export interface CommercialRentalDetails extends Omit<RentalDetails, 'preferredTenants' | 'idealFor' | 'listingType'> {
  listingType: 'Rent';
  businessType?: string[];
  operatingHours?: string;
  restrictedActivities?: string[];
  leaseTerm?: string;
  escalationClause?: string;
  gst?: boolean;
}

export interface CommercialAmenities extends PropertyAmenities {
  washrooms?: string;
  currentPropertyCondition?: string;
  currentBusiness?: string;
  moreSimilarUnits?: boolean;
  directionsTip?: string;
}

export interface CommercialInfo {
  propertyDetails: CommercialPropertyDetails;
  locationDetails: LocationDetails;
  rentalDetails: CommercialRentalDetails;
  amenities: CommercialAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
  scheduleInfo: ScheduleInfo;
}

export interface CommercialFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: CommercialInfo;
}