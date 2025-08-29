-- Enhanced RBAC System for Content Management

-- Step 1: Extend app_role enum with content management roles
DO $$ BEGIN
    -- Add new roles to existing app_role enum
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'content_manager';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'blog_content_creator';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'static_page_manager';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'sales_team';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'property_moderator';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'lead_manager';
EXCEPTION
    WHEN invalid_text_representation THEN
        -- Handle case where values already exist
        NULL;
END $$;

-- Step 2: Extend content_type enum with more granular content areas
DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'homepage_sections';
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'testimonials';
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'services';
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'featured_properties';
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'marketing_content';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

-- Step 3: Add comprehensive role permissions for new roles
INSERT INTO role_permissions (role, content_type, action)
SELECT * FROM (VALUES
    -- Content Manager: Full access to content areas
    ('content_manager'::app_role, 'homepage_sections'::content_type, 'create'::permission_action),
    ('content_manager'::app_role, 'homepage_sections'::content_type, 'read'::permission_action),
    ('content_manager'::app_role, 'homepage_sections'::content_type, 'update'::permission_action),
    ('content_manager'::app_role, 'homepage_sections'::content_type, 'delete'::permission_action),
    ('content_manager'::app_role, 'testimonials'::content_type, 'create'::permission_action),
    ('content_manager'::app_role, 'testimonials'::content_type, 'read'::permission_action),
    ('content_manager'::app_role, 'testimonials'::content_type, 'update'::permission_action),
    ('content_manager'::app_role, 'testimonials'::content_type, 'delete'::permission_action),
    ('content_manager'::app_role, 'services'::content_type, 'create'::permission_action),
    ('content_manager'::app_role, 'services'::content_type, 'read'::permission_action),
    ('content_manager'::app_role, 'services'::content_type, 'update'::permission_action),
    ('content_manager'::app_role, 'services'::content_type, 'delete'::permission_action),
    
    -- Blog Content Creator: Blog-specific permissions
    ('blog_content_creator'::app_role, 'blog'::content_type, 'create'::permission_action),
    ('blog_content_creator'::app_role, 'blog'::content_type, 'read'::permission_action),
    ('blog_content_creator'::app_role, 'blog'::content_type, 'update'::permission_action),
    
    -- Static Page Manager: Static pages permissions
    ('static_page_manager'::app_role, 'static_pages'::content_type, 'create'::permission_action),
    ('static_page_manager'::app_role, 'static_pages'::content_type, 'read'::permission_action),
    ('static_page_manager'::app_role, 'static_pages'::content_type, 'update'::permission_action),
    ('static_page_manager'::app_role, 'static_pages'::content_type, 'delete'::permission_action),
    
    -- Sales Team: Properties and leads management
    ('sales_team'::app_role, 'properties'::content_type, 'read'::permission_action),
    ('sales_team'::app_role, 'properties'::content_type, 'update'::permission_action),
    ('sales_team'::app_role, 'featured_properties'::content_type, 'create'::permission_action),
    ('sales_team'::app_role, 'featured_properties'::content_type, 'read'::permission_action),
    ('sales_team'::app_role, 'featured_properties'::content_type, 'update'::permission_action),
    
    -- Property Moderator: Property management
    ('property_moderator'::app_role, 'properties'::content_type, 'read'::permission_action),
    ('property_moderator'::app_role, 'properties'::content_type, 'update'::permission_action),
    ('property_moderator'::app_role, 'properties'::content_type, 'delete'::permission_action),
    
    -- Lead Manager: Customer relationship management
    ('lead_manager'::app_role, 'users'::content_type, 'read'::permission_action),
    ('lead_manager'::app_role, 'users'::content_type, 'update'::permission_action)
) AS v(role, content_type, action)
ON CONFLICT (role, content_type, action) DO NOTHING;

-- Step 4: Create function to assign user credentials
CREATE OR REPLACE FUNCTION public.create_user_with_role(
    _email text,
    _password text,
    _full_name text,
    _role app_role,
    _created_by uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
    admin_user_id uuid := auth.uid();
BEGIN
    -- Check if the current user is admin
    IF NOT has_role(admin_user_id, 'admin'::app_role) THEN
        RAISE EXCEPTION 'Only admins can create users with roles';
    END IF;
    
    -- Validate email format
    IF _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Create user in auth.users (this is a simplified approach, 
    -- in production you'd use Supabase Admin API)
    -- For now, we'll create a record that can be used to track the user
    -- The actual auth user creation should be handled via Supabase Admin SDK
    
    -- Generate a UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Create profile
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (new_user_id, _full_name);
    
    -- Assign role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, _role);
    
    -- Log the creation
    INSERT INTO public.user_role_audit_log (user_id, old_role, new_role, changed_by, reason)
    VALUES (new_user_id, NULL, _role, admin_user_id, 'User created by admin with role: ' || _role::text);
    
    RETURN new_user_id;
END;
$$;

-- Step 5: Create function to get role permissions
CREATE OR REPLACE FUNCTION public.get_role_permissions(_role app_role)
RETURNS TABLE(content_type content_type, action permission_action)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
    SELECT rp.content_type, rp.action
    FROM role_permissions rp
    WHERE rp.role = _role;
$$;

-- Step 6: Enhanced user management view for admins
CREATE OR REPLACE VIEW public.admin_user_management AS
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    au.email,
    ur.role,
    p.verification_status,
    p.created_at,
    p.updated_at,
    (SELECT COUNT(*) FROM properties WHERE user_id = p.user_id) as property_count,
    (SELECT COUNT(*) FROM leads WHERE property_owner_id = p.user_id) as lead_count
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
LEFT JOIN auth.users au ON p.user_id = au.id
ORDER BY p.created_at DESC;

-- Enable RLS on the view (not directly possible, but the underlying tables have RLS)