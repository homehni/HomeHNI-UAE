-- Check and update the properties_status_check constraint to allow 'new' status
-- First, drop the existing constraint if it exists
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add the updated constraint that includes 'new' as a valid status
ALTER TABLE properties ADD CONSTRAINT properties_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'draft', 'new'));