import { OwnerInfo, PropertyInfo, PropertyDetails, LocationDetails, RentalDetails, AdditionalInfo } from '@/types/property';
import { 
  sanitizeText, 
  sanitizeEmail, 
  sanitizePhone, 
  sanitizeNumber, 
  sanitizePropertyDescription,
  validateFileUpload,
  propertySubmissionLimiter
} from './inputSanitization';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: {
    ownerInfo: Partial<OwnerInfo>;
    propertyInfo: {
      propertyDetails?: Partial<PropertyDetails>;
      locationDetails?: Partial<LocationDetails>;
      rentalDetails?: Partial<RentalDetails>;
      additionalInfo?: Partial<AdditionalInfo>;
    };
  };
}

export const validatePropertySubmission = (
  ownerInfo: OwnerInfo,
  propertyInfo: PropertyInfo,
  userIdentifier?: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Rate limiting check
  if (userIdentifier && !propertySubmissionLimiter.canAttempt(userIdentifier)) {
    const remainingTime = Math.ceil(propertySubmissionLimiter.getRemainingTime(userIdentifier) / 1000 / 60);
    errors.push(`Too many submission attempts. Please wait ${remainingTime} minutes before trying again.`);
    return { isValid: false, errors, warnings };
  }

  // Sanitize and validate owner information
  const sanitizedOwner = {
    fullName: sanitizeText(ownerInfo.fullName || '', { maxLength: 100 }),
    phoneNumber: sanitizePhone(ownerInfo.phoneNumber || ''),
    email: sanitizeEmail(ownerInfo.email || ''),
    role: ownerInfo.role
  };

  // Minimal owner validation - only require at least one field
  const hasOwnerInfo = sanitizedOwner.fullName || sanitizedOwner.phoneNumber || sanitizedOwner.email;
  if (!hasOwnerInfo) errors.push('At least one owner detail (name, phone, or email) is required');

  // Relaxed phone number validation - only validate if provided
  if (sanitizedOwner.phoneNumber && sanitizedOwner.phoneNumber.length > 0 && !/^\+?[\d\s-()]{7,}$/.test(sanitizedOwner.phoneNumber)) {
    warnings.push('Phone number format may be invalid');
  }

  // Sanitize and validate property information
  const sanitizedProperty = {
    title: sanitizeText(propertyInfo.propertyDetails?.title || '', { maxLength: 200 }),
    propertyType: sanitizeText(propertyInfo.propertyDetails?.propertyType || '', { maxLength: 50 }),
    listingType: propertyInfo.rentalDetails?.listingType,
    state: sanitizeText(propertyInfo.locationDetails?.state || '', { maxLength: 50 }),
    city: sanitizeText(propertyInfo.locationDetails?.city || '', { maxLength: 100 }),
    locality: sanitizeText(propertyInfo.locationDetails?.locality || '', { maxLength: 100 }),
    pincode: sanitizeText(propertyInfo.locationDetails?.pincode || '', { maxLength: 10 }),
    description: sanitizePropertyDescription(propertyInfo.additionalInfo?.description || ''),
    expectedPrice: sanitizeNumber(propertyInfo.rentalDetails?.expectedPrice, 1, 100000000),
    superBuiltUpArea: sanitizeNumber(propertyInfo.propertyDetails?.superBuiltUpArea, 1, 50000),
    bathrooms: sanitizeNumber(propertyInfo.propertyDetails?.bathrooms, 0, 20),
    balconies: sanitizeNumber(propertyInfo.propertyDetails?.balconies, 0, 10)
  };

  // Minimal property validation - only require at least one meaningful field
  const hasPropertyInfo = sanitizedProperty.title || sanitizedProperty.propertyType || 
                          sanitizedProperty.state || sanitizedProperty.city || 
                          sanitizedProperty.locality || sanitizedProperty.expectedPrice > 0;
  
  if (!hasPropertyInfo) {
    errors.push('At least one property detail is required (title, type, location, or price)');
  }
  
  // Gentle warnings for missing important fields
  if (!sanitizedProperty.title) warnings.push('Property title is recommended for better visibility');
  if (!sanitizedProperty.propertyType) warnings.push('Property type helps categorize your listing');
  if (!sanitizedProperty.state || !sanitizedProperty.city) warnings.push('Location details help buyers find your property');

  // Relaxed validations - convert to warnings
  if (sanitizedProperty.pincode && !/^\d{5,6}$/.test(sanitizedProperty.pincode)) {
    warnings.push('Pincode should be 5-6 digits for better accuracy');
  }

  if (sanitizedProperty.expectedPrice <= 0 && sanitizedProperty.expectedPrice !== null) {
    warnings.push('Expected price helps buyers understand your property value');
  }

  if (sanitizedProperty.superBuiltUpArea <= 0 && sanitizedProperty.superBuiltUpArea !== null) {
    warnings.push('Super built-up area helps buyers understand property size');
  }

  // Relaxed image validation - make images optional but recommend them
  if (!propertyInfo.gallery?.images || propertyInfo.gallery.images.length === 0) {
    warnings.push('Adding images will make your property more attractive to buyers');
  } else if (propertyInfo.gallery.images.length < 3) {
    warnings.push('At least 3 images are recommended for better visibility');
  } else if (propertyInfo.gallery.images.length > 15) {
    warnings.push('Consider limiting to 15 images for better loading speed');
  }

  // Validate each image file if provided
  if (propertyInfo.gallery?.images) {
    for (let i = 0; i < propertyInfo.gallery.images.length; i++) {
      const validation = validateFileUpload(propertyInfo.gallery.images[i], 'image');
      if (!validation.isValid) {
        warnings.push(`Image ${i + 1}: ${validation.errors.join(', ')}`);
      }
    }
  }

  // Video validation (optional) - convert to warnings
  if (propertyInfo.gallery?.video) {
    const validation = validateFileUpload(propertyInfo.gallery.video, 'video');
    if (!validation.isValid) {
      warnings.push(`Video: ${validation.errors.join(', ')}`);
    }
  }

  // Security checks for suspicious content
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  const allTextFields = [
    sanitizedOwner.fullName,
    sanitizedProperty.title,
    sanitizedProperty.description,
    sanitizedProperty.locality
  ];

  for (const field of allTextFields) {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(field)) {
        errors.push('Suspicious content detected in form fields');
        break;
      }
    }
  }

  // Warning validations
  if (sanitizedProperty.description.length > 1500) {
    warnings.push('Property description is quite long. Consider making it more concise.');
  }

  if (sanitizedProperty.expectedPrice > 10000000) {
    warnings.push('Property price seems unusually high. Please verify.');
  }

  // Record attempt for rate limiting
  if (userIdentifier && errors.length === 0) {
    propertySubmissionLimiter.recordAttempt(userIdentifier);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedData: {
      ownerInfo: sanitizedOwner,
      propertyInfo: {
        propertyDetails: {
          title: sanitizedProperty.title,
          propertyType: sanitizedProperty.propertyType,
          superBuiltUpArea: sanitizedProperty.superBuiltUpArea,
          bathrooms: sanitizedProperty.bathrooms,
          balconies: sanitizedProperty.balconies
        },
        locationDetails: {
          state: sanitizedProperty.state,
          city: sanitizedProperty.city,
          locality: sanitizedProperty.locality,
          pincode: sanitizedProperty.pincode
        },
        rentalDetails: {
          expectedPrice: sanitizedProperty.expectedPrice,
          listingType: sanitizedProperty.listingType
        },
        additionalInfo: {
          description: sanitizedProperty.description
        }
      }
    }
  };
};