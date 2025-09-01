-- Enable RLS on property_real and allow public read access for active records
ALTER TABLE public.property_real ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Create SELECT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'property_real' 
      AND policyname = 'Public can view active property_real'
  ) THEN
    CREATE POLICY "Public can view active property_real"
    ON public.property_real
    FOR SELECT
    USING (COALESCE(is_active, true));
  END IF;
END $$;