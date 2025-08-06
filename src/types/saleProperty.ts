export interface SaleDetails {
  listingType: 'Sale' | 'Resale';
  expectedPrice: number;
  priceNegotiable?: boolean;
  possessionDate?: string;
  ageOfProperty?: string;
  registrationStatus?: string;
  homeLoanAvailable?: boolean;
  brokerageType?: string;
  currentPropertyCondition?: string;
  flooringType?: string;
  facingDirection?: string;
}

export interface SalePropertyInfo {
  propertyDetails: import('./property').PropertyDetails;
  locationDetails: import('./property').LocationDetails;
  saleDetails: SaleDetails;
  amenities: import('./property').PropertyAmenities;
  gallery: import('./property').PropertyGallery;
  additionalInfo: import('./property').AdditionalInfo;
  scheduleInfo: import('./property').ScheduleInfo;
}

export interface SalePropertyFormData {
  ownerInfo: import('./property').OwnerInfo;
  propertyInfo: SalePropertyInfo;
}