-- Enhanced RBAC System for Content Management - Part 2: Permissions and Functions

-- Step 1: Add comprehensive role permissions for new roles
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

-- Step 2: Create function to get role permissions (with proper search path)
CREATE OR REPLACE FUNCTION public.get_role_permissions(_role app_role)
RETURNS TABLE(content_type content_type, action permission_action)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT rp.content_type, rp.action
    FROM role_permissions rp
    WHERE rp.role = _role;
$$;

-- Step 3: Create function to get available roles for admin
CREATE OR REPLACE FUNCTION public.get_available_roles()
RETURNS TABLE(role_name text, display_name text, description text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT 
        role_name,
        display_name,
        description
    FROM (VALUES
        ('admin', 'Admin', 'Full system access and user management'),
        ('content_manager', 'Content Manager', 'Manage homepage sections, testimonials, and services'),
        ('blog_content_creator', 'Blog Content Creator', 'Create and manage blog content'),
        ('static_page_manager', 'Static Page Manager', 'Manage static pages and content'),
        ('sales_team', 'Sales Team', 'Manage properties and featured listings'),
        ('property_moderator', 'Property Moderator', 'Moderate and manage properties'),
        ('lead_manager', 'Lead Manager', 'Manage customer relationships and leads'),
        ('seller', 'Seller', 'Post and manage own properties'),
        ('buyer', 'Buyer', 'Browse and inquire about properties'),
        ('consultant', 'Consultant', 'Business consulting access')
    ) AS roles(role_name, display_name, description);
$$;