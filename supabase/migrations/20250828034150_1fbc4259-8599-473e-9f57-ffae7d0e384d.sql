-- Remove the "Untitled - online only" property from South Delhi
-- First delete from content_elements (featured properties)
DELETE FROM content_elements 
WHERE element_type = 'featured_property' 
AND content->>'id' = 'c1390306-8d32-4adb-b428-75ccfa48151a';

-- Then delete from main properties table
DELETE FROM properties 
WHERE id = 'c1390306-8d32-4adb-b428-75ccfa48151a';