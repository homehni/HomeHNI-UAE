import { OwnerInfo, PropertyInfo } from '@/types/property';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validatePropertySubmission = (
  ownerInfo: OwnerInfo,
  propertyInfo: PropertyInfo
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Owner validation
  if (!ownerInfo.fullName?.trim()) errors.push('Owner full name is required');
  if (!ownerInfo.phoneNumber?.trim()) errors.push('Owner phone number is required');
  if (!ownerInfo.email?.trim()) errors.push('Owner email is required');
  if (!ownerInfo.role) errors.push('Owner role is required');

  // Property validation
  if (!propertyInfo.title?.trim()) errors.push('Property title is required');
  if (!propertyInfo.propertyType?.trim()) errors.push('Property type is required');
  if (!propertyInfo.listingType) errors.push('Listing type is required');
  if (!propertyInfo.state?.trim()) errors.push('State is required');
  if (!propertyInfo.city?.trim()) errors.push('City is required');
  if (!propertyInfo.locality?.trim()) errors.push('Locality is required');
  if (!propertyInfo.pincode?.trim()) errors.push('Pincode is required');

  // Numeric validations
  if (!propertyInfo.superArea || propertyInfo.superArea <= 0) {
    errors.push('Super area must be greater than 0');
  }
  if (!propertyInfo.expectedPrice || propertyInfo.expectedPrice <= 0) {
    errors.push('Expected price must be greater than 0');
  }
  if (propertyInfo.carpetArea && propertyInfo.carpetArea < 0) {
    errors.push('Carpet area cannot be negative');
  }
  if (propertyInfo.bathrooms < 0) {
    errors.push('Bathrooms cannot be negative');
  }
  if (propertyInfo.balconies < 0) {
    errors.push('Balconies cannot be negative');
  }

  // Image validation
  if (!propertyInfo.images || propertyInfo.images.length < 3) {
    errors.push('At least 3 property images are required');
  } else if (propertyInfo.images.length > 10) {
    errors.push('Maximum 10 images are allowed');
  }

  // File size validation (5MB per image)
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  propertyInfo.images?.forEach((image, index) => {
    if (image.size > maxImageSize) {
      errors.push(`Image ${index + 1} is too large. Maximum size is 5MB.`);
    }
  });

  // Video validation
  if (propertyInfo.video) {
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    if (propertyInfo.video.size > maxVideoSize) {
      errors.push('Video is too large. Maximum size is 50MB.');
    }
  }

  // Warnings
  if (propertyInfo.carpetArea && propertyInfo.superArea && 
      propertyInfo.carpetArea > propertyInfo.superArea) {
    warnings.push('Carpet area is larger than super area');
  }

  if (propertyInfo.description && propertyInfo.description.length < 50) {
    warnings.push('Adding a detailed description will help attract more buyers');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};