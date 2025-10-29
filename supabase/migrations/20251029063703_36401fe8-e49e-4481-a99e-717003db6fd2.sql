-- Create services table to capture service form submissions
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  message text,
  additional_data jsonb DEFAULT '{}'::jsonb,
  user_id uuid,
  status text DEFAULT 'pending'::text,
  whatsapp_opted_in boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on service_type for faster queries
CREATE INDEX idx_services_service_type ON public.services(service_type);

-- Create index on user_id for faster queries
CREATE INDEX idx_services_user_id ON public.services(user_id);

-- Create index on status for filtering
CREATE INDEX idx_services_status ON public.services(status);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public to insert service requests
CREATE POLICY "Public can submit service requests"
ON public.services
FOR INSERT
TO public
WITH CHECK (true);

-- Allow admins to view all service requests
CREATE POLICY "Admins can view all services"
ON public.services
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update service requests
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to view their own service requests
CREATE POLICY "Users can view their own service requests"
ON public.services
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_services_updated_at();

-- Add comment to table
COMMENT ON TABLE public.services IS 'Stores all service form submissions from the /services page';
COMMENT ON COLUMN public.services.service_type IS 'Type of service: loans, home-security, packers-movers, legal-services, handover-services, property-management, architects, painting-cleaning, interior-design';
COMMENT ON COLUMN public.services.additional_data IS 'Service-specific fields stored as JSON';
COMMENT ON COLUMN public.services.status IS 'Status of the request: pending, contacted, in-progress, completed, cancelled';