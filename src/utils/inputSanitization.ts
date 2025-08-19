// Input sanitization and validation utilities
import DOMPurify from 'dompurify';

interface SanitizationOptions {
  maxLength?: number;
  allowHTML?: boolean;
  stripWhitespace?: boolean;
}

/**
 * Sanitize text input to prevent XSS and other security issues
 */
export const sanitizeText = (input: string, options: SanitizationOptions = {}): string => {
  if (!input || typeof input !== 'string') return '';
  
  const {
    maxLength = 1000,
    allowHTML = false,
    stripWhitespace = true
  } = options;
  
  let sanitized = input;
  
  // Strip whitespace if requested
  if (stripWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Sanitize HTML content
  if (!allowHTML) {
    // Remove all HTML tags and decode entities
    sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
  } else {
    // Allow only safe HTML tags
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }
  
  // Enforce maximum length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  const sanitized = sanitizeText(email, { maxLength: 254, stripWhitespace: true });
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized.toLowerCase() : '';
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except + at the beginning
  let sanitized = phone.replace(/[^\d+]/g, '');
  
  // Ensure + only appears at the beginning
  if (sanitized.includes('+')) {
    const parts = sanitized.split('+');
    sanitized = '+' + parts.join('').replace(/[^0-9]/g, '');
  }
  
  // Limit length to reasonable phone number size
  return sanitized.substring(0, 20);
};

/**
 * Sanitize numeric values
 */
export const sanitizeNumber = (value: any, min = 0, max = Number.MAX_SAFE_INTEGER): number => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.min(Math.max(num, min), max);
};

/**
 * Sanitize property description with enhanced security
 */
export const sanitizePropertyDescription = (description: string): string => {
  return sanitizeText(description, { 
    maxLength: 2000, 
    allowHTML: false, 
    stripWhitespace: true 
  });
};

/**
 * Validate and sanitize file uploads
 */
export interface FileValidationResult {
  isValid: boolean;
  sanitizedName: string;
  errors: string[];
}

export const validateFileUpload = (file: File, type: 'image' | 'video'): FileValidationResult => {
  const errors: string[] = [];
  
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  const allowedTypes = type === 'image' ? allowedImageTypes : allowedVideoTypes;
  const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
  
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  // Validate file size
  if (file.size > maxSize) {
    errors.push(`File size too large. Maximum: ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Sanitize filename
  let sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores
    .substring(0, 100); // Limit length
  
  // Ensure proper extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension && !sanitizedName.endsWith(`.${extension}`)) {
    sanitizedName += `.${extension}`;
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedName,
    errors
  };
};

/**
 * Rate limiting utility for form submissions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length < this.maxAttempts;
  }
  
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(now);
    this.attempts.set(identifier, attempts);
  }
  
  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeUntilReset);
  }
}

// Global rate limiter instance
export const propertySubmissionLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 submissions per 10 minutes