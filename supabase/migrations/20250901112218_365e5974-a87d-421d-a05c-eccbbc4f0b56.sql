-- Insert sample property data into property_real table for testing
INSERT INTO public.property_real (id, element_type, element_key, title, property_type, location, images, content, is_active) VALUES
('sample-1', 'property', 'featured_residential', '2BHK Apartment in Hyderabad', 'apartment', 'Hyderabad, Telangana, India', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300', 
 '{
   "id": "sample-1",
   "title": "2BHK Apartment in Hyderabad", 
   "property_type": "apartment",
   "listing_type": "sale",
   "status": "approved",
   "expected_price": 5500000,
   "city": "Hyderabad",
   "state": "Telangana",
   "bhk_type": "2BHK",
   "super_area": 1200,
   "is_featured": true,
   "furnishing": "semi-furnished",
   "images": ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300"]
 }', true),
('sample-2', 'property', 'recommended_plot', 'Agricultural Plot in Bangalore', 'plot', 'Bangalore, Karnataka, India', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300',
 '{
   "id": "sample-2",
   "title": "Agricultural Plot in Bangalore",
   "property_type": "plot", 
   "listing_type": "sale",
   "status": "approved",
   "expected_price": 2500000,
   "city": "Bangalore",
   "state": "Karnataka", 
   "super_area": 5000,
   "isRecommended": true,
   "images": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300"]
 }', true),
('sample-3', 'property', 'commercial_office', 'Office Space in Mumbai', 'office', 'Mumbai, Maharashtra, India', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
 '{
   "id": "sample-3", 
   "title": "Office Space in Mumbai",
   "property_type": "office",
   "listing_type": "rent",
   "status": "approved", 
   "expected_price": 150000,
   "city": "Mumbai",
   "state": "Maharashtra",
   "super_area": 800,
   "is_featured": true,
   "images": ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=300"]
 }', true);