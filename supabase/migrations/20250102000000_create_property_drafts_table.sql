-- Create property_drafts table for storing draft property data
CREATE TABLE IF NOT EXISTS public.property_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Property Selection Data
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  
  -- Owner Information
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  whatsapp_updates BOOLEAN DEFAULT false,
  
  -- Property Details
  apartment_type TEXT,
  apartment_name TEXT,
  bhk_type TEXT,
  floor_no INTEGER DEFAULT 0,
  total_floors INTEGER DEFAULT 0,
  property_age TEXT,
  facing TEXT,
  built_up_area INTEGER DEFAULT 0,
  carpet_area INTEGER DEFAULT 0,
  
  -- Location Details
  state TEXT,
  city TEXT,
  locality TEXT,
  pincode TEXT,
  society_name TEXT,
  landmark TEXT,
  
  -- Rental Details (for rental properties)
  expected_rent INTEGER DEFAULT 0,
  expected_deposit INTEGER DEFAULT 0,
  rent_negotiable BOOLEAN DEFAULT false,
  monthly_maintenance TEXT,
  available_from DATE,
  description TEXT,
  
  -- Sale Details (for sale properties)
  expected_price INTEGER DEFAULT 0,
  price_negotiable BOOLEAN DEFAULT false,
  possession_date DATE,
  
  -- Amenities
  furnishing TEXT,
  parking TEXT,
  power_backup TEXT,
  lift TEXT,
  water_supply TEXT,
  security TEXT,
  gym TEXT,
  gated_security TEXT,
  current_property_condition TEXT,
  directions_tip TEXT,
  
  -- Gallery
  images TEXT[] DEFAULT '{}',
  video TEXT,
  
  -- Additional Info
  additional_info JSONB DEFAULT '{}',
  
  -- Schedule Info
  schedule_info JSONB DEFAULT '{}',
  
  -- Metadata
  current_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_drafts_user_id ON public.property_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_property_drafts_property_type ON public.property_drafts(property_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_listing_type ON public.property_drafts(listing_type);
CREATE INDEX IF NOT EXISTS idx_property_drafts_city ON public.property_drafts(city);
CREATE INDEX IF NOT EXISTS idx_property_drafts_locality ON public.property_drafts(locality);
CREATE INDEX IF NOT EXISTS idx_property_drafts_created_at ON public.property_drafts(created_at);

-- Enable RLS
ALTER TABLE public.property_drafts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own drafts" ON public.property_drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" ON public.property_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" ON public.property_drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" ON public.property_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS update_property_drafts_updated_at ON public.property_drafts;
CREATE TRIGGER update_property_drafts_updated_at
  BEFORE UPDATE ON public.property_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_property_drafts_updated_at();
