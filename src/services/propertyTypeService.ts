import { supabase } from "@/integrations/supabase/client";

export interface PropertyTypeStats {
  property_type: string;
  count: number;
  display_name: string;
}

// Map database property types to user-friendly display names
const propertyTypeDisplayMap: Record<string, string> = {
  'apartment': 'Apartment/Flat',
  'villa': 'Independent House/Villa',
  'independent_house': 'Independent House/Villa',
  'plot': 'Plot/Land',
  'farmhouse': 'Farmhouse',
  'studio': 'Studio',
  'office': 'Office',
  'shop': 'Retail/Shop',
  'showroom': 'Showroom',
  'warehouse': 'Industrial/Warehouse',
  'coworking': 'Co-working',
  'hotel': 'Hospitality/Hotel'
};

export const fetchPropertyTypeStats = async (): Promise<PropertyTypeStats[]> => {
  try {
    // Get property types with their counts from property_real table
    const { data, error } = await supabase
      .from('property_real')
      .select('property_type')
      .eq('is_active', true)
      .not('property_type', 'is', null);

    if (error) {
      console.error('Error fetching property types:', error);
      return [];
    }

    // Count occurrences of each property type
    const typeCounts = data.reduce((acc: Record<string, number>, item) => {
      const type = item.property_type?.toLowerCase().trim();
      if (type) {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert to array with display names and sort by count (descending) then alphabetically
    const stats: PropertyTypeStats[] = Object.entries(typeCounts)
      .map(([type, count]) => ({
        property_type: type,
        count,
        display_name: propertyTypeDisplayMap[type] || type.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
      .sort((a, b) => {
        // First sort by count (descending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Then sort alphabetically by display name
        return a.display_name.localeCompare(b.display_name);
      });

    return stats;
  } catch (error) {
    console.error('Error fetching property type stats:', error);
    return [];
  }
};

// Fallback property types (when database is empty or unavailable)
export const getFallbackPropertyTypes = (): string[] => [
  "Apartment/Flat",
  "Independent House/Villa",
  "Plot/Land",
  "Farmhouse",
  "Studio",
  "Office",
  "Retail/Shop",
  "Showroom",
  "Industrial/Warehouse",
  "Co-working",
  "Agricultural Land",
  "Hospitality/Hotel"
];

export const getSortedPropertyTypes = async (): Promise<string[]> => {
  const stats = await fetchPropertyTypeStats();
  
  if (stats.length === 0) {
    return getFallbackPropertyTypes();
  }

  // Get unique display names from database stats
  const dbTypes = stats.map(stat => stat.display_name);
  
  // Add any missing fallback types that aren't in the database
  const fallbackTypes = getFallbackPropertyTypes();
  const missingTypes = fallbackTypes.filter(type => !dbTypes.includes(type));
  
  // Return database types first (sorted by frequency), then missing fallback types
  return [...dbTypes, ...missingTypes.sort()];
};