-- Create schedule_visit table to store property visit requests
CREATE TABLE IF NOT EXISTS public.schedule_visit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  property_title TEXT NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visit_date DATE,
  visit_time TEXT,
  is_property_dealer BOOLEAN DEFAULT false,
  need_immediate_visit BOOLEAN DEFAULT false,
  interested_in_home_loan BOOLEAN DEFAULT false,
  interested_in_site_visits BOOLEAN DEFAULT false,
  agreed_to_terms BOOLEAN DEFAULT false,
  property_owner_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schedule_visit ENABLE ROW LEVEL SECURITY;

-- Anyone can create schedule visit requests
CREATE POLICY "Anyone can create schedule visit requests"
  ON public.schedule_visit
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Property owners can view visits for their properties
CREATE POLICY "Property owners can view their property visits"
  ON public.schedule_visit
  FOR SELECT
  TO authenticated
  USING (
    property_owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = schedule_visit.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Admins can manage all schedule visits
CREATE POLICY "Admins can manage all schedule visits"
  ON public.schedule_visit
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Property owners can update status of their property visits
CREATE POLICY "Property owners can update their property visit status"
  ON public.schedule_visit
  FOR UPDATE
  TO authenticated
  USING (
    property_owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = schedule_visit.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_schedule_visit_property_id ON public.schedule_visit(property_id);
CREATE INDEX IF NOT EXISTS idx_schedule_visit_property_owner_id ON public.schedule_visit(property_owner_id);
CREATE INDEX IF NOT EXISTS idx_schedule_visit_created_at ON public.schedule_visit(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_schedule_visit_updated_at
  BEFORE UPDATE ON public.schedule_visit
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();