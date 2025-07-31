-- Add owner information fields to properties table
ALTER TABLE public.properties 
ADD COLUMN owner_name TEXT,
ADD COLUMN owner_email TEXT, 
ADD COLUMN owner_phone TEXT,
ADD COLUMN owner_role TEXT;