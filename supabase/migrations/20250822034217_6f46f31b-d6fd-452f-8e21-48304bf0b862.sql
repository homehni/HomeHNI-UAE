-- Create enhanced CMS schema for comprehensive content management

-- Create content_blocks table for modular content management
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES public.page_sections(id) ON DELETE CASCADE,
  block_type text NOT NULL, -- 'text', 'image', 'html', 'card', 'hero', 'cta'
  content jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create content_versions table for version history
CREATE TABLE IF NOT EXISTS public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL, -- references any content table
  content_type text NOT NULL, -- 'page', 'section', 'block', 'element'
  content_data jsonb NOT NULL,
  version_number integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  description text
);

-- Enable RLS on new tables
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_blocks
CREATE POLICY "Admins can manage all content blocks" 
  ON public.content_blocks FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view active content blocks"
  ON public.content_blocks FOR SELECT
  USING (is_active = true);

-- RLS policies for content_versions
CREATE POLICY "Admins can manage all content versions"
  ON public.content_versions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_blocks_section_id ON public.content_blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_sort_order ON public.content_blocks(sort_order);
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON public.content_versions(content_id, content_type);

-- Enable realtime for content_blocks
ALTER TABLE public.content_blocks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_blocks;