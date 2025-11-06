-- Drop any conflicting policies first
DROP POLICY IF EXISTS "Users can create their own developer pages" ON public.developer_pages;
DROP POLICY IF EXISTS "Users can update their own developer pages" ON public.developer_pages;
DROP POLICY IF EXISTS "Users can delete their own developer pages" ON public.developer_pages;

-- Allow authenticated users to insert their own developer pages
CREATE POLICY "Users can create their own developer pages"
ON public.developer_pages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own developer pages  
CREATE POLICY "Users can update their own developer pages"
ON public.developer_pages
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own developer pages
CREATE POLICY "Users can delete their own developer pages"
ON public.developer_pages
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);