// Types specifically for sale/resale properties

export interface SaleDetails {
  listingType: 'Sale';
  expectedPrice: number;
  priceNegotiable?: boolean;
  possessionDate?: string;
  propertyAge: string;
  registrationStatus: 'ready_to_move' | 'under_construction';
  homeLoanAvailable?: boolean;
  maintenanceCharges?: number;
  pricePerSqFt?: number;
  bookingAmount?: number;
}

export interface SalePropertyInfo {
  propertyDetails: import('@/types/property').PropertyDetails;
  locationDetails: import('@/types/property').LocationDetails;
  saleDetails: SaleDetails;
  amenities: import('@/types/property').PropertyAmenities;
  gallery: import('@/types/property').PropertyGallery;
  additionalInfo: import('@/types/property').AdditionalInfo;
  scheduleInfo: import('@/types/property').ScheduleInfo;
}

export interface SalePropertyFormData {
  ownerInfo: import('@/types/property').OwnerInfo;
  propertyInfo: SalePropertyInfo;
}