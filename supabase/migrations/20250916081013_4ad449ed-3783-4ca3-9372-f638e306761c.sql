-- First drop the existing function with the old parameter name
DROP FUNCTION IF EXISTS public.toggle_property_favorite(uuid);

-- Create the corrected function with VOLATILE modifier to allow INSERT/DELETE operations
CREATE OR REPLACE FUNCTION public.toggle_property_favorite(p_property_id uuid)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  v_exists boolean;
BEGIN
  -- Ensure the user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if favorite already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites
    WHERE user_id = auth.uid() AND property_id = p_property_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Remove existing favorite
    DELETE FROM public.user_favorites
    WHERE user_id = auth.uid() AND property_id = p_property_id;
    RETURN false; -- Now not favorited
  ELSE
    -- Add new favorite
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (auth.uid(), p_property_id);
    RETURN true; -- Now favorited
  END IF;
END;
$$;

COMMENT ON FUNCTION public.toggle_property_favorite(uuid) IS 'Toggles a property in the authenticated user''s favorites. Returns true if added, false if removed.';