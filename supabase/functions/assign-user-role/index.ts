import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed roles for this assignment tool
const ALLOWED_ROLES = new Set([
  'content_manager',
  'blog_content_creator',
  'lead_manager',
  'admin',
]);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const name = (body?.name ?? '').trim();
    const email = (body?.email ?? '').trim().toLowerCase();
    const password = (body?.password ?? '').trim();
    const role = (body?.role ?? '').trim().toLowerCase();

    // Basic validation
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!role || !ALLOWED_ROLES.has(role)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid role. Allowed: content_manager, blog_content_creator, lead_manager, admin' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error - missing environment variables' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let userId: string | null = null;
    let createdNewUser = false;

    // Try to create the auth user first
    try {
      if (!password || !name) {
        // If missing name/password, treat as assigning role to existing user only
        throw new Error('SKIP_CREATE');
      }

      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (authError) {
        // If already exists, continue to find the user
        throw authError;
      }

      userId = authData?.user?.id ?? null;
      createdNewUser = true;
    } catch (e: any) {
      // If user already exists or creation skipped, try to locate existing user by listing
      if (e?.message !== 'SKIP_CREATE') {
        // Known messages that indicate the user already exists
        const alreadyExists =
          typeof e?.message === 'string' &&
          (e.message.toLowerCase().includes('already registered') || e.message.toLowerCase().includes('exists'));
        if (!alreadyExists && e?.message !== 'SKIP_CREATE') {
          return new Response(
            JSON.stringify({ success: false, error: `Auth error: ${e?.message || 'Unknown error'}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
      }

      // Locate user by email via admin.listUsers (scan a few pages)
      for (let page = 1; page <= 5 && !userId; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) break;
        const found = data.users.find((u: any) => (u.email || '').toLowerCase() === email);
        if (found) userId = found.id;
        if (!data || data.users.length < 200) break; // last page
      }

      if (!userId) {
        return new Response(
          JSON.stringify({ success: false, error: 'User not found and could not be created. Please provide name and password to create a new user.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    // Ensure profile exists or create/update it
    const { error: profileError } = await admin
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          full_name: name || email,
          verification_status: 'unverified',
        },
        { onConflict: 'user_id' }
      );

    if (profileError) {
      return new Response(
        JSON.stringify({ success: false, error: `Profile error: ${profileError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Assign the role: replace existing roles with the selected role
    const { error: deleteRolesError } = await admin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteRolesError) {
      return new Response(
        JSON.stringify({ success: false, error: `Role cleanup error: ${deleteRolesError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { error: insertRoleError } = await admin
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (insertRoleError) {
      return new Response(
        JSON.stringify({ success: false, error: `Role assignment error: ${insertRoleError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Audit role change
    await admin.from('user_role_audit_log').insert({
      user_id: userId,
      old_role: null,
      new_role: role,
      changed_by: null,
      reason: createdNewUser ? 'Initial role on user creation (admin tool)' : 'Role assigned via admin tool',
    });

    return new Response(
      JSON.stringify({ success: true, user_id: userId, role, created: createdNewUser }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('assign-user-role unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Unexpected server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});