-- Create post_requirement table to store all post-service requests
CREATE TABLE public.post_requirement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT,
  intent TEXT NOT NULL,
  property_types TEXT[] NOT NULL,
  service_category TEXT NOT NULL,
  budget_min NUMERIC,
  budget_max NUMERIC,
  notes TEXT,
  reference_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_post_requirement_email ON public.post_requirement(email);
CREATE INDEX idx_post_requirement_reference_id ON public.post_requirement(reference_id);
CREATE INDEX idx_post_requirement_created_at ON public.post_requirement(created_at DESC);

-- No RLS policies as per requirement - table is open for inserts