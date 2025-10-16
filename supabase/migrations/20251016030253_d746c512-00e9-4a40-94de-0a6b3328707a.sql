-- Add property_id column to payments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'property_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN property_id UUID REFERENCES properties(id) ON DELETE SET NULL;
    CREATE INDEX idx_payments_property_id ON payments(property_id);
  END IF;
END $$;

-- Update the trigger function to set is_premium flag correctly
CREATE OR REPLACE FUNCTION update_property_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the property is_premium flag to true when payment is successful
  IF NEW.property_id IS NOT NULL THEN
    UPDATE properties
    SET is_premium = true
    WHERE id = NEW.property_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_payment_success ON payments;

-- Trigger to call the function after payment status is updated to 'SUCCESS'
CREATE TRIGGER on_payment_success
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
WHEN (NEW.status = 'SUCCESS' AND NEW.property_id IS NOT NULL)
EXECUTE FUNCTION update_property_status();