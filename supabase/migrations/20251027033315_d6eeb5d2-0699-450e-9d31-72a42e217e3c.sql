-- Fix the sync_properties_with_submissions trigger to respect auto-approve setting
-- This trigger runs whenever a property_submission is created/updated

CREATE OR REPLACE FUNCTION public.sync_properties_with_submissions()
RETURNS TRIGGER AS $$
DECLARE
  is_syncing text := current_setting('app.syncing', true);
  img_array text[];
  vid_array text[];
  final_status text;
  auto_approve_enabled boolean := false;
BEGIN
  -- Prevent infinite loops
  IF is_syncing = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Check if auto-approve is enabled
    BEGIN
      SELECT COALESCE((value::boolean), false) INTO auto_approve_enabled
      FROM public.app_settings 
      WHERE key = 'auto_approve_properties' 
      LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      auto_approve_enabled := false;
    END;

    -- Determine final status based on auto-approve setting
    IF auto_approve_enabled AND (NEW.status = 'pending' OR NEW.status = 'new' OR NEW.status IS NULL) THEN
      final_status := 'approved';
      
      -- Also update the submission status
      UPDATE public.property_submissions
      SET status = 'approved'
      WHERE id = NEW.id AND status != 'approved';
    ELSE
      final_status := COALESCE(NEW.status, 'pending');
    END IF;

    -- Convert images array
    IF (NEW.payload ? 'images') THEN
      img_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'images'));
    END IF;
    
    -- Convert videos array
    IF (NEW.payload ? 'videos') THEN
      vid_array := ARRAY(SELECT value::text FROM jsonb_array_elements_text(NEW.payload->'videos'));
    END IF;

    -- Insert or update in properties table
    INSERT INTO public.properties AS p (
      id, user_id, title, city, state, locality, pincode, listing_type, property_type, 
      availability_type, expected_price, super_area, description, images, videos, 
      status, is_visible, is_featured, created_at, updated_at,
      owner_name, owner_email, owner_phone, owner_role
    ) VALUES (
      NEW.id,
      COALESCE(NEW.user_id, '00000000-0000-0000-0000-000000000000'::uuid),
      COALESCE(NEW.title, 'Untitled Property'),
      NEW.city,
      NEW.state,
      COALESCE(NEW.payload->>'locality', ''),
      COALESCE(NEW.payload->>'pincode', ''),
      COALESCE(NEW.payload->>'listing_type', 'sale'),
      COALESCE(NEW.payload->>'property_type', 'residential'),
      COALESCE(NEW.payload->>'availability_type', 'ready_to_move'),
      COALESCE((NEW.payload->>'expected_price')::numeric, 0),
      COALESCE((NEW.payload->>'super_area')::numeric, 0),
      COALESCE(NEW.payload->>'description', ''),
      img_array,
      vid_array,
      final_status,  -- Use the determined final_status
      true,
      false,
      COALESCE(NEW.created_at, now()),
      now(),
      COALESCE(NEW.payload->>'owner_name', ''),
      COALESCE(NEW.payload->>'owner_email', ''),
      COALESCE(NEW.payload->>'owner_phone', ''),
      COALESCE(NEW.payload->>'owner_role', '')
    )
    ON CONFLICT (id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
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
      description = EXCLUDED.description,
      images = EXCLUDED.images,
      videos = EXCLUDED.videos,
      status = EXCLUDED.status,  -- This will use final_status
      updated_at = now(),
      owner_name = EXCLUDED.owner_name,
      owner_email = EXCLUDED.owner_email,
      owner_phone = EXCLUDED.owner_phone,
      owner_role = EXCLUDED.owner_role;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;