-- Fix the ambiguous column reference in the toggle function
CREATE OR REPLACE FUNCTION public.toggle_property_favorite(property_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid UUID := auth.uid();
  favorite_exists BOOLEAN;
BEGIN
  -- Check if user is authenticated
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Check if favorite already exists (fix ambiguous reference)
  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites 
    WHERE user_favorites.user_id = user_uuid 
    AND user_favorites.property_id = toggle_property_favorite.property_id
  ) INTO favorite_exists;
  
  IF favorite_exists THEN
    -- Remove from favorites
    DELETE FROM public.user_favorites 
    WHERE user_favorites.user_id = user_uuid 
    AND user_favorites.property_id = toggle_property_favorite.property_id;
    RETURN FALSE;
  ELSE
    -- Add to favorites
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (user_uuid, toggle_property_favorite.property_id);
    RETURN TRUE;
  END IF;
END;
$$;