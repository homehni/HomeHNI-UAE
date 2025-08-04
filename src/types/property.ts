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
  superArea: number;
  carpetArea?: number;
  builtUpArea?: number;
}

export interface PropertyAmenities {
  powerBackup?: string;
  lift?: string;
  parking?: string;
  washrooms?: string;
  waterStorageFacility?: string;
  security?: string;
  wifi?: string;
  currentPropertyCondition?: string;
  currentBusiness?: string;
  moreSimilarUnits?: string;
  directionsTip?: string;
}

export interface PropertyGallery {
  images: File[];
  video?: File;
}

export interface AdditionalInfo {
  description?: string;
  specialFeatures: string[];
  onMainRoad: boolean;
  cornerProperty: boolean;
  gatedSociety: boolean;
}

export interface PropertyInfo {
  propertyDetails: PropertyDetails;
  locationDetails: LocationDetails;
  rentalDetails: RentalDetails;
  amenities: PropertyAmenities;
  gallery: PropertyGallery;
  additionalInfo: AdditionalInfo;
}

export interface PropertyFormData {
  ownerInfo: OwnerInfo;
  propertyInfo: PropertyInfo;
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