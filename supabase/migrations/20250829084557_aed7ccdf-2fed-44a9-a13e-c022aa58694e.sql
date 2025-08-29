-- Enhanced RBAC System for Content Management - Part 1: Extend Enums

-- Step 1: Extend app_role enum with content management roles
DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'content_manager';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'blog_content_creator';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'static_page_manager';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'sales_team';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'property_moderator';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'lead_manager';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

-- Step 2: Extend content_type enum with more granular content areas
DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'homepage_sections';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'testimonials';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'services';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'featured_properties';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'marketing_content';
EXCEPTION
    WHEN invalid_text_representation THEN
        NULL;
END $$;