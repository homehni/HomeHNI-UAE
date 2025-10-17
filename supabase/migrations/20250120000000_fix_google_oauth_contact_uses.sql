-- Fix Google OAuth users who don't have contact uses set
-- This migration fixes existing users who signed up with Google OAuth
-- but don't have free_contact_uses set in their profile

-- Update profiles where free_contact_uses is NULL (Google OAuth users)
UPDATE public.profiles 
SET 
  free_contact_uses = 50,
  total_contact_uses = COALESCE(total_contact_uses, 0)
WHERE free_contact_uses IS NULL;

-- Log how many profiles were updated
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % profiles with missing contact uses', updated_count;
END $$;
