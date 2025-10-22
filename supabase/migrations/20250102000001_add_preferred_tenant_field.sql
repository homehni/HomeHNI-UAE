-- Add preferred_tenant field to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN preferred_tenant TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.property_drafts.preferred_tenant IS 'Preferred tenant type (e.g., Family, Bachelor Female, Bachelor Male, Company, Anyone)';
