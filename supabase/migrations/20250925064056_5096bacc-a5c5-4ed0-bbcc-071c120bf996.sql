-- Allow property owners to update rental_status on their own submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'property_submissions' 
      AND policyname = 'Users can update their own submissions (rental status)'
  ) THEN
    CREATE POLICY "Users can update their own submissions (rental status)"
    ON public.property_submissions
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;