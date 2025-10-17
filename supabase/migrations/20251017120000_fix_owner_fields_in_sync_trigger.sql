-- Fix owner fields in sync_properties_with_submissions trigger
-- This ensures owner information is preserved when properties are synced

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
BEGIN
  IF is_syncing = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF (NEW.payload ? 'images') THEN
      img_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'images'));
    END IF;
    IF (NEW.payload ? 'videos') THEN
      vid_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'videos'));
    END IF;

    INSERT INTO public.properties AS p (
      id, user_id, title, city, state, locality, pincode, listing_type, property_type, availability_type, 
      expected_price, super_area, description, images, videos, status, is_visible, is_featured, created_at, updated_at,
      -- Owner fields
      owner_name, owner_email, owner_phone, owner_role
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
      NEW.payload->>'description',
      img_array,
      vid_array,
      NEW.status,
      true,
      true,
      COALESCE(NEW.created_at, now()),
      now(),
      -- Owner fields from payload
      NEW.payload->>'owner_name',
      NEW.payload->>'owner_email',
      NEW.payload->>'owner_phone',
      NEW.payload->>'owner_role'
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
      description = COALESCE(EXCLUDED.description, p.description),
      images = COALESCE(EXCLUDED.images, p.images),
      videos = COALESCE(EXCLUDED.videos, p.videos),
      status = NEW.status,
      is_visible = true,
      is_featured = true,
      updated_at = now(),
      -- Preserve owner fields (only update if new values exist)
      owner_name = COALESCE(EXCLUDED.owner_name, p.owner_name),
      owner_email = COALESCE(EXCLUDED.owner_email, p.owner_email),
      owner_phone = COALESCE(EXCLUDED.owner_phone, p.owner_phone),
      owner_role = COALESCE(EXCLUDED.owner_role, p.owner_role);

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;
