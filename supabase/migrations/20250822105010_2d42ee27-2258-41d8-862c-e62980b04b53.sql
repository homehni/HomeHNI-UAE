-- Add more images to the properties that are likely to be viewed by the user
-- Let's add images to several properties to ensure the user can test the functionality

-- Update the second property (which would be property/2 in the URL) 
UPDATE properties 
SET images = ARRAY[
  COALESCE(images[1], '/lovable-uploads/4668a80f-108d-4ef0-929c-b21403b6fdaa.png'),
  COALESCE(images[2], '/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png'),
  COALESCE(images[3], '/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png'),
  '/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png',
  '/lovable-uploads/e08d45bd-4b13-4c75-8a7e-2d66ff60a743.png',
  '/lovable-uploads/982cdd16-c759-4f19-9526-09591d45d1d7.png',
  '/lovable-uploads/99962067-c156-4bbf-aaa3-651d219b7fc9.png',
  '/lovable-uploads/8c5f2ada-c5ed-4cd4-a5c2-61448821a4aa.png'
]
WHERE id = (
  SELECT id FROM properties 
  WHERE status IN ('approved', 'active') 
  ORDER BY created_at DESC 
  LIMIT 1 OFFSET 1
);

-- Also update a few more properties to have more images for testing
UPDATE properties 
SET images = ARRAY[
  COALESCE(images[1], '/lovable-uploads/4668a80f-108d-4ef0-929c-b21403b6fdaa.png'),
  COALESCE(images[2], '/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png'),
  COALESCE(images[3], '/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png'),
  '/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png',
  '/lovable-uploads/981bce75-81a9-4afe-a63a-3efc7448e319.png',
  '/lovable-uploads/9c781a0f-f35d-4b60-b9c5-633ae3407e51.png'
]
WHERE id = (
  SELECT id FROM properties 
  WHERE status IN ('approved', 'active') 
  ORDER BY created_at DESC 
  LIMIT 1 OFFSET 2
);

-- Update the third property too
UPDATE properties 
SET images = ARRAY[
  COALESCE(images[1], '/lovable-uploads/4668a80f-108d-4ef0-929c-b21403b6fdaa.png'),
  COALESCE(images[2], '/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png'),
  COALESCE(images[3], '/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png'),
  '/lovable-uploads/ddda335f-1bbc-402a-befb-f6d3f4d631e6.png',
  '/lovable-uploads/f5f1d518-d734-4fa1-abd3-f45e772294cd.png'
]
WHERE id = (
  SELECT id FROM properties 
  WHERE status IN ('approved', 'active') 
  ORDER BY created_at DESC 
  LIMIT 1 OFFSET 3
);