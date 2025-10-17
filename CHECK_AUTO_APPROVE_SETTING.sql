-- Check if auto-approve setting is enabled
SELECT key, value, value::boolean as boolean_value 
FROM public.app_settings 
WHERE key = 'auto_approve_properties';
