-- Drop existing restrictive policies for content_elements
DROP POLICY IF EXISTS "Content managers can manage content elements" ON content_elements;
DROP POLICY IF EXISTS "Admins can manage all content elements" ON content_elements;
DROP POLICY IF EXISTS "Public can view active content elements" ON content_elements;

-- Create unrestricted policies for content managers
CREATE POLICY "Content managers have full unrestricted access" 
ON content_elements 
FOR ALL 
TO public
USING (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public to view all content (active and inactive) for content managers
CREATE POLICY "Public can view all content elements" 
ON content_elements 
FOR SELECT 
TO public
USING (true);

-- Also update other content-related tables for full access

-- Update content_blocks policies
DROP POLICY IF EXISTS "Admins can manage all content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Public can view active content blocks" ON content_blocks;

CREATE POLICY "Content managers and admins have full access to content blocks" 
ON content_blocks 
FOR ALL 
TO public
USING (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view all content blocks" 
ON content_blocks 
FOR SELECT 
TO public
USING (true);

-- Update content_pages policies  
DROP POLICY IF EXISTS "Admins can manage all content pages" ON content_pages;
DROP POLICY IF EXISTS "Public can view published pages" ON content_pages;

CREATE POLICY "Content managers and admins have full access to content pages" 
ON content_pages 
FOR ALL 
TO public
USING (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view all content pages" 
ON content_pages 
FOR SELECT 
TO public
USING (true);

-- Update page_sections policies
DROP POLICY IF EXISTS "Admins can manage all page sections" ON page_sections;
DROP POLICY IF EXISTS "Public can view active sections of published pages" ON page_sections;

CREATE POLICY "Content managers and admins have full access to page sections" 
ON page_sections 
FOR ALL 
TO public
USING (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view all page sections" 
ON page_sections 
FOR SELECT 
TO public
USING (true);

-- Update featured_properties for content managers
DROP POLICY IF EXISTS "Admins can manage featured properties" ON featured_properties;
DROP POLICY IF EXISTS "Public can view active featured properties" ON featured_properties;

CREATE POLICY "Content managers and admins can manage featured properties" 
ON featured_properties 
FOR ALL 
TO public
USING (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  is_content_manager() OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view all featured properties" 
ON featured_properties 
FOR SELECT 
TO public
USING (true);