-- Modify leads table to support property posting leads
-- Add new columns for lead type and additional information

-- Make property_id nullable to support posting leads
ALTER TABLE public.leads ALTER COLUMN property_id DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN property_owner_id DROP NOT NULL;

-- Add new columns
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_type text DEFAULT 'inquiry';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS listing_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp_opted_in boolean DEFAULT false;

-- Add check constraint for lead types
ALTER TABLE public.leads ADD CONSTRAINT valid_lead_type 
  CHECK (lead_type IN ('inquiry', 'posting'));

-- Update the set_lead_owner trigger to handle posting leads
CREATE OR REPLACE FUNCTION public.set_lead_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  owner uuid;
BEGIN
  -- Only set property owner for inquiry leads
  IF NEW.lead_type = 'inquiry' AND NEW.property_id IS NOT NULL THEN
    owner := public.get_property_owner(NEW.property_id);
    IF owner IS NULL THEN
      RAISE EXCEPTION 'Invalid property_id: %', NEW.property_id;
    END IF;
    NEW.property_owner_id := owner;
  END IF;
  
  RETURN NEW;
END;
$function$;