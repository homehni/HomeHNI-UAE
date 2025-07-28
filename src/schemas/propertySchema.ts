import { z } from 'zod';

export const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  property_type: z.enum(['apartment', 'villa', 'plot', 'commercial']),
  listing_type: z.enum(['sale', 'rent']),
  bhk_type: z.enum(['1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+']).optional(),
  bathrooms: z.number().min(0).optional(),
  balconies: z.number().min(0).optional(),
  furnishing: z.enum(['fully', 'semi', 'unfurnished']).optional(),
  floor_no: z.number().min(0).optional(),
  total_floors: z.number().min(1).optional(),
  super_area: z.number().min(1, 'Super area is required'),
  carpet_area: z.number().min(0).optional(),
  availability_type: z.enum(['immediate', 'date']),
  availability_date: z.date().optional(),
  expected_price: z.number().min(1, 'Expected price is required'),
  price_negotiable: z.boolean().optional().default(true),
  maintenance_charges: z.number().min(0).optional(),
  security_deposit: z.number().min(0).optional(),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  street_address: z.string().optional(),
  pincode: z.string().min(6, 'Valid pincode is required'),
  landmarks: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.availability_type === 'date' && !data.availability_date) {
    return false;
  }
  return true;
}, {
  message: "Availability date is required when availability type is 'date'",
  path: ["availability_date"],
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;