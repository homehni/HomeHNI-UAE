-- Add missing columns to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS amount numeric,
ADD COLUMN IF NOT EXISTS service_subtype text,
ADD COLUMN IF NOT EXISTS details text;

-- Migrate existing message data to details column
UPDATE public.services 
SET details = message 
WHERE details IS NULL AND message IS NOT NULL;

-- Add index on country for filtering
CREATE INDEX IF NOT EXISTS idx_services_country ON public.services(country);

-- Add index on service_subtype for filtering
CREATE INDEX IF NOT EXISTS idx_services_service_subtype ON public.services(service_subtype);

-- Update table comments
COMMENT ON COLUMN public.services.country IS 'Country of the service requester';
COMMENT ON COLUMN public.services.amount IS 'Amount associated with the service request (if applicable)';
COMMENT ON COLUMN public.services.service_subtype IS 'Specific subtype of the service requested';
COMMENT ON COLUMN public.services.details IS 'Additional details or message from the service requester';

-- Update the insert policy to ensure user_id is optional
DROP POLICY IF EXISTS "Public can submit service requests" ON public.services;

CREATE POLICY "Public can submit service requests"
ON public.services
FOR INSERT
TO public
WITH CHECK (true);