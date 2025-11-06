-- Add property-specific fields to developer_pages table
-- This allows storing property-style details (price, configurations, area, units, etc.)

ALTER TABLE developer_pages
ADD COLUMN IF NOT EXISTS primary_project jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN developer_pages.primary_project IS 'Stores property-specific details: price {min, max, unit, perSqft}, configurations [{type, sizes[]}], projectArea, totalUnits, status, possession, rera, brochureLink, mapLink, features[], etc.';