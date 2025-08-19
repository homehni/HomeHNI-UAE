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

  // Owner validation with sanitized data
  if (!sanitizedOwner.fullName) errors.push('Owner full name is required');
  if (!sanitizedOwner.phoneNumber) errors.push('Valid owner phone number is required');
  if (!sanitizedOwner.email) errors.push('Valid owner email is required');
  if (!sanitizedOwner.role) errors.push('Owner role is required');

  // Phone number format validation
  if (sanitizedOwner.phoneNumber && !/^\+?[\d\s-()]{10,}$/.test(sanitizedOwner.phoneNumber)) {
    errors.push('Phone number format is invalid');
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

  // Property validation with sanitized data
  if (!sanitizedProperty.title || sanitizedProperty.title.length < 10) {
    errors.push('Property title must be at least 10 characters');
  }
  if (!sanitizedProperty.propertyType) errors.push('Property type is required');
  if (!sanitizedProperty.listingType) errors.push('Listing type is required');
  if (!sanitizedProperty.state) errors.push('State is required');
  if (!sanitizedProperty.city) errors.push('City is required');
  if (!sanitizedProperty.locality) errors.push('Locality is required');
  if (!sanitizedProperty.pincode) errors.push('Pincode is required');

  // Pincode validation
  if (sanitizedProperty.pincode && !/^\d{5,6}$/.test(sanitizedProperty.pincode)) {
    errors.push('Pincode must be 5-6 digits');
  }

  // Numerical validations
  if (sanitizedProperty.expectedPrice <= 0) {
    errors.push('Expected price must be greater than 0');
  }

  if (sanitizedProperty.superBuiltUpArea <= 0) {
    errors.push('Super built-up area must be greater than 0');
  }

  // File validation for images
  if (!propertyInfo.gallery?.images || propertyInfo.gallery.images.length < 3) {
    errors.push('At least 3 property images are required');
  } else if (propertyInfo.gallery.images.length > 10) {
    errors.push('Maximum 10 images allowed');
  }

  // Validate each image file
  if (propertyInfo.gallery?.images) {
    for (let i = 0; i < propertyInfo.gallery.images.length; i++) {
      const validation = validateFileUpload(propertyInfo.gallery.images[i], 'image');
      if (!validation.isValid) {
        errors.push(`Image ${i + 1}: ${validation.errors.join(', ')}`);
      }
    }
  }

  // Video validation (optional)
  if (propertyInfo.gallery?.video) {
    const validation = validateFileUpload(propertyInfo.gallery.video, 'video');
    if (!validation.isValid) {
      errors.push(`Video: ${validation.errors.join(', ')}`);
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