-- Migration to add rental_status column to properties and property_submissions tables

-- Add rental_status column to properties table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='properties' AND column_name='rental_status') THEN
        ALTER TABLE public.properties 
        ADD COLUMN rental_status TEXT DEFAULT 'available' 
        CHECK (rental_status IN ('available', 'rented', 'sold'));
        
        COMMENT ON COLUMN public.properties.rental_status IS 'Current rental/sale status of the property';
    END IF;
END $$;

-- Add rental_status column to property_submissions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='property_submissions' AND column_name='rental_status') THEN
        ALTER TABLE public.property_submissions 
        ADD COLUMN rental_status TEXT DEFAULT 'available' 
        CHECK (rental_status IN ('available', 'rented', 'sold'));
        
        COMMENT ON COLUMN public.property_submissions.rental_status IS 'Current rental/sale status of the property';
    END IF;
END $$;

-- Create index for better performance on rental_status queries
CREATE INDEX IF NOT EXISTS idx_properties_rental_status ON public.properties(rental_status);
CREATE INDEX IF NOT EXISTS idx_property_submissions_rental_status ON public.property_submissions(rental_status);
