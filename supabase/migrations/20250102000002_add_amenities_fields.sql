-- Add missing amenities fields to property_drafts table
ALTER TABLE public.property_drafts 
ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS balconies INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pet_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS non_veg_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS who_will_show TEXT,
ADD COLUMN IF NOT EXISTS secondary_phone TEXT,
ADD COLUMN IF NOT EXISTS more_similar_units BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS internet_services TEXT,
ADD COLUMN IF NOT EXISTS air_conditioner TEXT,
ADD COLUMN IF NOT EXISTS club_house TEXT,
ADD COLUMN IF NOT EXISTS intercom TEXT,
ADD COLUMN IF NOT EXISTS swimming_pool TEXT,
ADD COLUMN IF NOT EXISTS children_play_area TEXT,
ADD COLUMN IF NOT EXISTS fire_safety TEXT,
ADD COLUMN IF NOT EXISTS servant_room TEXT,
ADD COLUMN IF NOT EXISTS shopping_center TEXT,
ADD COLUMN IF NOT EXISTS gas_pipeline TEXT,
ADD COLUMN IF NOT EXISTS park TEXT,
ADD COLUMN IF NOT EXISTS rain_water_harvesting TEXT,
ADD COLUMN IF NOT EXISTS sewage_treatment_plant TEXT,
ADD COLUMN IF NOT EXISTS house_keeping TEXT,
ADD COLUMN IF NOT EXISTS visitor_parking TEXT,
ADD COLUMN IF NOT EXISTS water_storage_facility TEXT,
ADD COLUMN IF NOT EXISTS wifi TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.property_drafts.bathrooms IS 'Number of bathrooms';
COMMENT ON COLUMN public.property_drafts.balconies IS 'Number of balconies';
COMMENT ON COLUMN public.property_drafts.pet_allowed IS 'Whether pets are allowed';
COMMENT ON COLUMN public.property_drafts.non_veg_allowed IS 'Whether non-vegetarian food is allowed';
COMMENT ON COLUMN public.property_drafts.who_will_show IS 'Who will show the property';
COMMENT ON COLUMN public.property_drafts.secondary_phone IS 'Secondary contact phone number';
COMMENT ON COLUMN public.property_drafts.more_similar_units IS 'Whether more similar units are available';
COMMENT ON COLUMN public.property_drafts.internet_services IS 'Internet services availability';
COMMENT ON COLUMN public.property_drafts.air_conditioner IS 'Air conditioner availability';
COMMENT ON COLUMN public.property_drafts.club_house IS 'Club house availability';
COMMENT ON COLUMN public.property_drafts.intercom IS 'Intercom availability';
COMMENT ON COLUMN public.property_drafts.swimming_pool IS 'Swimming pool availability';
COMMENT ON COLUMN public.property_drafts.children_play_area IS 'Children play area availability';
COMMENT ON COLUMN public.property_drafts.fire_safety IS 'Fire safety availability';
COMMENT ON COLUMN public.property_drafts.servant_room IS 'Servant room availability';
COMMENT ON COLUMN public.property_drafts.shopping_center IS 'Shopping center availability';
COMMENT ON COLUMN public.property_drafts.gas_pipeline IS 'Gas pipeline availability';
COMMENT ON COLUMN public.property_drafts.park IS 'Park availability';
COMMENT ON COLUMN public.property_drafts.rain_water_harvesting IS 'Rain water harvesting availability';
COMMENT ON COLUMN public.property_drafts.sewage_treatment_plant IS 'Sewage treatment plant availability';
COMMENT ON COLUMN public.property_drafts.house_keeping IS 'House keeping availability';
COMMENT ON COLUMN public.property_drafts.visitor_parking IS 'Visitor parking availability';
COMMENT ON COLUMN public.property_drafts.water_storage_facility IS 'Water storage facility availability';
COMMENT ON COLUMN public.property_drafts.wifi IS 'WiFi availability';
