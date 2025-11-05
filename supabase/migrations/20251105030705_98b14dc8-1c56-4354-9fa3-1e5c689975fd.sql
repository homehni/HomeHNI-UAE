-- Create developer-media storage bucket for developer page content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'developer-media',
  'developer-media',
  true,
  524288000, -- 500MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ];

-- RLS Policy: Allow public to view files
DROP POLICY IF EXISTS "Public can view developer media" ON storage.objects;
CREATE POLICY "Public can view developer media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'developer-media');

-- RLS Policy: Authenticated users can upload
DROP POLICY IF EXISTS "Authenticated users can upload developer media" ON storage.objects;
CREATE POLICY "Authenticated users can upload developer media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'developer-media');

-- RLS Policy: Users can update their own uploads
DROP POLICY IF EXISTS "Users can update own developer media" ON storage.objects;
CREATE POLICY "Users can update own developer media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'developer-media');

-- RLS Policy: Users can delete their own uploads
DROP POLICY IF EXISTS "Users can delete own developer media" ON storage.objects;
CREATE POLICY "Users can delete own developer media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'developer-media');