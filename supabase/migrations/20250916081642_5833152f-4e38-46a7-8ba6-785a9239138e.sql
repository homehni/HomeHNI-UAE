-- Disambiguate parameter vs column in toggle function to fix 'column reference property_id is ambiguous'
CREATE OR REPLACE FUNCTION public.toggle_property_favorite(property_id uuid)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  _pid uuid := property_id;
  v_exists boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites uf
    WHERE uf.user_id = auth.uid() AND uf.property_id = _pid
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.user_favorites uf
    WHERE uf.user_id = auth.uid() AND uf.property_id = _pid;
    RETURN false;
  ELSE
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (auth.uid(), _pid);
    RETURN true;
  END IF;
END;
$$;