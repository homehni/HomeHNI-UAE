-- Update featured properties with correct image names that actually exist in storage
UPDATE content_elements 
SET images = ARRAY['content-images/apt1.jpg', 'content-images/apt2.jpg']
WHERE element_key = 'property_1';

UPDATE content_elements 
SET images = ARRAY['content-images/villa1.jpg', 'content-images/villa2.jpg']
WHERE element_key = 'property_2';

UPDATE content_elements 
SET images = ARRAY['content-images/house1.jpg', 'content-images/house2.jpg']
WHERE element_key = 'property_3';

UPDATE content_elements 
SET images = ARRAY['content-images/hall1.jpg', 'content-images/hall2.jpg']
WHERE element_key = 'property_4';

UPDATE content_elements 
SET images = ARRAY['content-images/kitchen1.jpg', 'content-images/hall3.jpg']
WHERE element_key = 'property_5';

UPDATE content_elements 
SET images = ARRAY['content-images/plot1.jpg', 'content-images/plot2.jpg']
WHERE element_key = 'property_6';

UPDATE content_elements 
SET images = ARRAY['content-images/farm1.jpg', 'content-images/farm2.jpg']
WHERE element_key = 'property_7';