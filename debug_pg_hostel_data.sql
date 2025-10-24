-- Debug PG/Hostel data in property_submissions table
SELECT 
  id,
  property_type,
  title,
  -- Check PG/Hostel specific fields
  payload->>'place_available_for' as place_available_for,
  payload->>'food_included' as food_included,
  payload->>'gate_closing_time' as gate_closing_time,
  payload->>'available_services' as available_services,
  payload->>'room_amenities' as room_amenities,
  -- Check additional_info for PG/Hostel amenities
  payload->'additional_info'->>'common_tv' as common_tv,
  payload->'additional_info'->>'refrigerator' as refrigerator,
  payload->'additional_info'->>'mess' as mess,
  payload->'additional_info'->>'cooking_allowed' as cooking_allowed,
  -- Check what's working (parking, power_backup)
  payload->>'parking' as parking,
  payload->>'power_backup' as power_backup,
  -- Check the full additional_info structure
  payload->'additional_info' as additional_info_full
FROM property_submissions 
WHERE id = '1028730b-3893-4d4b-8050-151398360614';
