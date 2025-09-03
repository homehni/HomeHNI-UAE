-- Add missing property detail fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS property_age text,
ADD COLUMN IF NOT EXISTS facing_direction text,
ADD COLUMN IF NOT EXISTS floor_type text,
ADD COLUMN IF NOT EXISTS registration_status text,
ADD COLUMN IF NOT EXISTS booking_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS home_loan_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS water_supply text,
ADD COLUMN IF NOT EXISTS power_backup text,
ADD COLUMN IF NOT EXISTS gated_security boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS who_will_show text,
ADD COLUMN IF NOT EXISTS current_property_condition text,
ADD COLUMN IF NOT EXISTS secondary_phone text,
ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS additional_documents jsonb DEFAULT '{}';