-- Add contact usage tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS free_contact_uses INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS total_contact_uses INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_contact_use_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_contact_uses ON public.profiles(free_contact_uses);

-- Create function to check if user can contact owner
CREATE OR REPLACE FUNCTION public.can_contact_owner(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    remaining_uses INTEGER;
BEGIN
    SELECT free_contact_uses INTO remaining_uses
    FROM public.profiles
    WHERE user_id = user_uuid;
    
    -- If profile doesn't exist or uses is null, return false
    IF remaining_uses IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN remaining_uses > 0;
END;
$$;

-- Create function to use a contact attempt
CREATE OR REPLACE FUNCTION public.use_contact_attempt(user_uuid UUID)
RETURNS TABLE(success BOOLEAN, remaining_uses INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_uses INTEGER;
    new_remaining INTEGER;
BEGIN
    -- Get current usage
    SELECT free_contact_uses INTO current_uses
    FROM public.profiles
    WHERE user_id = user_uuid;
    
    -- If no profile or no uses left, return failure
    IF current_uses IS NULL OR current_uses <= 0 THEN
        RETURN QUERY SELECT FALSE::BOOLEAN, COALESCE(current_uses, 0)::INTEGER;
        RETURN;
    END IF;
    
    -- Decrement free uses and increment total uses
    UPDATE public.profiles 
    SET 
        free_contact_uses = free_contact_uses - 1,
        total_contact_uses = total_contact_uses + 1,
        last_contact_use_at = NOW()
    WHERE user_id = user_uuid;
    
    -- Get new remaining uses
    SELECT free_contact_uses INTO new_remaining
    FROM public.profiles
    WHERE user_id = user_uuid;
    
    RETURN QUERY SELECT TRUE::BOOLEAN, new_remaining::INTEGER;
END;
$$;

-- Create RLS policies for the new functions
GRANT EXECUTE ON FUNCTION public.can_contact_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.use_contact_attempt(UUID) TO authenticated;