-- Update existing users' contact limits to 50
-- This migration increases free_contact_uses for all existing users to 50

UPDATE public.profiles 
SET free_contact_uses = 50 
WHERE free_contact_uses < 50;

-- Also set users who might have NULL values to 50
UPDATE public.profiles 
SET free_contact_uses = 50 
WHERE free_contact_uses IS NULL;