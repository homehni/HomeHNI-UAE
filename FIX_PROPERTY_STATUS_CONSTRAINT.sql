-- Fix property status constraint to allow 'new' status
-- This allows property submissions to use 'new' status as intended

BEGIN;

-- Drop the existing constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add the updated constraint with 'new' status included
ALTER TABLE public.properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'draft', 'new'));

COMMIT;

-- ========================================
-- VERIFICATION
-- ========================================
-- After running this fix:
-- 1. Property submissions with status: 'new' will work
-- 2. All existing status values remain valid
-- 3. Property submission process will work correctly
-- ========================================
