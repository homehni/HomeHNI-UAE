-- Fix the property sync trigger to include all missing fields from property_drafts
-- This ensures that when property_submissions are synced to properties table,
-- all the detailed information is properly transferred

CREATE OR REPLACE FUNCTION public.sync_properties_with_submissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  img_array text[] := '{}';
  vid_array text[] := '{}';
  final_status text;
BEGIN
  -- Prevent infinite recursion
  IF current_setting('app.syncing', true) = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Extract images and videos from payload
    IF NEW.payload ? 'images' AND jsonb_typeof(NEW.payload->'images') = 'array' THEN
      SELECT array_agg(value::text) INTO img_array
      FROM jsonb_array_elements(NEW.payload->'images');
    END IF;

    IF NEW.payload ? 'videos' AND jsonb_typeof(NEW.payload->'videos') = 'array' THEN
      SELECT array_agg(value::text) INTO vid_array
      FROM jsonb_array_elements(NEW.payload->'videos');
    END IF;

    -- Determine final status based on auto-approve setting
    SELECT CASE 
      WHEN EXISTS (SELECT 1 FROM app_settings WHERE key = 'auto_approve_properties' AND value = 'true')
      THEN COALESCE(NEW.status, 'approved')
      ELSE COALESCE(NEW.status, 'pending')
    END INTO final_status;

    INSERT INTO public.properties AS p (
      id, user_id, title, city, state, locality, pincode, listing_type, property_type, availability_type, 
      expected_price, super_area, carpet_area, description, images, videos, status, is_visible, is_featured, created_at, updated_at,
      -- Owner fields
      owner_name, owner_email, owner_phone, owner_role,
      -- Property details that were missing
      bhk_type, bathrooms, balconies, furnishing, availability_date,
      -- Additional property characteristics
      property_age, facing_direction, floor_no, total_floors,
      -- Amenities fields
      power_backup, lift, water_supply, security, gym, gated_security,
      current_property_condition, directions_tip, parking,
      -- Additional amenities from property_drafts
      pet_allowed, non_veg_allowed, who_will_show, secondary_phone,
      internet_services, air_conditioner, club_house, intercom,
      swimming_pool, children_play_area, fire_safety, servant_room,
      shopping_center, gas_pipeline, park, rain_water_harvesting,
      sewage_treatment_plant, house_keeping, visitor_parking,
      water_storage_facility, wifi
    ) VALUES (
      NEW.id,
      COALESCE(NEW.user_id, auth.uid()),
      COALESCE(NEW.title, 'Untitled Property'),
      NEW.city,
      NEW.state,
      COALESCE(NEW.payload->>'locality', 'Not Specified'),
      COALESCE(NEW.payload->>'pincode', '000000'),
      COALESCE(NEW.payload->>'listing_type', 'rent'),
      COALESCE(NEW.payload->>'property_type', 'residential'),
      COALESCE(NEW.payload->>'availability_type', 'ready_to_move'),
      COALESCE(NULLIF(NEW.payload->>'expected_price','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'super_area','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'carpet_area','')::numeric, 0),
      NEW.payload->>'description',
      img_array,
      vid_array,
      final_status,
      true,
      true,
      COALESCE(NEW.created_at, now()),
      now(),
      -- Owner fields from payload
      NEW.payload->>'owner_name',
      NEW.payload->>'owner_email',
      NEW.payload->>'owner_phone',
      NEW.payload->>'owner_role',
      -- Property details that were missing
      NEW.payload->>'bhk_type',
      COALESCE(NULLIF(NEW.payload->>'bathrooms','')::integer, 0),
      COALESCE(NULLIF(NEW.payload->>'balconies','')::integer, 0),
      NEW.payload->>'furnishing',
      CASE 
        WHEN NEW.payload->>'available_from' IS NOT NULL 
        THEN (NEW.payload->>'available_from')::date
        ELSE NULL
      END,
      -- Additional property characteristics
      NEW.payload->>'property_age',
      NEW.payload->>'facing',
      COALESCE(NULLIF(NEW.payload->>'floor_no','')::integer, 0),
      COALESCE(NULLIF(NEW.payload->>'total_floors','')::integer, 0),
      -- Amenities fields
      NEW.payload->>'power_backup',
      NEW.payload->>'lift',
      NEW.payload->>'water_supply',
      NEW.payload->>'security',
      NEW.payload->>'gym',
      NEW.payload->>'gated_security',
      NEW.payload->>'current_property_condition',
      NEW.payload->>'directions_tip',
      NEW.payload->>'parking',
      -- Additional amenities from property_drafts
      COALESCE((NEW.payload->>'pet_allowed')::boolean, false),
      COALESCE((NEW.payload->>'non_veg_allowed')::boolean, false),
      NEW.payload->>'who_will_show',
      NEW.payload->>'secondary_phone',
      NEW.payload->>'internet_services',
      NEW.payload->>'air_conditioner',
      NEW.payload->>'club_house',
      NEW.payload->>'intercom',
      NEW.payload->>'swimming_pool',
      NEW.payload->>'children_play_area',
      NEW.payload->>'fire_safety',
      NEW.payload->>'servant_room',
      NEW.payload->>'shopping_center',
      NEW.payload->>'gas_pipeline',
      NEW.payload->>'park',
      NEW.payload->>'rain_water_harvesting',
      NEW.payload->>'sewage_treatment_plant',
      NEW.payload->>'house_keeping',
      NEW.payload->>'visitor_parking',
      NEW.payload->>'water_storage_facility',
      NEW.payload->>'wifi'
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      locality = EXCLUDED.locality,
      pincode = EXCLUDED.pincode,
      listing_type = COALESCE(EXCLUDED.listing_type, p.listing_type),
      property_type = COALESCE(EXCLUDED.property_type, p.property_type),
      availability_type = COALESCE(EXCLUDED.availability_type, p.availability_type),
      expected_price = COALESCE(EXCLUDED.expected_price, p.expected_price),
      super_area = COALESCE(EXCLUDED.super_area, p.super_area),
      carpet_area = COALESCE(EXCLUDED.carpet_area, p.carpet_area),
      description = COALESCE(EXCLUDED.description, p.description),
      images = COALESCE(EXCLUDED.images, p.images),
      videos = COALESCE(EXCLUDED.videos, p.videos),
      status = COALESCE(p.status, 'pending'),
      is_visible = true,
      is_featured = true,
      updated_at = now(),
      -- Owner fields
      owner_name = COALESCE(EXCLUDED.owner_name, p.owner_name),
      owner_email = COALESCE(EXCLUDED.owner_email, p.owner_email),
      owner_phone = COALESCE(EXCLUDED.owner_phone, p.owner_phone),
      owner_role = COALESCE(EXCLUDED.owner_role, p.owner_role),
      -- Property details that were missing
      bhk_type = COALESCE(EXCLUDED.bhk_type, p.bhk_type),
      bathrooms = COALESCE(EXCLUDED.bathrooms, p.bathrooms),
      balconies = COALESCE(EXCLUDED.balconies, p.balconies),
      furnishing = COALESCE(EXCLUDED.furnishing, p.furnishing),
      availability_date = COALESCE(EXCLUDED.availability_date, p.availability_date),
      -- Additional property characteristics
      property_age = COALESCE(EXCLUDED.property_age, p.property_age),
      facing_direction = COALESCE(EXCLUDED.facing_direction, p.facing_direction),
      floor_no = COALESCE(EXCLUDED.floor_no, p.floor_no),
      total_floors = COALESCE(EXCLUDED.total_floors, p.total_floors),
      -- Amenities fields
      power_backup = COALESCE(EXCLUDED.power_backup, p.power_backup),
      lift = COALESCE(EXCLUDED.lift, p.lift),
      water_supply = COALESCE(EXCLUDED.water_supply, p.water_supply),
      security = COALESCE(EXCLUDED.security, p.security),
      gym = COALESCE(EXCLUDED.gym, p.gym),
      gated_security = COALESCE(EXCLUDED.gated_security, p.gated_security),
      current_property_condition = COALESCE(EXCLUDED.current_property_condition, p.current_property_condition),
      directions_tip = COALESCE(EXCLUDED.directions_tip, p.directions_tip),
      parking = COALESCE(EXCLUDED.parking, p.parking),
      -- Additional amenities
      pet_allowed = COALESCE(EXCLUDED.pet_allowed, p.pet_allowed),
      non_veg_allowed = COALESCE(EXCLUDED.non_veg_allowed, p.non_veg_allowed),
      who_will_show = COALESCE(EXCLUDED.who_will_show, p.who_will_show),
      secondary_phone = COALESCE(EXCLUDED.secondary_phone, p.secondary_phone),
      internet_services = COALESCE(EXCLUDED.internet_services, p.internet_services),
      air_conditioner = COALESCE(EXCLUDED.air_conditioner, p.air_conditioner),
      club_house = COALESCE(EXCLUDED.club_house, p.club_house),
      intercom = COALESCE(EXCLUDED.intercom, p.intercom),
      swimming_pool = COALESCE(EXCLUDED.swimming_pool, p.swimming_pool),
      children_play_area = COALESCE(EXCLUDED.children_play_area, p.children_play_area),
      fire_safety = COALESCE(EXCLUDED.fire_safety, p.fire_safety),
      servant_room = COALESCE(EXCLUDED.servant_room, p.servant_room),
      shopping_center = COALESCE(EXCLUDED.shopping_center, p.shopping_center),
      gas_pipeline = COALESCE(EXCLUDED.gas_pipeline, p.gas_pipeline),
      park = COALESCE(EXCLUDED.park, p.park),
      rain_water_harvesting = COALESCE(EXCLUDED.rain_water_harvesting, p.rain_water_harvesting),
      sewage_treatment_plant = COALESCE(EXCLUDED.sewage_treatment_plant, p.sewage_treatment_plant),
      house_keeping = COALESCE(EXCLUDED.house_keeping, p.house_keeping),
      visitor_parking = COALESCE(EXCLUDED.visitor_parking, p.visitor_parking),
      water_storage_facility = COALESCE(EXCLUDED.water_storage_facility, p.water_storage_facility),
      wifi = COALESCE(EXCLUDED.wifi, p.wifi);

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Add missing columns to properties table if they don't exist
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS carpet_area DECIMAL,
ADD COLUMN IF NOT EXISTS property_age TEXT,
ADD COLUMN IF NOT EXISTS facing_direction TEXT,
ADD COLUMN IF NOT EXISTS power_backup TEXT,
ADD COLUMN IF NOT EXISTS lift TEXT,
ADD COLUMN IF NOT EXISTS water_supply TEXT,
ADD COLUMN IF NOT EXISTS security TEXT,
ADD COLUMN IF NOT EXISTS gym TEXT,
ADD COLUMN IF NOT EXISTS gated_security TEXT,
ADD COLUMN IF NOT EXISTS current_property_condition TEXT,
ADD COLUMN IF NOT EXISTS directions_tip TEXT,
ADD COLUMN IF NOT EXISTS parking TEXT,
ADD COLUMN IF NOT EXISTS pet_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS non_veg_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS who_will_show TEXT,
ADD COLUMN IF NOT EXISTS secondary_phone TEXT,
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
COMMENT ON COLUMN public.properties.carpet_area IS 'Carpet area of the property';
COMMENT ON COLUMN public.properties.property_age IS 'Age of the property';
COMMENT ON COLUMN public.properties.facing_direction IS 'Direction the property faces';
COMMENT ON COLUMN public.properties.power_backup IS 'Power backup availability';
COMMENT ON COLUMN public.properties.lift IS 'Lift availability';
COMMENT ON COLUMN public.properties.water_supply IS 'Water supply type';
COMMENT ON COLUMN public.properties.security IS 'Security features';
COMMENT ON COLUMN public.properties.gym IS 'Gym availability';
COMMENT ON COLUMN public.properties.gated_security IS 'Gated security';
COMMENT ON COLUMN public.properties.current_property_condition IS 'Current condition of property';
COMMENT ON COLUMN public.properties.directions_tip IS 'Directions tip';
COMMENT ON COLUMN public.properties.parking IS 'Parking availability';
COMMENT ON COLUMN public.properties.pet_allowed IS 'Whether pets are allowed';
COMMENT ON COLUMN public.properties.non_veg_allowed IS 'Whether non-vegetarian food is allowed';
COMMENT ON COLUMN public.properties.who_will_show IS 'Who will show the property';
COMMENT ON COLUMN public.properties.secondary_phone IS 'Secondary contact phone number';
COMMENT ON COLUMN public.properties.internet_services IS 'Internet services availability';
COMMENT ON COLUMN public.properties.air_conditioner IS 'Air conditioner availability';
COMMENT ON COLUMN public.properties.club_house IS 'Club house availability';
COMMENT ON COLUMN public.properties.intercom IS 'Intercom availability';
COMMENT ON COLUMN public.properties.swimming_pool IS 'Swimming pool availability';
COMMENT ON COLUMN public.properties.children_play_area IS 'Children play area availability';
COMMENT ON COLUMN public.properties.fire_safety IS 'Fire safety features';
COMMENT ON COLUMN public.properties.servant_room IS 'Servant room availability';
COMMENT ON COLUMN public.properties.shopping_center IS 'Shopping center availability';
COMMENT ON COLUMN public.properties.gas_pipeline IS 'Gas pipeline availability';
COMMENT ON COLUMN public.properties.park IS 'Park availability';
COMMENT ON COLUMN public.properties.rain_water_harvesting IS 'Rain water harvesting';
COMMENT ON COLUMN public.properties.sewage_treatment_plant IS 'Sewage treatment plant';
COMMENT ON COLUMN public.properties.house_keeping IS 'House keeping services';
COMMENT ON COLUMN public.properties.visitor_parking IS 'Visitor parking';
COMMENT ON COLUMN public.properties.water_storage_facility IS 'Water storage facility';
COMMENT ON COLUMN public.properties.wifi IS 'WiFi availability';
