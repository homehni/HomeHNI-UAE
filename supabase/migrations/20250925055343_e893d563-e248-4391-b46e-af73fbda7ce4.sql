-- Add plot_area_unit field to properties table for Land/Plot properties
ALTER TABLE public.properties 
ADD COLUMN plot_area_unit text DEFAULT 'sq-ft';

-- Add a comment to document the field
COMMENT ON COLUMN public.properties.plot_area_unit IS 'Unit of measurement for plot area (sq-ft, acre, bigha, gunta, cents, etc.)';

-- Create an index for better performance when filtering by plot area unit
CREATE INDEX idx_properties_plot_area_unit ON public.properties(plot_area_unit) WHERE property_type IN ('plot', 'land', 'Land/Plot');