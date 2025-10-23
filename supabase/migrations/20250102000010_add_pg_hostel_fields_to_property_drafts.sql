-- Add PG/Hostel specific fields to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN IF NOT EXISTS room_type TEXT,
ADD COLUMN IF NOT EXISTS gender_preference TEXT,
ADD COLUMN IF NOT EXISTS preferred_guests TEXT,
ADD COLUMN IF NOT EXISTS food_included TEXT,
ADD COLUMN IF NOT EXISTS gate_closing_time TEXT,
ADD COLUMN IF NOT EXISTS cupboard BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS geyser BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tv BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ac BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bedding BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS attached_bathroom BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS no_smoking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS no_guardians_stay BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS no_girls_entry BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS no_drinking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS no_non_veg BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS water_storage_facility TEXT,
ADD COLUMN IF NOT EXISTS wifi TEXT;

-- Add indexes for PG/Hostel specific fields
CREATE INDEX IF NOT EXISTS idx_property_drafts_room_type ON public.property_drafts(room_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_gender_preference ON public.property_drafts(gender_preference);
CREATE INDEX IF NOT EXISTS idx_property_drafts_food_included ON public.property_drafts(food_included);
