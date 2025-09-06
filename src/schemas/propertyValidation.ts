import { z } from 'zod';

export const ownerInfoSchema = z.object({
  phoneNumber: z.string().optional(),
  role: z.enum(['Owner', 'Agent', 'Builder']).optional(),
  whatsappUpdates: z.boolean().optional(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land/Plot']).optional(),
  listingType: z.enum(['Rent', 'Resale', 'PG/Hostel', 'Flatmates', 'Sale']).optional(),
});

export const propertyInfoSchema = z.object({
  title: z.string().optional(),
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