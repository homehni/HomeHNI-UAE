-- Update the property sync trigger to include Land/Plot infrastructure fields
-- This ensures that when property_submissions are synced to properties table,
-- all the infrastructure details are properly transferred

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
      on_main_road, corner_property, categorized_images
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
      NEW.payload->>'wifi',
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
      NEW.payload->'categorized_images'
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
      wifi = COALESCE(EXCLUDED.wifi, p.wifi),
      -- Land/Plot infrastructure fields
      electricity_connection = COALESCE(EXCLUDED.electricity_connection, p.electricity_connection),
      sewage_connection = COALESCE(EXCLUDED.sewage_connection, p.sewage_connection),
      ownership_type = COALESCE(EXCLUDED.ownership_type, p.ownership_type),
      approved_by = COALESCE(EXCLUDED.approved_by, p.approved_by),
      -- Land/Plot specific fields
      plot_area = COALESCE(EXCLUDED.plot_area, p.plot_area),
      plot_area_unit = COALESCE(EXCLUDED.plot_area_unit, p.plot_area_unit),
      plot_length = COALESCE(EXCLUDED.plot_length, p.plot_length),
      plot_width = COALESCE(EXCLUDED.plot_width, p.plot_width),
      boundary_wall = COALESCE(EXCLUDED.boundary_wall, p.boundary_wall),
      corner_plot = COALESCE(EXCLUDED.corner_plot, p.corner_plot),
      road_facing = COALESCE(EXCLUDED.road_facing, p.road_facing),
      road_width = COALESCE(EXCLUDED.road_width, p.road_width),
      land_type = COALESCE(EXCLUDED.land_type, p.land_type),
      plot_shape = COALESCE(EXCLUDED.plot_shape, p.plot_shape),
      gated_community = COALESCE(EXCLUDED.gated_community, p.gated_community),
      gated_project = COALESCE(EXCLUDED.gated_project, p.gated_project),
      floors_allowed = COALESCE(EXCLUDED.floors_allowed, p.floors_allowed),
      survey_number = COALESCE(EXCLUDED.survey_number, p.survey_number),
      sub_division = COALESCE(EXCLUDED.sub_division, p.sub_division),
      village_name = COALESCE(EXCLUDED.village_name, p.village_name),
      price_negotiable = COALESCE(EXCLUDED.price_negotiable, p.price_negotiable),
      possession_date = COALESCE(EXCLUDED.possession_date, p.possession_date),
      -- Commercial fields
      space_type = COALESCE(EXCLUDED.space_type, p.space_type),
      building_type = COALESCE(EXCLUDED.building_type, p.building_type),
      furnishing_status = COALESCE(EXCLUDED.furnishing_status, p.furnishing_status),
      super_built_up_area = COALESCE(EXCLUDED.super_built_up_area, p.super_built_up_area),
      power_load = COALESCE(EXCLUDED.power_load, p.power_load),
      ceiling_height = COALESCE(EXCLUDED.ceiling_height, p.ceiling_height),
      entrance_width = COALESCE(EXCLUDED.entrance_width, p.entrance_width),
      loading_facility = COALESCE(EXCLUDED.loading_facility, p.loading_facility),
      on_main_road = COALESCE(EXCLUDED.on_main_road, p.on_main_road),
      corner_property = COALESCE(EXCLUDED.corner_property, p.corner_property),
      categorized_images = COALESCE(EXCLUDED.categorized_images, p.categorized_images);

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;
