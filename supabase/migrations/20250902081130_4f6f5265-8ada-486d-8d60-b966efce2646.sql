-- Update content_elements with properly organized images from content-images folders
-- Based on property types and available images in each folder

-- Apartment properties (using apartment folder)
UPDATE content_elements 
SET images = ARRAY['content-images/apartment/apt1.jpg', 'content-images/apartment/apt2.jpg', 'content-images/apartment/apt3.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Apartment' OR content->>'propertyType' = 'apartment');

-- Villa properties (using villa folder) 
UPDATE content_elements 
SET images = ARRAY['content-images/villa/hall1.jpg', 'content-images/villa/hall2.jpg', 'content-images/villa/hall3.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Villa' OR content->>'propertyType' = 'villa');

-- House properties (using house folder)
UPDATE content_elements 
SET images = ARRAY['content-images/house/apt4.jpg', 'content-images/house/apt5.jpg', 'content-images/house/apt6.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'House' OR content->>'propertyType' = 'house');

-- Independent House properties (using independent-house folder)
UPDATE content_elements 
SET images = ARRAY['content-images/independent-house/hall4.jpg', 'content-images/independent-house/hall5.jpg', 'content-images/independent-house/hall6.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Independent House' OR content->>'propertyType' = 'independent house');

-- Commercial properties (using commercial folder - assuming images exist)
UPDATE content_elements 
SET images = ARRAY['content-images/commercial/apt1.jpg', 'content-images/commercial/apt2.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Commercial' OR content->>'propertyType' = 'commercial');

-- Plot properties (using plot folder - assuming images exist)  
UPDATE content_elements 
SET images = ARRAY['content-images/plot/apt1.jpg', 'content-images/plot/apt2.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Plot' OR content->>'propertyType' = 'plot');

-- Penthouse properties (using penthouse folder - assuming images exist)
UPDATE content_elements 
SET images = ARRAY['content-images/penthouse/apt1.jpg', 'content-images/penthouse/apt2.jpg']  
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Penthouse' OR content->>'propertyType' = 'penthouse');

-- Farm House properties (using farmhouse folder - assuming images exist)
UPDATE content_elements 
SET images = ARRAY['content-images/farmhouse/apt1.jpg', 'content-images/farmhouse/apt2.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Farm House' OR content->>'propertyType' = 'farmhouse');

-- Agriculture Lands properties (using agricultural-lands folder - assuming images exist)
UPDATE content_elements 
SET images = ARRAY['content-images/agricultural-lands/apt1.jpg', 'content-images/agricultural-lands/apt2.jpg']
WHERE element_key LIKE 'property_%' 
AND (content->>'propertyType' = 'Agriculture Lands' OR content->>'propertyType' = 'agricultural lands');