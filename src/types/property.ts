export interface OwnerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  role: 'Owner' | 'Agent' | 'Builder';
}

export interface PropertyInfo {
  title: string;
  propertyType: string;
  listingType: 'Sale' | 'Rent';
  bhkType: string;
  bathrooms: number;
  balconies: number;
  superArea: number;
  carpetArea?: number;
  expectedPrice: number;
  state: string;
  city: string;
  locality: string;
  pincode: string;
  description?: string;
  images: File[];
  video?: File;
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