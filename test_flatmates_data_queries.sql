-- SAFE TESTING QUERIES - Run these first to understand the current state
-- These queries are READ-ONLY and won't modify any data

-- 1. Check if preferred_tenant field exists in properties table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name = 'preferred_tenant';

-- 2. Check current trigger definition
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'sync_properties_with_submissions';

-- 3. Check a specific Flatmates property submission payload
SELECT 
    id,
    property_type,
    payload->>'preferred_tenant' as preferred_tenant_from_payload,
    payload->>'bathrooms' as bathrooms_from_payload,
    payload->>'balconies' as balconies_from_payload,
    payload->'additional_info'->>'bathrooms' as bathrooms_from_additional_info,
    payload->'additional_info'->>'balconies' as balconies_from_additional_info
FROM property_submissions 
WHERE property_type = 'flatmates' 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Check the corresponding properties table data
SELECT 
    p.id,
    p.property_type,
    p.preferred_tenant,
    p.bathrooms,
    p.balconies,
    p.additional_info
FROM properties p
JOIN property_submissions ps ON p.id = ps.id
WHERE ps.property_type = 'flatmates'
ORDER BY p.created_at DESC
LIMIT 3;
