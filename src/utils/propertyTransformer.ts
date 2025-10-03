/**
 * Property Transformation Utilities
 * Handles conversion between database and UI property formats
 */

import { DatabaseProperty, Property } from '@/types/propertySearch.types';
import { formatCurrency, UI_CONFIG } from '@/config/propertySearch.config';

/**
 * Transforms a database property to UI format
 */
export function transformProperty(dbProperty: DatabaseProperty): Property {
  const displayPropertyType = formatPropertyType(dbProperty.property_type);
  
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    location: formatLocation(dbProperty.locality, dbProperty.city),
    price: formatCurrency(dbProperty.expected_price),
    priceNumber: dbProperty.expected_price || 0,
    area: `${dbProperty.super_area || 0} sq ft`,
    areaNumber: dbProperty.super_area || 0,
    bedrooms: parseBedrooms(dbProperty.bhk_type),
    bathrooms: dbProperty.bathrooms || 0,
    image: formatImages(dbProperty.images),
    propertyType: displayPropertyType,
    furnished: formatFurnishing(dbProperty.furnishing),
    availability: formatAvailability(dbProperty.availability_type),
    ageOfProperty: formatPropertyAge(dbProperty.property_age),
    locality: dbProperty.locality || '',
    city: dbProperty.city || '',
    bhkType: dbProperty.bhk_type || '1bhk',
    listingType: dbProperty.listing_type || 'sale',
    isNew: isNewProperty(dbProperty.created_at),
  };
}

/**
 * Transforms multiple database properties
 */
export function transformProperties(dbProperties: DatabaseProperty[]): Property[] {
  return dbProperties.map(transformProperty);
}

/**
 * Formats property type for display
 */
function formatPropertyType(propertyType: string | null): string {
  if (!propertyType) return 'Property';
  
  return propertyType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Formats location string
 */
function formatLocation(locality: string | null, city: string | null): string {
  const parts = [locality, city].filter(Boolean);
  return parts.join(', ');
}

/**
 * Parses bedrooms from BHK type
 */
function parseBedrooms(bhkType: string | null): number {
  if (!bhkType) return 0;
  
  const match = bhkType.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Formats images array
 */
function formatImages(images: string[] | null): string | string[] {
  if (!images || images.length === 0) {
    return '/placeholder.svg';
  }
  
  return images.length === 1 ? images[0] : images;
}

/**
 * Formats furnishing status
 */
function formatFurnishing(furnishing: string | null): string | undefined {
  if (!furnishing) return undefined;
  
  return furnishing
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Formats availability type
 */
function formatAvailability(availabilityType: string | null): string | undefined {
  if (!availabilityType) return undefined;
  
  return availabilityType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Formats property age
 */
function formatPropertyAge(propertyAge: string | null): string | undefined {
  if (!propertyAge) return undefined;
  
  return propertyAge
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Checks if property is new (created within NEW_PROPERTY_DAYS)
 */
function isNewProperty(createdAt: string): boolean {
  const createdDate = new Date(createdAt);
  const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceCreation <= UI_CONFIG.NEW_PROPERTY_DAYS;
}

/**
 * Formats price for filter display
 */
export function formatFilterPrice(price: number, isMax: boolean, maxBudget: number): string {
  if (isMax && price >= maxBudget) {
    return formatCurrency(price) + ' +';
  }
  return formatCurrency(price);
}
