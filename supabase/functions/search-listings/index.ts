import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PropertySearchParams {
  intent: string;
  propertyType: string;
  country: string;
  state: string;
  city: string;
  budgetMin: string;
  budgetMax: string;
  page: string;
  pageSize: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams) as PropertySearchParams;
    
    const {
      intent,
      propertyType,
      country,
      state,
      city,
      budgetMin,
      budgetMax,
      page = '1',
      pageSize = '10'
    } = params;

    console.log('Search params:', params);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the query
    let query = supabase
      .from('properties')
      .select(`
        id, title, property_type, listing_type, expected_price, 
        city, locality, state, images, 
        bathrooms, balconies, furnishing, availability_type, 
        super_area, carpet_area, created_at
      `)
      .eq('status', 'approved');

    // Filter by intent (listing_type)
    if (intent) {
      const listingType = intent === 'buy' ? 'sale' : intent;
      query = query.eq('listing_type', listingType);
    }

    // Filter by property type
    if (propertyType && propertyType !== 'Others') {
      query = query.eq('property_type', propertyType);
    }

    // Filter by state
    if (state) {
      query = query.eq('state', state);
    }

    // Filter by city (optional)
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    // Filter by budget
    const minBudget = parseInt(budgetMin) || 0;
    const maxBudget = parseInt(budgetMax) || 999999999;
    
    if (minBudget > 0) {
      query = query.gte('expected_price', minBudget);
    }
    if (maxBudget < 999999999) {
      query = query.lte('expected_price', maxBudget);
    }

    // Apply pagination
    const pageNum = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    query = query.range(from, to);

    // Order by created_at for now (can be improved with relevance scoring)
    query = query.order('created_at', { ascending: false });

    const { data: properties, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Transform the data to match the expected format
    const items = (properties || []).map(property => ({
      id: property.id,
      title: property.title,
      type: property.property_type,
      intent: property.listing_type === 'sale' ? 'buy' : property.listing_type,
      priceInr: property.expected_price,
      city: property.city,
      state: property.state,
      country: 'India', // Assuming India for now
      image: property.images && property.images.length > 0 
        ? property.images[0] 
        : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
      badges: [
        property.furnishing && `${property.furnishing}`,
        property.availability_type && `${property.availability_type}`,
        property.super_area && `${property.super_area} sq ft`
      ].filter(Boolean),
      url: `/property/${property.id}`
    }));

    // Get total count for pagination
    let totalCount = count || 0;
    if (count === null) {
      // If count is null, we need to make a separate count query
      const { count: actualCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      totalCount = actualCount || 0;
    }

    const response = {
      items,
      total: totalCount,
      page: pageNum,
      pageSize: size,
      hasMore: (pageNum * size) < totalCount
    };

    console.log(`Found ${items.length} properties out of ${totalCount} total`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});