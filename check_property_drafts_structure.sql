-- Check the structure of property_drafts table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'property_drafts' 
ORDER BY ordinal_position;
