-- Storage RLS policies for property-media bucket to enable non-admin uploads
-- Safe-guarded creation (skip if already exists)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read access to property-media'
  ) THEN
    CREATE POLICY "Public read access to property-media"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'property-media');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload property images and videos'
  ) THEN
    CREATE POLICY "Authenticated users can upload property images and videos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'property-media'
      AND (
        name LIKE 'content-images/%'
        OR name LIKE 'videos/%'
        OR name LIKE '%/videos/%'  -- supports paths like <user-id>/videos/...
      )
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can manage all property-media objects'
  ) THEN
    CREATE POLICY "Admins can manage all property-media objects"
    ON storage.objects
    FOR ALL
    USING (
      bucket_id = 'property-media' AND public.has_role(auth.uid(), 'admin'::app_role)
    )
    WITH CHECK (
      bucket_id = 'property-media' AND public.has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END$$;