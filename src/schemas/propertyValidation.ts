import { z } from 'zod';

export const ownerInfoSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['Owner', 'Agent', 'Builder']),
  city: z.string().min(1, 'Please select your city'),
  whatsappUpdates: z.boolean(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land/Plot']),
  listingType: z.enum(['Rent', 'Resale', 'PG/Hostel', 'Flatmates', 'Sale']),
});

export const propertyInfoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  propertyType: z.string().min(1, 'Please select property type'),
  listingType: z.enum(['Sale', 'Rent']).refine(val => val !== undefined, {
    message: 'Please select listing type',
  }),
  bhkType: z.string().min(1, 'Please select BHK type'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
  balconies: z.number().min(0, 'Balconies cannot be negative'),
  superArea: z.number().min(1, 'Super area is required'),
  carpetArea: z.number().optional(),
  expectedPrice: z.number().min(1, 'Expected price is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
  description: z.string().optional(),
  images: z.array(z.any()).min(3, 'Minimum 3 images required').max(10, 'Maximum 10 images allowed'),
  video: z.any().optional(),
});

export type OwnerInfoFormData = z.infer<typeof ownerInfoSchema>;
export type PropertyInfoFormData = z.infer<typeof propertyInfoSchema>;