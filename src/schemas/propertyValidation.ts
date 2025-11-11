import { z } from 'zod';

export const ownerInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => {
      // Remove spaces and non-digit characters for validation
      const digitsOnly = val.replace(/\D/g, '');
      // UAE phone numbers should be 9 digits (mobile numbers start with 50, 52, 54, 55, 56, 58)
      // Allow 9-10 digits to be flexible (some users might include leading 0)
      return digitsOnly.length >= 9 && digitsOnly.length <= 10;
    }, 'Please enter a valid UAE mobile number (9 digits)'),
  whatsappUpdates: z.boolean().optional(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land/Plot']).optional(),
  listingType: z.enum(['Rent', 'Resale', 'PG/Hostel', 'Flatmates', 'Sale', 'Industrial land', 'Agricultural Land', 'Commercial land']).optional(),
});

export const propertyInfoSchema = z.object({
  title: z.string().optional(), // Made optional - will be auto-generated
  propertyType: z.string().optional(),
  listingType: z.enum(['Sale', 'Rent']).optional(),
  bhkType: z.string().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  superArea: z.number().optional(),
  carpetArea: z.number().optional(),
  expectedPrice: z.number().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  pincode: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.any()).optional(),
  video: z.any().optional(),
});

export type OwnerInfoFormData = z.infer<typeof ownerInfoSchema>;
export type PropertyInfoFormData = z.infer<typeof propertyInfoSchema>;