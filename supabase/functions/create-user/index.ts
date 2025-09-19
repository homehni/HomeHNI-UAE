import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== CREATE USER FUNCTION CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { name, email, password, role, status } = body;
    
    // Log each field separately
    console.log('Parsed fields:');
    console.log('- name:', name);
    console.log('- email:', email);
    console.log('- password:', password ? '[PROVIDED]' : '[MISSING]');
    console.log('- role:', role);
    console.log('- status:', status);

    // Validate required fields
    if (!name?.trim()) {
      console.error('Name is missing or empty');
      return new Response(
        JSON.stringify({ success: false, error: 'Name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!email?.trim()) {
      console.error('Email is missing or empty');
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!password?.trim()) {
      console.error('Password is missing or empty');
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!role?.trim()) {
      console.error('Role is missing or empty');
      return new Response(
        JSON.stringify({ success: false, error: 'Role is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '[SET]' : '[MISSING]');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '[SET]' : '[MISSING]');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error - missing environment variables' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Supabase client created, attempting to create auth user...');

    // Create auth user (let database trigger handle email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      user_metadata: {
        full_name: name.trim()
      }
    });

    if (authError) {
      console.error('Auth creation failed:', JSON.stringify(authError, null, 2));
      const code = (authError as any)?.code ?? (authError as any)?.status ?? 'unknown';
      let status = 400;
      let message = `Authentication error: ${authError.message}`;

      if (code === 'email_exists' || `${authError.message}`.toLowerCase().includes('already')) {
        status = 409;
        message = 'Email already registered. Please log in or reset your password.';
      } else if ((authError as any)?.status === 500 || code === 'unexpected_failure') {
        status = 502;
        message = 'Temporary auth service error. Please try again in a moment.';
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: message,
          code,
          details: authError
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
      );
    }

    if (!authData?.user) {
      console.error('No user data returned from auth creation');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create user - no user data returned' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Create profile using upsert to handle existing profiles
    console.log('Creating profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        full_name: name.trim(),
        verification_status: status === 'active' ? 'verified' : 'unverified'
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      console.error('Profile creation failed:', JSON.stringify(profileError, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Profile creation error: ${profileError.message}`,
          details: profileError
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Profile created successfully');

    // Assign role
    console.log('Assigning role:', role);
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: role.trim()
      });

    if (roleError) {
      console.error('Role assignment failed:', JSON.stringify(roleError, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Role assignment error: ${roleError.message}`,
          details: roleError
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('=== USER CREATED SUCCESSFULLY ===');
    console.log('User ID:', authData.user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: authData.user.id,
        message: 'User created successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unexpected server error: ${error?.message || 'Unknown error'}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});