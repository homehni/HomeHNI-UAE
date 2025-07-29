-- Add status column to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));

-- Update existing records to have 'draft' status
UPDATE public.property_drafts SET status = 'draft' WHERE status IS NULL;