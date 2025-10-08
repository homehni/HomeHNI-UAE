-- SQL script to identify and clean up duplicate properties
-- Run this script in the Supabase SQL editor

-- Find duplicate properties based on similar titles and locations
WITH duplicate_candidates AS (
  SELECT 
    id,
    title,
    locality,
    expected_price,
    LOWER(REPLACE(title, 'SALE', 'Sale')) AS normalized_title,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY locality, LOWER(REPLACE(title, 'SALE', 'Sale'))
      ORDER BY created_at DESC
    ) as row_num
  FROM properties
  WHERE 
    title LIKE '%Land For%' -- Focus on land properties where most duplicates occur
    AND status = 'approved' -- Only consider approved properties
)

-- Select the duplicates (row_num > 1 means it's a duplicate)
SELECT 
  dc1.id AS keep_id,
  dc1.title AS keep_title,
  dc1.created_at AS keep_created_at,
  dc2.id AS duplicate_id,
  dc2.title AS duplicate_title,
  dc2.created_at AS duplicate_created_at,
  dc1.locality,
  dc1.expected_price
FROM duplicate_candidates dc1
JOIN duplicate_candidates dc2 
  ON dc1.normalized_title = dc2.normalized_title
  AND dc1.locality = dc2.locality
  AND dc1.id != dc2.id
  AND dc1.row_num = 1     -- This is the record to keep (most recent)
  AND dc2.row_num > 1     -- These are the duplicates to remove
ORDER BY dc1.locality, dc1.normalized_title;

-- The SQL above only identifies duplicates. 
-- After reviewing the results, you can run the following SQL to remove duplicates:

/*
-- WARNING: This will permanently delete duplicate properties
-- Replace the ids with the actual duplicate_id values from the query above

DELETE FROM properties
WHERE id IN ('duplicate-id-1', 'duplicate-id-2', 'duplicate-id-3');

-- Also clean up from content_elements if they were added there
DELETE FROM content_elements
WHERE element_type = 'featured_property' 
AND content->>'id' IN ('duplicate-id-1', 'duplicate-id-2', 'duplicate-id-3');
*/