-- Fix linter rule 0010: Security Definer View
-- Ensure the view runs with the invoker's privileges and RLS
ALTER VIEW public.public_properties SET (security_invoker = true);