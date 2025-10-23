-- Fix boolean cast errors in the sync trigger
-- This migration fixes fields that were incorrectly being cast to boolean when they should be strings

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS sync_properties_with_submissions ON public.property_submissions;

-- Recreate the trigger function with correct data types
CREATE OR REPLACE FUNCTION sync_properties_with_submissions()
RETURNS TRIGGER AS $$
DECLARE
  img_array text[];
  vid_array text[];
  final_status text;
BEGIN
  -- Convert images array
  IF NEW.payload->'images' IS NOT NULL THEN
    SELECT ARRAY(
      SELECT jsonb_array_elements_text(NEW.payload->'images')
    ) INTO img_array;
  ELSE
    img_array := ARRAY[]::text[];
  END IF;

  -- Convert videos array
  IF NEW.payload->'videos' IS NOT NULL THEN
    SELECT ARRAY(
      SELECT jsonb_array_elements_text(NEW.payload->'videos')
    ) INTO vid_array;
  ELSE
    vid_array := ARRAY[]::text[];
  END IF;

  -- Determine final status
  final_status := CASE 
    WHEN NEW.status = 'approved' THEN 'active'
    WHEN NEW.status = 'rejected' THEN 'inactive'
    ELSE 'pending'
  END;

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
    water_storage_facility, wifi,
    -- Land/Plot infrastructure fields
    electricity_connection, sewage_connection, ownership_type, approved_by,
    -- Land/Plot specific fields
    plot_area, plot_area_unit, plot_length, plot_width, boundary_wall,
    corner_plot, road_facing, road_width, land_type, plot_shape,
    gated_community, gated_project, floors_allowed, survey_number,
    sub_division, village_name, price_negotiable, possession_date,
    -- Commercial fields
    space_type, building_type, furnishing_status, super_built_up_area,
    power_load, ceiling_height, entrance_width, loading_facility,
    on_main_road, corner_property, categorized_images,
    -- PG/Hostel services
    available_services,
    -- Additional info for flexible data storage
    additional_info,
    -- MISSING FIELD: security_deposit
    security_deposit
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
    -- Amenities fields - FIXED: These should be strings, not booleans
    NEW.payload->>'power_backup',
    NEW.payload->>'lift',
    NEW.payload->>'water_supply',
    NEW.payload->>'security',
    NEW.payload->>'gym',
    COALESCE((NEW.payload->>'gated_security')::boolean, false),
    NEW.payload->>'current_property_condition',
    NEW.payload->>'directions_tip',
    NEW.payload->>'parking',
    -- Additional amenities from property_drafts
    COALESCE((NEW.payload->>'pet_allowed')::boolean, false),
    COALESCE((NEW.payload->>'non_veg_allowed')::boolean, false),
    NEW.payload->>'who_will_show',
    NEW.payload->>'secondary_phone',
    COALESCE((NEW.payload->>'internet_services')::boolean, false),
    COALESCE((NEW.payload->>'air_conditioner')::boolean, false),
    COALESCE((NEW.payload->>'club_house')::boolean, false),
    COALESCE((NEW.payload->>'intercom')::boolean, false),
    COALESCE((NEW.payload->>'swimming_pool')::boolean, false),
    COALESCE((NEW.payload->>'children_play_area')::boolean, false),
    COALESCE((NEW.payload->>'fire_safety')::boolean, false),
    COALESCE((NEW.payload->>'servant_room')::boolean, false),
    COALESCE((NEW.payload->>'shopping_center')::boolean, false),
    COALESCE((NEW.payload->>'gas_pipeline')::boolean, false),
    COALESCE((NEW.payload->>'park')::boolean, false),
    COALESCE((NEW.payload->>'rain_water_harvesting')::boolean, false),
    COALESCE((NEW.payload->>'sewage_treatment_plant')::boolean, false),
    COALESCE((NEW.payload->>'house_keeping')::boolean, false),
    COALESCE((NEW.payload->>'visitor_parking')::boolean, false),
    NEW.payload->>'water_storage_facility',  -- FIXED: Should be string, not boolean
    COALESCE((NEW.payload->>'wifi')::boolean, false),
    -- Land/Plot infrastructure fields
    NEW.payload->>'electricity_connection',
    NEW.payload->>'sewage_connection',
    NEW.payload->>'ownership_type',
    NEW.payload->>'approved_by',
    -- Land/Plot specific fields
    COALESCE(NULLIF(NEW.payload->>'plot_area','')::integer, 0),
    NEW.payload->>'plot_area_unit',
    COALESCE(NULLIF(NEW.payload->>'plot_length','')::integer, 0),
    COALESCE(NULLIF(NEW.payload->>'plot_width','')::integer, 0),
    NEW.payload->>'boundary_wall',
    COALESCE((NEW.payload->>'corner_plot')::boolean, false),
    NEW.payload->>'road_facing',
    COALESCE(NULLIF(NEW.payload->>'road_width','')::integer, 0),
    NEW.payload->>'land_type',
    NEW.payload->>'plot_shape',
    COALESCE((NEW.payload->>'gated_community')::boolean, false),
    NEW.payload->>'gated_project',
    COALESCE(NULLIF(NEW.payload->>'floors_allowed','')::integer, 0),
    NEW.payload->>'survey_number',
    NEW.payload->>'sub_division',
    NEW.payload->>'village_name',
    COALESCE((NEW.payload->>'price_negotiable')::boolean, false),
    CASE 
      WHEN NEW.payload->>'possession_date' IS NOT NULL 
      THEN (NEW.payload->>'possession_date')::date
      ELSE NULL
    END,
    -- Commercial fields
    NEW.payload->>'space_type',
    NEW.payload->>'building_type',
    NEW.payload->>'furnishing_status',
    COALESCE(NULLIF(NEW.payload->>'super_built_up_area','')::integer, 0),
    NEW.payload->>'power_load',
    NEW.payload->>'ceiling_height',
    NEW.payload->>'entrance_width',
    COALESCE((NEW.payload->>'loading_facility')::boolean, false),
    COALESCE((NEW.payload->>'on_main_road')::boolean, false),
    COALESCE((NEW.payload->>'corner_property')::boolean, false),
    NEW.payload->'categorized_images',
    -- PG/Hostel services
    NEW.payload->'available_services',
    -- Additional info for flexible data storage
    NEW.payload->'additional_info',
    -- MISSING FIELD: security_deposit - now included!
    COALESCE(NULLIF(NEW.payload->>'security_deposit','')::numeric, 0)
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    locality = EXCLUDED.locality,
    pincode = EXCLUDED.pincode,
    listing_type = EXCLUDED.listing_type,
    property_type = EXCLUDED.property_type,
    availability_type = EXCLUDED.availability_type,
    expected_price = EXCLUDED.expected_price,
    super_area = EXCLUDED.super_area,
    carpet_area = EXCLUDED.carpet_area,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    videos = EXCLUDED.videos,
    status = EXCLUDED.status,
    updated_at = now(),
    -- Owner fields
    owner_name = EXCLUDED.owner_name,
    owner_email = EXCLUDED.owner_email,
    owner_phone = EXCLUDED.owner_phone,
    owner_role = EXCLUDED.owner_role,
    -- Property details
    bhk_type = EXCLUDED.bhk_type,
    bathrooms = EXCLUDED.bathrooms,
    balconies = EXCLUDED.balconies,
    furnishing = EXCLUDED.furnishing,
    availability_date = EXCLUDED.availability_date,
    -- Additional property characteristics
    property_age = EXCLUDED.property_age,
    facing_direction = EXCLUDED.facing_direction,
    floor_no = EXCLUDED.floor_no,
    total_floors = EXCLUDED.total_floors,
    -- Amenities fields
    power_backup = EXCLUDED.power_backup,
    lift = EXCLUDED.lift,
    water_supply = EXCLUDED.water_supply,
    security = EXCLUDED.security,
    gym = EXCLUDED.gym,
    gated_security = EXCLUDED.gated_security,
    current_property_condition = EXCLUDED.current_property_condition,
    directions_tip = EXCLUDED.directions_tip,
    parking = EXCLUDED.parking,
    -- Additional amenities
    pet_allowed = EXCLUDED.pet_allowed,
    non_veg_allowed = EXCLUDED.non_veg_allowed,
    who_will_show = EXCLUDED.who_will_show,
    secondary_phone = EXCLUDED.secondary_phone,
    internet_services = EXCLUDED.internet_services,
    air_conditioner = EXCLUDED.air_conditioner,
    club_house = EXCLUDED.club_house,
    intercom = EXCLUDED.intercom,
    swimming_pool = EXCLUDED.swimming_pool,
    children_play_area = EXCLUDED.children_play_area,
    fire_safety = EXCLUDED.fire_safety,
    servant_room = EXCLUDED.servant_room,
    shopping_center = EXCLUDED.shopping_center,
    gas_pipeline = EXCLUDED.gas_pipeline,
    park = EXCLUDED.park,
    rain_water_harvesting = EXCLUDED.rain_water_harvesting,
    sewage_treatment_plant = EXCLUDED.sewage_treatment_plant,
    house_keeping = EXCLUDED.house_keeping,
    visitor_parking = EXCLUDED.visitor_parking,
    water_storage_facility = EXCLUDED.water_storage_facility,
    wifi = EXCLUDED.wifi,
    -- Land/Plot infrastructure fields
    electricity_connection = EXCLUDED.electricity_connection,
    sewage_connection = EXCLUDED.sewage_connection,
    ownership_type = EXCLUDED.ownership_type,
    approved_by = EXCLUDED.approved_by,
    -- Land/Plot specific fields
    plot_area = EXCLUDED.plot_area,
    plot_area_unit = EXCLUDED.plot_area_unit,
    plot_length = EXCLUDED.plot_length,
    plot_width = EXCLUDED.plot_width,
    boundary_wall = EXCLUDED.boundary_wall,
    corner_plot = EXCLUDED.corner_plot,
    road_facing = EXCLUDED.road_facing,
    road_width = EXCLUDED.road_width,
    land_type = EXCLUDED.land_type,
    plot_shape = EXCLUDED.plot_shape,
    gated_community = EXCLUDED.gated_community,
    gated_project = EXCLUDED.gated_project,
    floors_allowed = EXCLUDED.floors_allowed,
    survey_number = EXCLUDED.survey_number,
    sub_division = EXCLUDED.sub_division,
    village_name = EXCLUDED.village_name,
    price_negotiable = EXCLUDED.price_negotiable,
    possession_date = EXCLUDED.possession_date,
    -- Commercial fields
    space_type = EXCLUDED.space_type,
    building_type = EXCLUDED.building_type,
    furnishing_status = EXCLUDED.furnishing_status,
    super_built_up_area = EXCLUDED.super_built_up_area,
    power_load = EXCLUDED.power_load,
    ceiling_height = EXCLUDED.ceiling_height,
    entrance_width = EXCLUDED.entrance_width,
    loading_facility = EXCLUDED.loading_facility,
    on_main_road = EXCLUDED.on_main_road,
    corner_property = EXCLUDED.corner_property,
    categorized_images = EXCLUDED.categorized_images,
    -- PG/Hostel services
    available_services = EXCLUDED.available_services,
    -- Additional info
    additional_info = EXCLUDED.additional_info,
    -- MISSING FIELD: security_deposit - now included in update too!
    security_deposit = EXCLUDED.security_deposit;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER sync_properties_with_submissions
  AFTER INSERT OR UPDATE ON public.property_submissions
  FOR EACH ROW
  EXECUTE FUNCTION sync_properties_with_submissions();

-- Add comment explaining the fix
COMMENT ON FUNCTION sync_properties_with_submissions() IS 'Fixed trigger function with correct data types - water_storage_facility, security, parking, power_backup, lift are strings, not booleans';
