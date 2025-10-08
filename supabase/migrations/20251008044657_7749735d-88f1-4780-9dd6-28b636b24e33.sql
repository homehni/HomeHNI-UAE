-- Fix: Extract all necessary fields from payload - using only existing columns

CREATE OR REPLACE FUNCTION public.sync_properties_with_submissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_syncing text := current_setting('app.syncing', true);
  img_array text[];
  vid_array text[];
  extracted_amenities jsonb;
  extracted_docs jsonb;
BEGIN
  IF is_syncing = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Extract images and videos
    IF (NEW.payload ? 'images') THEN
      img_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'images'));
    END IF;
    IF (NEW.payload ? 'videos') THEN
      vid_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'videos'));
    END IF;

    -- Extract amenities from originalFormData if available, ensuring parking is included
    extracted_amenities := COALESCE(
      NEW.payload->'originalFormData'->'propertyInfo'->'amenities',
      NEW.payload->'amenities',
      '{}'::jsonb
    );
    
    -- Ensure parking is in amenities if available
    IF (NEW.payload ? 'parking') AND (NEW.payload->>'parking' IS NOT NULL) THEN
      extracted_amenities := extracted_amenities || jsonb_build_object('parking', NEW.payload->>'parking');
    END IF;

    -- Extract additional documents
    extracted_docs := COALESCE(
      NEW.payload->'additional_documents',
      '{}'::jsonb
    );

    INSERT INTO public.properties AS p (
      id, user_id, title, city, state, locality, pincode, street_address, landmarks,
      listing_type, property_type, bhk_type, availability_type, expected_price, 
      super_area, carpet_area, bathrooms, balconies, floor_no, total_floors,
      furnishing, property_age, facing_direction, floor_type,
      water_supply, power_backup, gated_security, current_property_condition,
      security_deposit, maintenance_charges, price_negotiable,
      description, images, videos, amenities, additional_documents,
      status, is_visible, is_featured, plot_area_unit,
      created_at, updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.user_id, auth.uid()),
      COALESCE(NEW.title, 'Untitled Property'),
      NEW.city,
      NEW.state,
      COALESCE(NEW.payload->>'locality', 'Not Specified'),
      COALESCE(NEW.payload->>'pincode', '000000'),
      NEW.payload->>'street_address',
      NEW.payload->>'landmarks',
      COALESCE(NEW.payload->>'listing_type', 'rent'),
      COALESCE(NEW.payload->>'property_type', 'residential'),
      NEW.payload->>'bhk_type',
      COALESCE(NEW.payload->>'availability_type', 'ready_to_move'),
      COALESCE(NULLIF(NEW.payload->>'expected_price','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'super_area','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'carpet_area','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'bathrooms','')::integer, 0),
      COALESCE(NULLIF(NEW.payload->>'balconies','')::integer, 0),
      COALESCE(NULLIF(NEW.payload->>'floor_no','')::integer, NULL),
      COALESCE(NULLIF(NEW.payload->>'total_floors','')::integer, NULL),
      NEW.payload->>'furnishing',
      COALESCE(
        NEW.payload->>'property_age',
        NEW.payload->>'age_of_building',
        NEW.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'propertyAge'
      ),
      COALESCE(
        NEW.payload->>'facing_direction',
        NEW.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'facing'
      ),
      COALESCE(
        NEW.payload->>'floor_type',
        NEW.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'floorType'
      ),
      COALESCE(
        NEW.payload->>'water_supply',
        NEW.payload->'originalFormData'->'propertyInfo'->'amenities'->>'waterSupply'
      ),
      COALESCE(
        NEW.payload->>'power_backup',
        NEW.payload->'originalFormData'->'propertyInfo'->'amenities'->>'powerBackup'
      ),
      COALESCE(
        (NEW.payload->>'gated_security')::boolean,
        (NEW.payload->'originalFormData'->'propertyInfo'->'amenities'->>'gatedSecurity')::boolean,
        false
      ),
      COALESCE(
        NEW.payload->>'current_property_condition',
        NEW.payload->'originalFormData'->'propertyInfo'->'amenities'->>'currentPropertyCondition'
      ),
      COALESCE(NULLIF(NEW.payload->>'security_deposit','')::numeric, 0),
      COALESCE(NULLIF(NEW.payload->>'maintenance_charges','')::numeric, 0),
      COALESCE((NEW.payload->>'price_negotiable')::boolean, true),
      NEW.payload->>'description',
      img_array,
      vid_array,
      extracted_amenities,
      extracted_docs,
      'pending',
      true,
      true,
      NEW.payload->>'plot_area_unit',
      COALESCE(NEW.created_at, now()),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      locality = EXCLUDED.locality,
      pincode = EXCLUDED.pincode,
      street_address = COALESCE(EXCLUDED.street_address, p.street_address),
      landmarks = COALESCE(EXCLUDED.landmarks, p.landmarks),
      listing_type = COALESCE(EXCLUDED.listing_type, p.listing_type),
      property_type = COALESCE(EXCLUDED.property_type, p.property_type),
      bhk_type = COALESCE(EXCLUDED.bhk_type, p.bhk_type),
      availability_type = COALESCE(EXCLUDED.availability_type, p.availability_type),
      expected_price = COALESCE(EXCLUDED.expected_price, p.expected_price),
      super_area = COALESCE(EXCLUDED.super_area, p.super_area),
      carpet_area = COALESCE(EXCLUDED.carpet_area, p.carpet_area),
      bathrooms = COALESCE(EXCLUDED.bathrooms, p.bathrooms),
      balconies = COALESCE(EXCLUDED.balconies, p.balconies),
      floor_no = COALESCE(EXCLUDED.floor_no, p.floor_no),
      total_floors = COALESCE(EXCLUDED.total_floors, p.total_floors),
      furnishing = COALESCE(EXCLUDED.furnishing, p.furnishing),
      property_age = COALESCE(EXCLUDED.property_age, p.property_age),
      facing_direction = COALESCE(EXCLUDED.facing_direction, p.facing_direction),
      floor_type = COALESCE(EXCLUDED.floor_type, p.floor_type),
      water_supply = COALESCE(EXCLUDED.water_supply, p.water_supply),
      power_backup = COALESCE(EXCLUDED.power_backup, p.power_backup),
      gated_security = COALESCE(EXCLUDED.gated_security, p.gated_security),
      current_property_condition = COALESCE(EXCLUDED.current_property_condition, p.current_property_condition),
      security_deposit = COALESCE(EXCLUDED.security_deposit, p.security_deposit),
      maintenance_charges = COALESCE(EXCLUDED.maintenance_charges, p.maintenance_charges),
      price_negotiable = COALESCE(EXCLUDED.price_negotiable, p.price_negotiable),
      description = COALESCE(EXCLUDED.description, p.description),
      images = COALESCE(EXCLUDED.images, p.images),
      videos = COALESCE(EXCLUDED.videos, p.videos),
      amenities = COALESCE(EXCLUDED.amenities, p.amenities),
      additional_documents = COALESCE(EXCLUDED.additional_documents, p.additional_documents),
      plot_area_unit = COALESCE(EXCLUDED.plot_area_unit, p.plot_area_unit),
      status = COALESCE(p.status, 'pending'),
      is_visible = true,
      is_featured = true,
      updated_at = now();

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Update existing properties to sync data from their submissions
UPDATE public.properties p
SET 
  bhk_type = COALESCE(p.bhk_type, ps.payload->>'bhk_type'),
  bathrooms = COALESCE(NULLIF(p.bathrooms, 0), (ps.payload->>'bathrooms')::integer),
  balconies = COALESCE(NULLIF(p.balconies, 0), (ps.payload->>'balconies')::integer),
  property_age = COALESCE(
    p.property_age, 
    ps.payload->>'property_age',
    ps.payload->>'age_of_building',
    ps.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'propertyAge'
  ),
  water_supply = COALESCE(
    p.water_supply,
    ps.payload->>'water_supply',
    ps.payload->'originalFormData'->'propertyInfo'->'amenities'->>'waterSupply'
  ),
  power_backup = COALESCE(
    p.power_backup,
    ps.payload->>'power_backup',
    ps.payload->'originalFormData'->'propertyInfo'->'amenities'->>'powerBackup'
  ),
  gated_security = COALESCE(
    p.gated_security,
    (ps.payload->>'gated_security')::boolean,
    (ps.payload->'originalFormData'->'propertyInfo'->'amenities'->>'gatedSecurity')::boolean
  ),
  furnishing = COALESCE(p.furnishing, ps.payload->>'furnishing'),
  facing_direction = COALESCE(
    p.facing_direction,
    ps.payload->>'facing_direction',
    ps.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'facing'
  ),
  floor_type = COALESCE(
    p.floor_type,
    ps.payload->>'floor_type',
    ps.payload->'originalFormData'->'propertyInfo'->'propertyDetails'->>'floorType'
  ),
  current_property_condition = COALESCE(
    p.current_property_condition,
    ps.payload->>'current_property_condition',
    ps.payload->'originalFormData'->'propertyInfo'->'amenities'->>'currentPropertyCondition'
  ),
  amenities = CASE 
    WHEN p.amenities IS NULL OR p.amenities = '{}'::jsonb THEN
      -- Merge amenities from multiple sources
      COALESCE(
        ps.payload->'originalFormData'->'propertyInfo'->'amenities',
        ps.payload->'amenities',
        '{}'::jsonb
      ) || CASE 
        WHEN ps.payload->>'parking' IS NOT NULL 
        THEN jsonb_build_object('parking', ps.payload->>'parking')
        ELSE '{}'::jsonb
      END
    ELSE p.amenities
  END,
  floor_no = COALESCE(p.floor_no, (ps.payload->>'floor_no')::integer),
  total_floors = COALESCE(p.total_floors, (ps.payload->>'total_floors')::integer),
  carpet_area = COALESCE(p.carpet_area, (ps.payload->>'carpet_area')::numeric),
  street_address = COALESCE(p.street_address, ps.payload->>'street_address'),
  landmarks = COALESCE(p.landmarks, ps.payload->>'landmarks'),
  security_deposit = COALESCE(NULLIF(p.security_deposit, 0), (ps.payload->>'security_deposit')::numeric),
  maintenance_charges = COALESCE(NULLIF(p.maintenance_charges, 0), (ps.payload->>'maintenance_charges')::numeric),
  plot_area_unit = COALESCE(p.plot_area_unit, ps.payload->>'plot_area_unit'),
  additional_documents = COALESCE(p.additional_documents, ps.payload->'additional_documents', '{}'::jsonb)
FROM public.property_submissions ps
WHERE p.id = ps.id;