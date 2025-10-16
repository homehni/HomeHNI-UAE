-- Function to update property status to 'PREMIUM' when payment is successful
CREATE OR REPLACE FUNCTION update_property_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the property status to 'PREMIUM' when payment is successful
  UPDATE properties
  SET status = 'PREMIUM'
  WHERE id = NEW.property_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after payment status is updated to 'SUCCESS'
CREATE TRIGGER on_payment_success
AFTER UPDATE ON payments
FOR EACH ROW
WHEN (NEW.status = 'SUCCESS')
EXECUTE FUNCTION update_property_status();