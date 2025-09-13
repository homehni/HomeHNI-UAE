-- Create table to store property poster contact information
CREATE TABLE public.property_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp_opted_in BOOLEAN DEFAULT false,
  property_type TEXT,
  listing_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for property contacts
CREATE POLICY "Admins can view all property contacts" 
ON public.property_contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create property contacts" 
ON public.property_contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all property contacts" 
ON public.property_contacts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_contacts_updated_at
BEFORE UPDATE ON public.property_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit trigger for property contacts
CREATE OR REPLACE FUNCTION public.property_contacts_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      'Property Contact Created',
      'property_contacts',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      'Property Contact Updated',
      'property_contacts',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      'Property Contact Deleted',
      'property_contacts',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public;

CREATE TRIGGER property_contacts_audit
AFTER INSERT OR UPDATE OR DELETE ON public.property_contacts
FOR EACH ROW EXECUTE FUNCTION public.property_contacts_audit_trigger();