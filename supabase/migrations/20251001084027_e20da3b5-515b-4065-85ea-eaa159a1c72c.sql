-- Allow 'inactive' status for rental_status in properties and property_submissions
BEGIN;

-- Properties table: update CHECK constraint
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_rental_status_check;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_rental_status_check
  CHECK (rental_status IN ('available', 'inactive', 'rented', 'sold'));

-- Property submissions table: update CHECK constraint
ALTER TABLE public.property_submissions
  DROP CONSTRAINT IF EXISTS property_submissions_rental_status_check;
ALTER TABLE public.property_submissions
  ADD CONSTRAINT property_submissions_rental_status_check
  CHECK (rental_status IN ('available', 'inactive', 'rented', 'sold'));

COMMIT;