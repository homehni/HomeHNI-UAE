-- Complete bi-directional sync with all required NOT NULL fields

BEGIN;

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
      expected_price, super_area, description, images, videos, status, is_visible, is_featured, created_at, updated_at
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
      'pending',
      true,
      true,
      COALESCE(NEW.created_at, now()),
      now()
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

CREATE OR REPLACE FUNCTION public.sync_submissions_with_properties()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_syncing text := current_setting('app.syncing', true);
BEGIN
  IF is_syncing = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.property_submissions AS ps (
      id, user_id, title, city, state, status, payload, created_at, updated_at
    ) VALUES (
      NEW.id,
      NEW.user_id,
      NEW.title,
      NEW.city,
      NEW.state,
      COALESCE(NEW.status, 'new'),
      jsonb_build_object('source', 'properties_mirror') || to_jsonb(NEW),
      COALESCE(NEW.created_at, now()),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      title = EXCLUDED.title,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      status = EXCLUDED.status,
      payload = EXCLUDED.payload,
      updated_at = now();

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.property_submissions WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_properties_with_submissions ON public.property_submissions;
CREATE TRIGGER trg_sync_properties_with_submissions
AFTER INSERT OR UPDATE OR DELETE ON public.property_submissions
FOR EACH ROW EXECUTE FUNCTION public.sync_properties_with_submissions();

DROP TRIGGER IF EXISTS trg_sync_submissions_with_properties ON public.properties;
CREATE TRIGGER trg_sync_submissions_with_properties
AFTER INSERT OR UPDATE OR DELETE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.sync_submissions_with_properties();

-- Backfill with all NOT NULL fields
INSERT INTO public.properties (id, user_id, title, city, state, locality, pincode, listing_type, property_type, availability_type, expected_price, super_area, status, is_visible, is_featured, created_at, updated_at)
SELECT 
  ps.id, 
  ps.user_id, 
  COALESCE(ps.title, 'Untitled Property'), 
  ps.city, 
  ps.state, 
  COALESCE(ps.payload->>'locality', 'Not Specified'),
  COALESCE(ps.payload->>'pincode', '000000'),
  COALESCE(ps.payload->>'listing_type', 'rent'),
  COALESCE(ps.payload->>'property_type', 'residential'),
  COALESCE(ps.payload->>'availability_type', 'ready_to_move'),
  COALESCE(NULLIF(ps.payload->>'expected_price','')::numeric, 0),
  COALESCE(NULLIF(ps.payload->>'super_area','')::numeric, 0),
  'pending', 
  true, 
  true, 
  COALESCE(ps.created_at, now()), 
  now()
FROM public.property_submissions ps
LEFT JOIN public.properties p ON p.id = ps.id
WHERE p.id IS NULL AND ps.user_id IS NOT NULL;

INSERT INTO public.property_submissions (id, user_id, title, city, state, status, payload, created_at, updated_at)
SELECT p.id, p.user_id, p.title, p.city, p.state, COALESCE(p.status, 'new'), to_jsonb(p), COALESCE(p.created_at, now()), now()
FROM public.properties p
LEFT JOIN public.property_submissions ps ON ps.id = p.id
WHERE ps.id IS NULL;

COMMIT;