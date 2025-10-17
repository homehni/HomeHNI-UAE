-- Create app_settings table and apply comprehensive auto-approve fix

-- Step 1: Create app_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for app_settings (admin only)
CREATE POLICY "Admins can manage app settings" 
ON public.app_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN (
      'admin@homeni.com', 
      'ronit@homeni.com',
      'ronit@outlook.com'
    )
  )
);

-- Step 4: Ensure auto-approve setting exists and is enabled
INSERT INTO public.app_settings (key, value, description, created_at, updated_at)
VALUES ('auto_approve_properties', 'true', 'Automatically approve new property submissions', now(), now())
ON CONFLICT (key) DO UPDATE SET 
  value = 'true',
  updated_at = now();

-- Step 5: Update the trigger with better error handling
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
  final_status text;
  auto_approve_setting boolean := false;
BEGIN
  IF is_syncing = 'true' THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  PERFORM set_config('app.syncing', 'true', true);

  -- Check auto-approve setting with better error handling
  BEGIN
    SELECT COALESCE((value::boolean), false) INTO auto_approve_setting
    FROM public.app_settings 
    WHERE key = 'auto_approve_properties' 
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    -- If setting doesn't exist or error, default to false
    auto_approve_setting := false;
  END;

  -- Determine final status based on auto-approve setting
  IF auto_approve_setting AND (NEW.status = 'pending' OR NEW.status = 'new') THEN
    final_status := 'approved';
  ELSE
    final_status := NEW.status;
  END IF;

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
      final_status, -- Use the determined final status
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
      status = final_status, -- Use the determined final status
      is_visible = true,
      is_featured = true,
      updated_at = now(),
      -- Preserve owner fields (only update if new values exist)
      owner_name = COALESCE(EXCLUDED.owner_name, p.owner_name),
      owner_email = COALESCE(EXCLUDED.owner_email, p.owner_email),
      owner_phone = COALESCE(EXCLUDED.owner_phone, p.owner_phone),
      owner_role = COALESCE(EXCLUDED.owner_role, p.owner_role);

    -- Also update the submission status to match
    IF final_status != NEW.status THEN
      UPDATE public.property_submissions 
      SET status = final_status, updated_at = now()
      WHERE id = NEW.id;
    END IF;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.properties WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Step 6: Update all existing pending/new properties to approved
UPDATE public.properties
SET status = 'approved', updated_at = now()
WHERE status = 'pending' OR status = 'new';

-- Step 7: Update corresponding submissions to match
UPDATE public.property_submissions
SET status = 'approved', updated_at = now()
WHERE status = 'pending' OR status = 'new';

-- Step 8: Create a function to manually trigger auto-approve for existing properties
CREATE OR REPLACE FUNCTION public.auto_approve_pending_properties()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  auto_approve_setting boolean := false;
  updated_count integer := 0;
BEGIN
  -- Check auto-approve setting
  BEGIN
    SELECT COALESCE((value::boolean), false) INTO auto_approve_setting
    FROM public.app_settings 
    WHERE key = 'auto_approve_properties' 
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    auto_approve_setting := false;
  END;

  -- Only proceed if auto-approve is enabled
  IF auto_approve_setting THEN
    -- Update properties table
    UPDATE public.properties
    SET status = 'approved', updated_at = now()
    WHERE status = 'pending' OR status = 'new';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Update submissions table
    UPDATE public.property_submissions
    SET status = 'approved', updated_at = now()
    WHERE status = 'pending' OR status = 'new';
    
    RAISE NOTICE 'Auto-approved % properties', updated_count;
  ELSE
    RAISE NOTICE 'Auto-approve is disabled, no properties updated';
  END IF;

  RETURN updated_count;
END;
$$;
