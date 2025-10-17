  -- ========================================
  -- FIX AUTO-APPROVE PROPERTIES
  -- ========================================
  -- This fixes the database trigger so that when "Auto-approve Properties" 
  -- is enabled in admin settings, new properties are automatically approved.
  --
  -- Current Bug:
  -- - The trigger hardcodes status = 'pending' instead of using the submission's status
  -- - Even if PostProperty.tsx sets status = 'approved', the trigger ignores it
  --
  -- Run this SQL in Supabase SQL Editor to fix it.
  -- ========================================

  BEGIN;

  -- Drop and recreate the sync function with proper status handling
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
        COALESCE(NEW.status, 'pending'),  -- ✅ FIXED: Use submission's status instead of hardcoded 'pending'
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
        status = COALESCE(EXCLUDED.status, p.status, 'pending'),  -- ✅ FIXED: Respect the new status from submission
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

  COMMIT;

  -- ========================================
  -- NOW APPROVE EXISTING PENDING PROPERTIES
  -- ========================================
  -- This will approve all the properties that are currently stuck in "pending" status

  UPDATE public.properties
  SET status = 'approved', updated_at = now()
  WHERE status = 'pending' OR status = 'new';

  UPDATE public.property_submissions
  SET status = 'approved', updated_at = now()
  WHERE status = 'pending' OR status = 'new';

  -- ========================================
  -- VERIFICATION QUERIES
  -- ========================================

  -- Check how many properties were approved
  SELECT 
    status,
    COUNT(*) as count
  FROM public.properties
  GROUP BY status;

  -- Check if any submissions are still pending
  SELECT 
    status,
    COUNT(*) as count
  FROM public.property_submissions
  GROUP BY status;

  -- ========================================
  -- SUCCESS MESSAGE
  -- ========================================
  /*
  ✅ What was fixed:

  1. TRIGGER FIX:
    - Changed line 49 from hardcoded 'pending' to COALESCE(NEW.status, 'pending')
    - Changed line 69 to respect the submission's status on updates
    
  2. EXISTING PROPERTIES:
    - Updated all pending/new properties to 'approved'
    - Updated all pending/new submissions to 'approved'

  NOW:
  - Auto-approve setting will work correctly for NEW properties
  - All EXISTING properties are approved
  - "Owners You Contacted" tab will show contacted properties

  NEXT STEPS:
  1. Go to your app and hard refresh (Ctrl+Shift+R)
  2. Go to /dashboard?tab=interested
  3. You should now see all the properties you contacted!
  4. Try posting a new property - it should be auto-approved immediately

  */

