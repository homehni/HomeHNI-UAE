-- Check what's actually in property_submissions table
SELECT 
  id,
  property_type,
  -- Check PG/Hostel specific fields in payload
  payload->>'place_available_for' as place_available_for,
  payload->>'food_included' as food_included,
  payload->>'gate_closing_time' as gate_closing_time,
  payload->>'available_services' as available_services,
  payload->>'room_amenities' as room_amenities,
  -- Check PG/Hostel amenities in payload.additional_info
  payload->'additional_info'->>'common_tv' as common_tv,
  payload->'additional_info'->>'refrigerator' as refrigerator,
  payload->'additional_info'->>'mess' as mess,
  payload->'additional_info'->>'cooking_allowed' as cooking_allowed,
  -- Check what's working
  payload->>'parking' as parking,
  payload->>'power_backup' as power_backup,
  -- Check preferred_tenant
  payload->>'preferred_tenant' as preferred_tenant,
  -- Show the full payload structure
  payload as payload_full
FROM property_submissions 
WHERE id = '1028730b-3893-4d4b-8050-151398360614';
