-- Check what's in property_drafts table for this PG/Hostel property
SELECT 
  id,
  property_type,
  -- Check PG/Hostel specific fields in additional_info
  additional_info->>'place_available_for' as place_available_for,
  additional_info->>'food_included' as food_included,
  additional_info->>'gate_closing_time' as gate_closing_time,
  additional_info->>'available_services' as available_services,
  additional_info->>'room_amenities' as room_amenities,
  -- Check PG/Hostel amenities in additional_info
  additional_info->>'common_tv' as common_tv,
  additional_info->>'refrigerator' as refrigerator,
  additional_info->>'mess' as mess,
  additional_info->>'cooking_allowed' as cooking_allowed,
  -- Check what's working (direct columns)
  parking,
  power_backup,
  -- Check preferred_tenant (direct column)
  preferred_tenant,
  -- Show the full additional_info structure
  additional_info as additional_info_full
FROM property_drafts 
WHERE id = '1028730b-3893-4d4b-8050-151398360614';
