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
  if (!propertyInfo.propertyDetails?.title?.trim()) errors.push('Property title is required');
  if (!propertyInfo.propertyDetails?.propertyType?.trim()) errors.push('Property type is required');
  if (!propertyInfo.rentalDetails?.listingType) errors.push('Listing type is required');
  if (!propertyInfo.locationDetails?.state?.trim()) errors.push('State is required');
  if (!propertyInfo.locationDetails?.city?.trim()) errors.push('City is required');
  if (!propertyInfo.locationDetails?.locality?.trim()) errors.push('Locality is required');
  if (!propertyInfo.locationDetails?.pincode?.trim()) errors.push('Pincode is required');

  // Numerical validations
  if (!propertyInfo.rentalDetails?.expectedPrice || propertyInfo.rentalDetails.expectedPrice <= 0) {
    errors.push('Expected price must be greater than 0');
  }

  if (!propertyInfo.propertyDetails?.bathrooms || propertyInfo.propertyDetails.bathrooms < 1) {
    errors.push('At least 1 bathroom is required');
  }

  if (propertyInfo.propertyDetails?.balconies && propertyInfo.propertyDetails.balconies < 0) {
    errors.push('Balconies cannot be negative');
  }

  // Image validation
  if (!propertyInfo.gallery?.images || propertyInfo.gallery.images.length < 3) {
    errors.push('At least 3 property images are required');
  } else if (propertyInfo.gallery.images.length > 10) {
    errors.push('Maximum 10 images allowed');
  }

  // File size validation for images
  if (propertyInfo.gallery?.images) {
    for (const image of propertyInfo.gallery.images) {
      const maxImageSize = 5 * 1024 * 1024; // 5MB
      if (image.size > maxImageSize) {
        errors.push(`Image file size cannot exceed 5MB`);
      }
    }
  }

  // Video validation (optional)
  if (propertyInfo.gallery?.video) {
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    if (propertyInfo.gallery.video.size > maxVideoSize) {
      errors.push('Video file size cannot exceed 50MB');
    }
  }


  // Description validation
  if (propertyInfo.additionalInfo?.description && propertyInfo.additionalInfo.description.length > 1000) {
    warnings.push('Property description is quite long. Consider making it more concise.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};