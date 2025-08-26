-- Create user_favorites table to track saved/favorited properties
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON public.user_favorites(property_id);

-- Create function to toggle favorite status
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
  
  -- Check if favorite already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_favorites 
    WHERE user_id = user_uuid AND property_id = toggle_property_favorite.property_id
  ) INTO favorite_exists;
  
  IF favorite_exists THEN
    -- Remove from favorites
    DELETE FROM public.user_favorites 
    WHERE user_id = user_uuid AND property_id = toggle_property_favorite.property_id;
    RETURN FALSE;
  ELSE
    -- Add to favorites
    INSERT INTO public.user_favorites (user_id, property_id)
    VALUES (user_uuid, toggle_property_favorite.property_id);
    RETURN TRUE;
  END IF;
END;
$$;