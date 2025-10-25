-- Create lead_messages table for storing messages between property owners and leads
CREATE TABLE public.lead_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('owner', 'lead')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_messages
CREATE POLICY "Property owners can view messages for their leads"
  ON public.lead_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      JOIN public.properties ON properties.id = leads.property_id
      WHERE leads.id = lead_messages.lead_id 
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Leads can view messages for their inquiries"
  ON public.lead_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_messages.lead_id 
      AND leads.interested_user_email = auth.email()
    )
  );

CREATE POLICY "Property owners can create messages for their leads"
  ON public.lead_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'owner' 
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.leads 
      JOIN public.properties ON properties.id = leads.property_id
      WHERE leads.id = lead_id 
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Leads can create messages for their inquiries"
  ON public.lead_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'lead' 
    AND EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_id 
      AND leads.interested_user_email = auth.email()
    )
  );

CREATE POLICY "Property owners can update read status of their lead messages"
  ON public.lead_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      JOIN public.properties ON properties.id = leads.property_id
      WHERE leads.id = lead_messages.lead_id 
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Leads can update read status of their messages"
  ON public.lead_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_messages.lead_id 
      AND leads.interested_user_email = auth.email()
    )
  );

-- Create index for better performance
CREATE INDEX idx_lead_messages_lead_id ON public.lead_messages(lead_id);
CREATE INDEX idx_lead_messages_created_at ON public.lead_messages(created_at);
