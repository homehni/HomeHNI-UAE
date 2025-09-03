-- Allow public read and authenticated uploads for property images/videos in property-media bucket
-- Policies are additive; these will not interfere with existing ones

-- Public can view objects in property-media (serves app-side selects if needed)
CREATE POLICY pm_public_select
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-media');

-- Authenticated users can upload to content-images and videos folders
CREATE POLICY pm_auth_insert_cimgs_vids
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-media'
  AND (
    position('content-images/' in name) = 1
    OR position('videos/' in name) = 1
  )
);

-- Admins can manage everything in property-media
CREATE POLICY pm_admin_all
ON storage.objects
FOR ALL
USING (bucket_id = 'property-media' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'property-media' AND public.has_role(auth.uid(), 'admin'::app_role));