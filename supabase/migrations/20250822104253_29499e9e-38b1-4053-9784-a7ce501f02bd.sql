-- Add more images to existing properties for testing the gallery functionality

-- Update property "Spacious 2 BHK in Malakpet" to have 6 images
UPDATE properties 
SET images = ARRAY[
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753942542736_0.jpg',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753942542738_1.png',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753942542738_2.png',
  '/lovable-uploads/4668a80f-108d-4ef0-929c-b21403b6fdaa.png',
  '/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png',
  '/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png'
]
WHERE id = 'ad6dba87-b0a7-4544-b738-5fe68b54543b';

-- Update property "80 nnnnsss ssss" to have 7 images  
UPDATE properties 
SET images = ARRAY[
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753859286311_0.jpg',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753859286312_1.png',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/82c46e69-af45-4c25-873f-e8e2746e209d/images/1753859286312_2.png',
  '/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png',
  '/lovable-uploads/e08d45bd-4b13-4c75-8a7e-2d66ff60a743.png',
  '/lovable-uploads/982cdd16-c759-4f19-9526-09591d45d1d7.png',
  '/lovable-uploads/99962067-c156-4bbf-aaa3-651d219b7fc9.png'
]
WHERE id = '96e5b521-3ef7-4621-9557-10cbd56baf73';

-- Update property "New Listing for testing 04" to have 5 images
UPDATE properties 
SET images = ARRAY[
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/70eb195a-375b-43cb-93f9-3c22d01ede5f/images/1753958146045_0.jpg',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/70eb195a-375b-43cb-93f9-3c22d01ede5f/images/1753958146047_1.png',
  'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/property-media/70eb195a-375b-43cb-93f9-3c22d01ede5f/images/1753958146047_2.png',
  '/lovable-uploads/8c5f2ada-c5ed-4cd4-a5c2-61448821a4aa.png',
  '/lovable-uploads/94c2146b-79a1-4541-a959-f1f0c70611e0.png'
]
WHERE id = '6c8b00c9-8550-4460-9fa6-6c53ec7d10da';