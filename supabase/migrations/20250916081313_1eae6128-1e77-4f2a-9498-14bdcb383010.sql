-- Align function parameter name with frontend call and keep VOLATILE
-- Drop existing version (any uuid signature)
DROP FUNCTION IF EXISTS public.toggle_property_favorite(uuid);

-- Recreate with parameter name exactly 'property_id' to match Supabase RPC payload
CREATE OR REPLACE FUNCTION public.toggle_property_favorite(property_id uuid)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SET search_path = 'public'
AS $$
DECLARE
  v_exists boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if favorite already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites
    WHERE user_id = auth.uid() AND property_id = toggle_property_favorite.property_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.user_favorites
    WHERE user_id = auth.uid() AND property_id = toggle_property_favorite.property_id;
    RETURN false;
  ELSE
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (auth.uid(), toggle_property_favorite.property_id);
    RETURN true;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.toggle_property_favorite(uuid) IS 'Toggle favorite for the authenticated user. Returns true if added, false if removed.';