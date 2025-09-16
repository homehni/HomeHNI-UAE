-- Fix toggle_property_favorite function volatility to allow writes
-- Create or replace the function that toggles a user's favorite property
-- Ensures it is VOLATILE (required for INSERT/DELETE) and respects RLS (no SECURITY DEFINER)

create or replace function public.toggle_property_favorite(p_property_id uuid)
returns boolean
language plpgsql
volatile
as $$
declare
  v_exists boolean;
begin
  -- Ensure the user is authenticated
  if auth.uid() is null then
    raise exception 'User must be authenticated';
  end if;

  -- Check if favorite already exists
  select exists(
    select 1 from public.user_favorites
    where user_id = auth.uid() and property_id = p_property_id
  ) into v_exists;

  if v_exists then
    -- Remove existing favorite
    delete from public.user_favorites
    where user_id = auth.uid() and property_id = p_property_id;
    return false; -- Now not favorited
  else
    -- Add new favorite
    insert into public.user_favorites (user_id, property_id)
    values (auth.uid(), p_property_id);
    return true; -- Now favorited
  end if;
end;
$$;

comment on function public.toggle_property_favorite(uuid) is 'Toggles a property in the authenticated user''s favorites. Returns true if added, false if removed.';