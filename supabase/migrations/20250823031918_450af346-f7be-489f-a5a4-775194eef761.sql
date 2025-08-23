-- Add is_featured column to properties table
ALTER TABLE public.properties 
ADD COLUMN is_featured boolean DEFAULT false NOT NULL;

-- Add index for better query performance
CREATE INDEX idx_properties_featured_status ON public.properties (is_featured, status) WHERE is_featured = true;

-- Update existing featured properties in content_elements to use the new system
-- This helps maintain existing featured properties
UPDATE public.properties 
SET is_featured = true 
WHERE status = 'approved' 
AND id IN (
  SELECT DISTINCT (content->>'property_id')::uuid as property_id
  FROM public.content_elements 
  WHERE element_key LIKE 'property_%' 
  AND is_active = true
  AND (content->>'property_id')::uuid IS NOT NULL
  LIMIT 19
);