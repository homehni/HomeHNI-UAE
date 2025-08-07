// Types specifically for commercial sale properties

export interface CommercialSaleDetails {
  listingType: 'Sale';
  expectedPrice: number;
  priceNegotiable?: boolean;
  pricePerSqFt?: number;
  possessionDate: string;
  ownershipType: string;
  propertyAge: string;
  registrationStatus: 'ready_to_move' | 'under_construction';
  homeLoanAvailable?: boolean;
  maintenanceCharges?: number;
  bookingAmount?: number;
  businessType?: string[];
  operatingHours?: string;
  restrictedActivities?: string[];
  gst?: boolean;
}

export interface CommercialSaleInfo {
  propertyDetails: import('@/types/property').CommercialPropertyDetails;
  locationDetails: import('@/types/property').LocationDetails;
  saleDetails: CommercialSaleDetails;
  amenities: import('@/types/property').CommercialAmenities;
  gallery: import('@/types/property').PropertyGallery;
  additionalInfo: import('@/types/property').AdditionalInfo;
  scheduleInfo: import('@/types/property').ScheduleInfo;
}

export interface CommercialSaleFormData {
  ownerInfo: import('@/types/property').OwnerInfo;
  propertyInfo: CommercialSaleInfo;
}