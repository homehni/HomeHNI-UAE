-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'plot', 'commercial')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  bhk_type TEXT CHECK (bhk_type IN ('1rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+')),
  bathrooms INTEGER DEFAULT 0,
  balconies INTEGER DEFAULT 0,
  furnishing TEXT CHECK (furnishing IN ('fully', 'semi', 'unfurnished')),
  floor_no INTEGER,
  total_floors INTEGER,
  super_area DECIMAL NOT NULL,
  carpet_area DECIMAL,
  availability_type TEXT NOT NULL CHECK (availability_type IN ('immediate', 'date')),
  availability_date DATE,
  expected_price DECIMAL NOT NULL,
  price_negotiable BOOLEAN DEFAULT true,
  maintenance_charges DECIMAL DEFAULT 0,
  security_deposit DECIMAL DEFAULT 0,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  street_address TEXT,
  pincode TEXT NOT NULL,
  landmarks TEXT,
  description TEXT,
  images TEXT[],
  videos TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  property_owner_id UUID NOT NULL,
  interested_user_name TEXT NOT NULL,
  interested_user_email TEXT NOT NULL,
  interested_user_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties
CREATE POLICY "Users can view their own properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Create RLS policies for leads
CREATE POLICY "Property owners can view their leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid()::text = property_owner_id::text);

CREATE POLICY "Anyone can create leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners can update their leads" 
ON public.leads 
FOR UPDATE 
USING (auth.uid()::text = property_owner_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_leads_property_owner_id ON public.leads(property_owner_id);
CREATE INDEX idx_leads_property_id ON public.leads(property_id);