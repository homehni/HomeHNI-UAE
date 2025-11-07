-- RLS Policy for post_requirement table to allow users with lead access to view leads
-- This migration adds policies for users who have purchased Basic or Premium Leads packages
-- 
-- SAFETY NOTES:
-- 1. This is an ADDITIVE policy - it adds to existing policies, doesn't replace them
-- 2. Existing admin policy remains intact (admins can still view all records)
-- 3. Existing INSERT policy remains intact (anonymous users can still submit)
-- 4. RLS policies are OR'd together - if ANY policy allows, access is granted

-- Function to check if user has active lead access
-- Uses SECURITY DEFINER to bypass RLS on payments table (read-only check)
CREATE OR REPLACE FUNCTION public.has_lead_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.payments
    WHERE user_id = user_uuid
    AND status = 'SUCCESS'
    AND (
      plan_name ILIKE '%Basic Leads Package%' OR
      plan_name ILIKE '%Premium Leads Package%'
    )
    AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1
  );
$$;

-- Add comment to function
COMMENT ON FUNCTION public.has_lead_access(UUID) IS 
'Checks if a user has active lead access based on successful payment records. Returns true if user has purchased Basic or Premium Leads package that has not expired.';

-- Allow users with lead access to view post_requirement records
-- Only show records where intent is Buy, Sell, or Lease (excludes Service intent)
-- This policy works alongside the existing admin policy (OR logic)
CREATE POLICY "Users with lead access can view requirements"
ON public.post_requirement
FOR SELECT
TO authenticated
USING (
  has_lead_access(auth.uid())
  AND intent IN ('Buy', 'Sell', 'Lease')
);

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.has_lead_access(UUID) TO authenticated;

-- Verify the policy was created (informational)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'post_requirement' 
    AND policyname = 'Users with lead access can view requirements'
  ) THEN
    RAISE NOTICE 'Policy created successfully';
  ELSE
    RAISE WARNING 'Policy creation may have failed';
  END IF;
END $$;


