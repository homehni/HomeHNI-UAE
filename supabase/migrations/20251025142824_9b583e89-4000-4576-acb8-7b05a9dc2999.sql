-- Approve all properties in the properties table
UPDATE public.properties 
SET status = 'approved', 
    updated_at = now()
WHERE status != 'approved';

-- Also approve all property submissions
UPDATE public.property_submissions 
SET status = 'approved', 
    updated_at = now()
WHERE status != 'approved';