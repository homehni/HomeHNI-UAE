-- Create property_drafts table for saving work-in-progress forms
CREATE TABLE public.property_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  step_completed INTEGER DEFAULT 1,
  
  -- Step 1: Owner Info
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  owner_role TEXT, -- 'owner', 'agent', 'builder'
  
  -- Step 2: Property Info (matches existing properties table structure)
  title TEXT,
  property_type TEXT,
  listing_type TEXT,
  bhk_type TEXT,
  bathrooms INTEGER,
  balconies INTEGER,
  super_area NUMERIC,
  carpet_area NUMERIC,
  expected_price NUMERIC,
  state TEXT,
  city TEXT,
  locality TEXT,
  pincode TEXT,
  description TEXT,
  images TEXT[], -- Array of image URLs
  videos TEXT[], -- Array of video URLs
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.property_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies for property drafts
CREATE POLICY "Users can view their own drafts" 
ON public.property_drafts 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own drafts" 
ON public.property_drafts 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own drafts" 
ON public.property_drafts 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own drafts" 
ON public.property_drafts 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Create storage bucket for property media
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-media', 'property-media', true);

-- Create storage policies for property media
CREATE POLICY "Users can upload property media" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'property-media' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view property media" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'property-media');

CREATE POLICY "Users can update their property media" 
ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'property-media' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their property media" 
ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'property-media' AND
  auth.uid() IS NOT NULL
);

-- Add trigger for automatic timestamp updates on property_drafts
CREATE TRIGGER update_property_drafts_updated_at
BEFORE UPDATE ON public.property_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();