-- Add Land/Plot infrastructure fields to property_drafts table
ALTER TABLE public.property_drafts
ADD COLUMN IF NOT EXISTS electricity_connection TEXT,
ADD COLUMN IF NOT EXISTS sewage_connection TEXT;
