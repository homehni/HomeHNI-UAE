-- Add missing Land/Plot fields to property_drafts table
ALTER TABLE public.property_drafts
ADD COLUMN IF NOT EXISTS ownership_type TEXT,
ADD COLUMN IF NOT EXISTS approved_by TEXT;
