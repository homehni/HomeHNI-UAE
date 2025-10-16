-- Add a new column to track premium status
ALTER TABLE properties
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- Update the function to set is_premium to true
CREATE OR REPLACE FUNCTION update_property_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the property status to 'PREMIUM' and set is_premium to true
  UPDATE properties
  SET status = 'PREMIUM', is_premium = TRUE
  WHERE id = NEW.property_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;