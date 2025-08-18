-- Phase 1: Create sanitized public view for properties
CREATE VIEW public.public_properties AS
SELECT 
  id,
  title,
  property_type,
  listing_type,
  bhk_type,
  expected_price,
  super_area,
  carpet_area,
  bathrooms,
  balconies,
  floor_no,
  total_floors,
  furnishing,
  availability_type,
  availability_date,
  price_negotiable,
  maintenance_charges,
  security_deposit,
  city,
  locality,
  state,
  pincode,
  street_address,
  landmarks,
  description,
  images,
  videos,
  status,
  created_at,
  updated_at
FROM public.properties
WHERE status IN ('approved', 'active');

-- Remove public access to full properties table
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;

-- Phase 2: Add missing database triggers (drop existing first)
DROP TRIGGER IF EXISTS prevent_non_admin_status_update_trigger ON public.properties;
DROP TRIGGER IF EXISTS update_properties_updated_at_trigger ON public.properties;
DROP TRIGGER IF EXISTS set_lead_owner_trigger ON public.leads;
DROP TRIGGER IF EXISTS prevent_lead_ids_update_trigger ON public.leads;
DROP TRIGGER IF EXISTS update_leads_updated_at_trigger ON public.leads;

CREATE TRIGGER prevent_non_admin_status_update_trigger
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_non_admin_status_update();

CREATE TRIGGER update_properties_updated_at_trigger
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_lead_owner_trigger
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_lead_owner();

CREATE TRIGGER prevent_lead_ids_update_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_lead_ids_update();

CREATE TRIGGER update_leads_updated_at_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 3: Enhanced storage security policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

CREATE POLICY "Property media is publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-media');

CREATE POLICY "Authenticated users can upload to their folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own property media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own property media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage all property media"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'property-media' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Phase 4: Add admin access to leads
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update all leads" ON public.leads;

CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all leads"
ON public.leads
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));